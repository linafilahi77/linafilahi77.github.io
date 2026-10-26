/* Moroccan Verve Talent — interactions. No dependencies. */
(function () {
  "use strict";

  const D = window.MVT_DATA;
  const ICONS = window.MVT_ICONS || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const icon = (name) => ICONS[name] || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => n.toLocaleString("en-US");
  const COLORS = { pink: "#EC1C8C", yellow: "#FFE500", blue: "#0A6FC2", green: "#138A3A", red: "#E52328", ink: "#1A1A1A" };

  function hydrateIcons(root = document) {
    $$("[data-icon]", root).forEach((el) => {
      if (!el.dataset.iconDone) { el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)); el.dataset.iconDone = "1"; }
    });
  }

  /* ---------------- header: progress, shadow, menu, scrollspy ---------------- */
  function initHeader() {
    const header = $("#header");
    const bar = $(".progress span");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    const btn = $(".menu-btn");
    const nav = $("#site-nav");
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      btn.innerHTML = `<span data-icon="${open ? "x" : "menu"}"></span>`;
      hydrateIcons(btn);
    };
    btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); btn.focus(); } });
    window.addEventListener("resize", () => { if (window.innerWidth > 940) setOpen(false); });

    // scrollspy: each section maps to one nav entry
    const map = { problem: "about", about: "about", logo: "about", gap: "about", difference: "about", identity: "about",
      talents: "talents", market: "market", survey: "survey", swot: "survey", mix: "plans", plans: "plans", competition: "plans",
      conclusion: "contact", contact: "contact" };
    const links = {};
    $$("a", nav).forEach((a) => { links[a.getAttribute("href").slice(1)] = a; });
    const setCurrent = (key) => Object.entries(links).forEach(([k, a]) => (k === key ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setCurrent(map[en.target.id] || null); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const top = document.getElementById("top");
    new IntersectionObserver((en) => { if (en[0].isIntersecting) setCurrent(null); }, { rootMargin: "-45% 0px -50% 0px" }).observe(top);
  }

  /* ---------------- hero: spray-paint wall ---------------- */
  function initWall() {
    const hero = $(".hero");
    const canvas = $(".wall");
    const ctx = canvas.getContext("2d");
    const logo = $(".hero-logo");
    const tools = $(".paint-tools");
    const palette = ["pink", "yellow", "blue", "green", "red"];
    let color = "pink";
    let W = 0, H = 0, dpr = 1;
    let rects = [];
    let drips = [];
    let spraying = false, pointer = { x: 0, y: 0 }, dwell = { x: 0, y: 0, t: 0 };
    let raf = 0;

    // swatches
    const sw = $(".swatches");
    palette.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "swatch"; b.style.background = COLORS[c];
      b.setAttribute("aria-label", `${c[0].toUpperCase() + c.slice(1)} paint`);
      b.setAttribute("aria-pressed", String(c === color));
      b.addEventListener("click", () => { color = c; $$(".swatch", sw).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); });
      sw.appendChild(b);
    });
    $(".clear-btn").addEventListener("click", () => { drips = []; ctx.clearRect(0, 0, W, H); });

    function measure() {
      const hr = hero.getBoundingClientRect();
      const pad = (el, p) => { const r = el.getBoundingClientRect(); return { l: r.left - hr.left - p, t: r.top - hr.top - p, r: r.right - hr.left + p, b: r.bottom - hr.top + p }; };
      rects = [pad(tools, 10)];
    }
    function resize() {
      const r = hero.getBoundingClientRect();
      const nw = Math.round(r.width), nh = Math.round(r.height);
      const ndpr = Math.min(window.devicePixelRatio || 1, 2);
      if (nw === W && nh === H && ndpr === dpr) { measure(); return; }
      // keep existing paint when the wall changes size
      let copy = null;
      if (W && H) { copy = document.createElement("canvas"); copy.width = canvas.width; copy.height = canvas.height; copy.getContext("2d").drawImage(canvas, 0, 0); }
      W = nw; H = nh; dpr = ndpr;
      canvas.width = Math.max(1, Math.round(W * dpr)); canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (copy) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(copy, 0, 0); ctx.restore(); }
      measure();
    }
    const blocked = (x, y) => x < 0 || y < 0 || x > W || y > H || rects.some((r) => x > r.l && x < r.r && y > r.t && y < r.b);

    function spray(x, y, radius, count, c) {
      ctx.fillStyle = COLORS[c];
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const over = Math.random() < 0.28;
        const d = over ? radius * (0.6 + Math.random() * 0.8) : radius * Math.pow(Math.random(), 1.5);
        const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
        if (blocked(px, py)) continue;
        const s = over ? 0.6 + Math.random() * 1.1 : 0.8 + Math.random() * 2.2;
        ctx.globalAlpha = over ? 0.25 + Math.random() * 0.4 : 0.18 + Math.random() * 0.4;
        ctx.beginPath(); ctx.arc(px, py, s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    const hexA = (c, a) => { const h = COLORS[c]; return `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`; };
    function softCore(x, y, r, c, a) {
      if (x - r < 0 || y - r < 0 || x + r > W || y + r > H) { /* allowed: canvas clips */ }
      if (rects.some((rc) => x + r > rc.l && x - r < rc.r && y + r > rc.t && y - r < rc.b)) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, hexA(c, a)); g.addColorStop(0.55, hexA(c, a * 0.6)); g.addColorStop(1, hexA(c, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    function addDrip(x, y, c, maxLen) {
      if (blocked(x, y)) return;
      drips.push({ x, y, len: 0, max: maxLen || 30 + Math.random() * 90, w: 2.5 + Math.random() * 3.5, v: 1.1 + Math.random() * 1.4, c, wob: Math.random() * 6.28 });
      loop();
    }
    function stepDrips() {
      drips = drips.filter((d) => {
        const nl = Math.min(d.max, d.len + d.v);
        const y0 = d.y + d.len, y1 = d.y + nl;
        const xw = d.x + Math.sin((d.y + nl) / 14 + d.wob) * 0.8;
        if (blocked(xw, y1 + 2)) { bulb(d, d.len); return false; }
        ctx.globalAlpha = 0.85; ctx.fillStyle = COLORS[d.c];
        const w = d.w * (1 - 0.3 * (nl / d.max));
        ctx.fillRect(xw - w / 2, y0, w, y1 - y0 + 0.6);
        ctx.globalAlpha = 1;
        d.len = nl; d.v *= 0.992;
        if (d.len >= d.max) { bulb(d, d.len); return false; }
        return true;
      });
    }
    function bulb(d, len) {
      ctx.globalAlpha = 0.9; ctx.fillStyle = COLORS[d.c];
      ctx.beginPath(); ctx.arc(d.x, d.y + len, d.w * 0.75, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    }
    function drawDripInstant(d) { while (drips.includes(d)) stepDrips(); }

    function frame(t) {
      raf = 0;
      if (spraying) {
        softCore(pointer.x, pointer.y, 24, color, 0.05);
        spray(pointer.x, pointer.y, 26, 70, color);
        if (Math.hypot(pointer.x - dwell.x, pointer.y - dwell.y) > 12) { dwell = { x: pointer.x, y: pointer.y, t }; }
        else if (t - dwell.t > 420) { addDrip(pointer.x + (Math.random() - 0.5) * 24, pointer.y + 14, color); dwell.t = t; }
      }
      stepDrips();
      if (spraying || drips.length) loop();
    }
    function loop() { if (!raf) raf = requestAnimationFrame(frame); }

    function splat(x, y, c, size = 1) {
      softCore(x, y, 38 * size, c, 0.5);
      spray(x, y, 34 * size, Math.round(320 * size), c);
      spray(x, y, 18 * size, Math.round(160 * size), c);
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) addDrip(x + (Math.random() - 0.5) * 40 * size, y + 16 * size, c);
    }

    const local = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const isUI = (e) => e.target.closest("a, button, .paint-tools");
    // Mouse and pen use pointer events. Touch uses touch events, which every mobile browser delivers
    // (some Android browsers never send touch pointer events here).
    // Touch: a quick tap splats; holding still or swiping sideways starts spraying.
    // Vertical swipes are left to the browser (touch-action: pan-y) so the page scrolls.
    let hold = 0, tap = null;
    const startSpray = () => {
      clearTimeout(hold); tap = null;
      splat(pointer.x, pointer.y, color, 0.6);
      spraying = true; dwell = { x: pointer.x, y: pointer.y, t: performance.now() };
      loop();
    };
    const stop = () => { clearTimeout(hold); tap = null; spraying = false; };

    hero.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || isUI(e) || e.button > 0) return;
      measure();
      pointer = local(e);
      startSpray();
    });
    hero.addEventListener("pointermove", (e) => { if (spraying && e.pointerType !== "touch") pointer = local(e); });
    window.addEventListener("pointerup", (e) => { if (e.pointerType !== "touch") stop(); });
    window.addEventListener("pointercancel", (e) => { if (e.pointerType !== "touch") stop(); });

    hero.addEventListener("touchstart", (e) => {
      if (e.touches.length > 1 || isUI(e)) { stop(); return; }
      measure();
      pointer = local(e.touches[0]);
      tap = { x: pointer.x, y: pointer.y, t: performance.now() };
      hold = setTimeout(startSpray, 180);
    }, { passive: true });
    hero.addEventListener("touchmove", (e) => {
      const p = local(e.touches[0]);
      if (spraying) {
        pointer = p;
        if (e.cancelable) e.preventDefault(); // keep the page still while painting
        return;
      }
      if (!tap) return;
      const dx = Math.abs(p.x - tap.x), dy = Math.abs(p.y - tap.y);
      if (dx > 8 && dx > dy) { pointer = p; startSpray(); if (e.cancelable) e.preventDefault(); }
      else if (dy > 8) stop(); // a vertical swipe: let the page scroll
    }, { passive: false });
    hero.addEventListener("touchend", (e) => {
      if (tap) {
        const p = local(e.changedTouches[0]);
        if (Math.hypot(p.x - tap.x, p.y - tap.y) < 12 && performance.now() - tap.t < 500) splat(p.x, p.y, color, 1);
      }
      stop();
    });
    hero.addEventListener("touchcancel", stop);
    window.addEventListener("blur", stop);

    // opening moment: the wall gets sprayed once in the logo's colours
    function intro() {
      const spots = window.innerWidth > 720
        ? [[0.12, 0.24, "pink"], [0.2, 0.72, "yellow"], [0.88, 0.22, "blue"], [0.8, 0.66, "green"], [0.06, 0.52, "red"], [0.95, 0.46, "pink"]]
        : [[0.07, 0.1, "pink"], [0.93, 0.08, "blue"], [0.06, 0.26, "yellow"], [0.94, 0.24, "green"], [0.5, 0.985, "red"]];
      const pts = spots.map(([fx, fy, c]) => ({ x: fx * W, y: fy * H, c })).filter((p) => !blocked(p.x, p.y));
      if (reduceMotion.matches) {
        pts.forEach((p) => { splat(p.x, p.y, p.c, 1.4); });
        drips.slice().forEach(drawDripInstant);
        return;
      }
      pts.forEach((p, i) => {
        setTimeout(() => {
          const start = performance.now(), dur = 520, dx = (Math.random() - 0.5) * 60, dy = (Math.random() - 0.5) * 30;
          const run = (now) => {
            const k = Math.min(1, (now - start) / dur);
            const rr = 30 + 14 * Math.sin(k * Math.PI);
            softCore(p.x + dx * k, p.y + dy * k, rr * 1.1, p.c, 0.07);
            spray(p.x + dx * k, p.y + dy * k, rr, 120, p.c);
            if (k < 1) requestAnimationFrame(run);
            else { for (let j = 0; j < 3; j++) addDrip(p.x + dx + (Math.random() - 0.5) * 50, p.y + dy + 22, p.c, 40 + Math.random() * 110); }
          };
          requestAnimationFrame(run);
        }, 250 + i * 260);
      });
    }

    let resizeTimer = 0;
    window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
    // wait for the logo and the fonts so the text and logo areas are measured at their final size
    let started = false;
    const start = () => { if (started) return; started = true; resize(); intro(); };
    const logoReady = new Promise((res) => { if (logo.complete) res(); else { logo.addEventListener("load", res, { once: true }); logo.addEventListener("error", res, { once: true }); } });
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([logoReady, Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))])]).then(() => requestAnimationFrame(start));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  }

  /* ---------------- logo explorer ---------------- */
  function initLogo() {
    const spots = $(".hotspots");
    const list = $(".logo-parts");
    let active = null;
    const select = (id) => {
      active = id;
      $$(".hotspot", spots).forEach((h) => { const on = h.dataset.id === id; h.classList.toggle("is-active", on); h.setAttribute("aria-pressed", String(on)); });
      $$(".part", list).forEach((p) => { const on = p.dataset.id === id; p.classList.toggle("is-active", on); p.setAttribute("aria-pressed", String(on)); });
    };
    D.logoParts.forEach((p) => {
      const h = document.createElement("button");
      h.type = "button"; h.className = "hotspot"; h.dataset.id = p.id;
      h.style.left = (p.x / 16) + "%"; h.style.top = (p.y / 16) + "%";
      h.setAttribute("aria-label", p.title);
      h.innerHTML = icon(p.icon);
      h.addEventListener("click", () => select(p.id));
      h.addEventListener("mouseenter", () => select(p.id));
      h.addEventListener("focus", () => select(p.id));
      spots.appendChild(h);

      const wrap = document.createElement("div");
      wrap.setAttribute("role", "listitem");
      wrap.innerHTML = `<button type="button" class="part" data-id="${p.id}" aria-pressed="false">
        <span class="part-icon">${icon(p.icon)}</span><strong>${esc(p.title)}</strong><span class="part-text">${esc(p.text)}</span></button>`;
      const b = wrap.firstElementChild;
      b.addEventListener("click", () => select(p.id));
      b.addEventListener("mouseenter", () => select(p.id));
      b.addEventListener("focus", () => select(p.id));
      list.appendChild(wrap);
    });
    select(D.logoParts[0].id);
  }

  /* ---------------- talents + plan ---------------- */
  const plan = new Set();
  const MAX = 3;
  let limitTimer = 0;
  const priceTxt = (t) => (t.price == null ? "Price soon" : `${t.price} DH<small>/month</small>`);

  function togglePlan(id) {
    if (plan.has(id)) plan.delete(id);
    else if (plan.size >= MAX) { showLimit(); return; }
    else plan.add(id);
    renderPlanState();
  }
  function showLimit() {
    $$(".limit-note").forEach((n) => n.remove());
    const msg = "Plans cover up to three talents. Remove one to add another.";
    const bar = $(".plan-bar");
    const note = document.createElement("p"); note.className = "limit-note"; note.setAttribute("role", "status"); note.textContent = msg;
    bar.after(note);
    const note2 = note.cloneNode(true); $(".builder-pick").appendChild(note2);
    clearTimeout(limitTimer);
    limitTimer = setTimeout(() => $$(".limit-note").forEach((n) => n.remove()), 4500);
  }

  function initTalents() {
    const filters = $(".filters");
    const grid = $(".talent-grid");
    const status = document.createElement("p"); status.className = "sr-only"; status.setAttribute("role", "status");
    filters.after(status);
    let cat = "all";

    D.categories.forEach((c) => {
      const n = c.id === "all" ? D.talents.length : D.talents.filter((t) => t.cat === c.id).length;
      const b = document.createElement("button");
      b.type = "button"; b.className = "filter"; b.dataset.cat = c.id;
      b.setAttribute("aria-pressed", String(c.id === cat));
      b.innerHTML = `${esc(c.label)}<span class="n">${n}</span>`;
      b.addEventListener("click", () => {
        cat = c.id;
        $$(".filter", filters).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        let shown = 0;
        $$(".t-card", grid).forEach((li) => { const show = cat === "all" || li.dataset.cat === cat || li.classList.contains("t-invent"); li.hidden = !show; if (show && !li.classList.contains("t-invent")) shown++; });
        status.textContent = `${shown} talents shown`;
      });
      filters.appendChild(b);
    });

    D.talents.forEach((t) => {
      const li = document.createElement("li");
      li.className = `t-card c-${t.cat}`; li.dataset.cat = t.cat; li.dataset.id = t.id;
      li.innerHTML = `<div class="t-top"><span class="t-icon">${icon(t.icon)}</span><span class="t-price">${priceTxt(t)}</span></div>
        <h3>${esc(t.name)}</h3><p class="t-tag">${esc(t.tagline)}</p>
        <button type="button" class="t-add" aria-pressed="false"><span class="t-add-icon">${icon("plus")}</span><span class="t-add-label">Add to plan</span><span class="sr-only"> ${esc(t.name)}</span></button>`;
      $(".t-add", li).addEventListener("click", () => togglePlan(t.id));
      grid.appendChild(li);
    });
    const inv = document.createElement("li");
    inv.className = "t-card t-invent";
    inv.innerHTML = `<div class="t-top"><span class="t-icon">${icon("plus")}</span></div><h3>Or invent a new one</h3>
      <p>Your talent isn’t listed? Every passion has a place at MVT.</p><a class="t-add" href="#contact">Tell us about it</a>`;
    grid.appendChild(inv);
  }

  function initBuilder() {
    const list = $(".pick-list");
    D.talents.forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `<button type="button" class="pick" data-id="${t.id}" aria-pressed="false"><span class="box"></span><span>${esc(t.name)}</span><span class="pick-price">${t.price == null ? "soon" : t.price + " DH"}</span></button>`;
      $(".pick", li).addEventListener("click", () => togglePlan(t.id));
      list.appendChild(li);
    });

    const pk = $(".packages");
    D.packages.forEach((p) => {
      const a = document.createElement("article");
      a.className = `pkg pkg-${p.id}`; a.dataset.talents = p.talents == null ? "" : String(p.talents);
      a.innerHTML = `<h3>${esc(p.name)}</h3><p class="pkg-price">${p.price} DH<small>/month</small></p><p>${esc(p.text)}</p>`;
      pk.appendChild(a);
    });

    const fees = $(".fees");
    D.fees.forEach((f) => { const d = document.createElement("div"); d.className = "fee"; d.innerHTML = `<strong>${esc(f.value)}</strong><span>${esc(f.label)}</span>`; fees.appendChild(d); });

    const b = D.budget;
    $(".budget-scenario").textContent = `Example: ${b.scenario}, so ${fmt(b.revenue)} DH of revenue.`;
    const bar = $(".budget-bar");
    const parts = b.costs.concat([{ label: "Remaining before other costs and taxes", value: b.remaining, color: "pink" }]);
    bar.setAttribute("aria-label", `Of ${fmt(b.revenue)} DH monthly revenue: ` + parts.map((p) => `${p.label} ${fmt(p.value)} DH`).join(", "));
    parts.forEach((p) => { const s = document.createElement("span"); s.className = `bg-${p.color}`; s.style.width = (p.value / b.revenue * 100) + "%"; bar.appendChild(s); });
    const leg = $(".budget-legend");
    leg.innerHTML = parts.map((p, i) => `<li${i === parts.length - 1 ? ' class="total"' : ""}><span class="dot bg-${p.color}"></span><span>${esc(p.label)}</span><span class="val">${i === parts.length - 1 ? "" : "−"}${fmt(p.value)} DH</span></li>`).join("");
    renderPlanState();
  }

  function renderPlanState() {
    const picked = D.talents.filter((t) => plan.has(t.id));
    // talent cards
    $$(".t-card[data-id]").forEach((li) => {
      const on = plan.has(li.dataset.id);
      li.classList.toggle("is-picked", on);
      const btn = $(".t-add", li);
      btn.setAttribute("aria-pressed", String(on));
      $(".t-add-label", btn).textContent = on ? "In your plan" : "Add to plan";
      $(".t-add-icon", btn).innerHTML = icon(on ? "check" : "plus");
    });
    $$(".pick").forEach((b) => { const on = plan.has(b.dataset.id); b.setAttribute("aria-pressed", String(on)); $(".box", b).innerHTML = on ? icon("check") : ""; });
    // plan bar
    const pb = $(".plan-bar");
    pb.hidden = picked.length === 0;
    $(".plan-count").textContent = String(picked.length);
    $(".plan-count-label").textContent = picked.length === 1 ? "talent" : "talents";
    // packages highlight
    $$(".pkg").forEach((p) => {
      const match = picked.length > 0 && p.dataset.talents === String(picked.length);
      p.classList.toggle("is-match", match);
      const flag = $(".pkg-flag", p);
      if (match && !flag) p.insertAdjacentHTML("afterbegin", '<span class="pkg-flag">Your plan</span>');
      if (!match && flag) flag.remove();
    });
    // result
    const r = $(".builder-result");
    if (!picked.length) {
      r.innerHTML = `<h3>Your monthly price</h3><p class="r-empty">Pick a talent to see which package fits and what you would pay each month.</p>
        <p class="r-note">Need a lower price? A limited number of MVT Solidarity places cost 100 DH a month.</p>`;
      return;
    }
    const pkg = D.packages.find((p) => p.talents === picked.length);
    const known = picked.every((t) => t.price != null);
    const sum = picked.reduce((a, t) => a + (t.price || 0), 0);
    const save = known && picked.length > 1 ? sum - pkg.price : 0;
    r.innerHTML = `<h3>Your monthly price</h3>
      <p class="r-pkg">${esc(pkg.name)}, ${picked.length} talent${picked.length > 1 ? "s" : ""}</p>
      <p class="r-price">${pkg.price} DH<small>/month</small></p>
      <ul class="r-list">${picked.map((t) => `<li><span>${esc(t.name)}</span><span>${t.price == null ? "price to be confirmed" : t.price + " DH/month on its own"}</span></li>`).join("")}</ul>
      <div class="r-lines">
        ${save > 0 ? `<p class="r-save">You save ${save} DH a month compared with separate prices.</p>` : ""}
        <p>First month with the ${D.registrationFee} DH registration fee: <strong>${pkg.price + D.registrationFee} DH</strong></p>
      </div>
      <p class="r-note">Need a lower price? A limited number of MVT Solidarity places cost 100 DH a month.</p>
      <button type="button" class="r-reset">Clear my plan</button>`;
    $(".r-reset", r).addEventListener("click", () => { plan.clear(); renderPlanState(); });
  }

  /* ---------------- tabs (shared) ---------------- */
  function tabs(tablist, onSelect) {
    const items = () => $$('[role="tab"]', tablist);
    const select = (tab, focus) => {
      items().forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      if (focus) tab.focus();
      onSelect(tab);
    };
    tablist.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t) select(t, false); });
    tablist.addEventListener("keydown", (e) => {
      const list = items(); const i = list.indexOf(document.activeElement); if (i < 0) return;
      let n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = list[(i + 1) % list.length];
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = list[(i - 1 + list.length) % list.length];
      if (e.key === "Home") n = list[0];
      if (e.key === "End") n = list[list.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
    return select;
  }

  function initMix() {
    const list = $(".mix-tabs");
    tabs(list, (tab) => { $$(".mix-panel").forEach((p) => { p.hidden = p.id !== tab.getAttribute("aria-controls"); }); });
  }

  /* ---------------- survey ---------------- */
  function initSurvey() {
    const S = D.survey;
    $(".survey-dates").textContent = S.dates;
    const tl = $(".q-tabs");
    const panel = $(".q-panel");
    const colors = ["green", "blue", "pink", "red", "green", "blue"];
    S.questions.forEach((q, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.className = "q-tab"; b.id = `q-tab-${i}`;
      b.setAttribute("aria-controls", "q-panel"); b.setAttribute("aria-selected", String(i === 0)); b.tabIndex = i === 0 ? 0 : -1;
      b.innerHTML = `<span class="qn">Q${i + 1}</span><span>${esc(q.short)}</span>`;
      tl.appendChild(b);
    });
    panel.id = "q-panel";
    const show = (tab) => {
      const i = Number(tab.id.split("-").pop());
      const q = S.questions[i];
      panel.setAttribute("aria-labelledby", tab.id);
      const total = q.answers.reduce((a, x) => a + x[1], 0);
      const max = Math.max(...q.answers.map((x) => x[1]));
      panel.innerHTML = `<h3>${esc(q.q)}</h3><p class="q-note">${total} answers</p><div class="bars">${q.answers.map(([label, n]) => {
        const pct = Math.round(n / total * 100);
        return `<div class="bar-row"><span class="bar-label">${esc(label)}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" data-w="${n / max * 100}" style="background:${COLORS[colors[i]]}"></span></span><span class="bar-value">${pct}% <small>(${n})</small></span></div>`;
      }).join("")}</div>`;
      const fills = $$(".bar-fill", panel);
      const grow = () => fills.forEach((f) => { f.style.width = f.dataset.w + "%"; });
      if (reduceMotion.matches) grow(); else requestAnimationFrame(() => requestAnimationFrame(grow));
    };
    const select = tabs(tl, show);
    // grow the first chart when it scrolls into view
    let first = true;
    new IntersectionObserver((en, obs) => { if (en[0].isIntersecting && first) { first = false; select($(".q-tab", tl), false); obs.disconnect(); } }, { threshold: 0.3 }).observe(panel);
    panel.innerHTML = `<h3>${esc(S.questions[0].q)}</h3>`;

    $(".quotes").innerHTML = S.quotes.map((q) => `<li class="quote">${esc(q)}</li>`).join("");
  }

  /* ---------------- count-up numbers ---------------- */
  function initCounters() {
    const els = $$("[data-count]");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) return;
    const render = (el, v) => {
      const dec = Number(el.dataset.decimals || 0);
      const n = dec ? v.toFixed(dec) : fmt(Math.round(v));
      el.textContent = `${el.dataset.prefix || ""}${n}${el.dataset.suffix || ""}`;
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target, target = Number(el.dataset.count), t0 = performance.now(), dur = 1100;
        const step = (now) => { const k = Math.min(1, (now - t0) / dur); render(el, target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
        setTimeout(() => render(el, target), dur + 250); // always land on the exact value
      });
    }, { threshold: 0.6 });
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight) { render(el, 0); io.observe(el); }
    });
    window.addEventListener("beforeprint", () => els.forEach((el) => { io.unobserve(el); render(el, Number(el.dataset.count)); }));
  }

  /* ---------------- footer ---------------- */
  function initFooter() {
    $(".year").textContent = String(new Date().getFullYear());
    const c = D.contact || {};
    const box = $(".contact-links");
    const links = [];
    if (c.email) links.push(`<a href="mailto:${esc(c.email)}">${icon("mail")}${esc(c.email)}</a>`);
    if (c.phone) links.push(`<a href="tel:${esc(c.phone.replace(/[^+\d]/g, ""))}">${icon("phone")}${esc(c.phone)}</a>`);
    if (c.instagram) links.push(`<a href="${esc(c.instagram)}" target="_blank" rel="noopener">${icon("instagram")}Instagram</a>`);
    if (c.tiktok) links.push(`<a href="${esc(c.tiktok)}" target="_blank" rel="noopener">${icon("music")}TikTok</a>`);
    box.innerHTML = links.length ? links.join("") : "<p>Contact details are coming soon.</p>";
  }

  /* ---------------- boot ---------------- */
  function boot() {
    hydrateIcons();
    initHeader();
    initTalents();
    initBuilder();
    initLogo();
    initSurvey();
    initMix();
    initCounters();
    initFooter();
    hydrateIcons();
    initWall();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
