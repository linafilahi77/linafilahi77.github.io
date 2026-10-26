# Moroccan Verve Talent (MVT) website

*Discover Talent. Inspire the Future.*

A single-page static website for Moroccan Verve Talent. It is plain HTML, CSS and JavaScript, with no build step and no dependencies, so it runs on GitHub Pages as it is.

## What's on the page

- **Spray-paint hero**: visitors can spray anywhere on the wall, over the logo and title too, in the five logo colours (press and drag with a mouse; on a phone, tap, swipe sideways, or hold and drag). The wall gets one sprayed intro when the page opens.
- **The problem and About**: the opening question and the full introduction text.
- **Logo explorer**: select the markers on the logo to read what each part means.
- **Every talent is welcome**: the 19 talents from the MVT site, with taglines, filters and proposed monthly prices. "Add to plan" sends a talent to the plan builder.
- **The gap, the key difference, mission and vision**.
- **Market study**: the IFC figures, with a link to the source, plus the target market and research.
- **Survey**: the 61 responses, with a chart for each question and quotes from respondents.
- **SWOT analysis and marketing mix**: the 4 Ps are shown as tabs.
- **Plans**: the packages, a plan builder (pick up to three talents and see the package and the monthly price), one-off fees, the illustrative budget and the pricing principles.
- **Competition, conclusion and footer**.

## Put it on GitHub Pages

**As its own repository**

1. Create a repository (for example `mvt`) and upload everything in this folder. `index.html` must be at the root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then click **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/mvt/`.

**Inside your existing web-projects repository**

Copy this folder into the repository as a subfolder, for example `mvt/`. All paths are relative, so it works at `https://<your-username>.github.io/<repo>/mvt/`.

**Optional: link previews.** Link previews on WhatsApp, Instagram and other apps need the full address of the share image. Once the site is live, change `og:image` in `index.html` to `https://<your-username>.github.io/<path>/assets/img/og-image.png`.

## Edit the content

All the editable content is in **`assets/js/data.js`**:

- `contact`: add your email, phone number, Instagram and TikTok links. Empty values are hidden, and until you fill one in the footer says "Contact details are coming soon".
- `talents`: names, taglines and monthly prices. `price: null` shows "Price soon" (used for Contemporary Dance, which has no price in the pricing file).
- `packages`, `fees`, `budget`: the pricing figures.
- `survey`: the numbers for each question and the quotes.
- `logoParts`: the logo explanations, and where each marker sits on the logo.

The long texts (introduction, mission, vision, 4 Ps, conclusion) are written directly in `index.html`.

## Preview it on your computer

Open a terminal in this folder and run:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` by double-clicking also works.

## Files

```
index.html               the page
favicon.ico
assets/css/style.css     all styles
assets/js/data.js        editable content
assets/js/main.js        interactions (spray wall, talents, plan builder, survey, tabs)
assets/js/icons.js       icon set (generated)
assets/img/              logo sizes, spray-paint splashes, favicons, social share image
```

## Credits

- Logo and content © Moroccan Verve Talent.
- Icons: [Lucide](https://lucide.dev), ISC licence.
- Fonts: Archivo and Permanent Marker from Google Fonts, SIL Open Font Licence.
- Market figures: IFC, *Assessment of the Creative and Cultural Industries in Morocco* (2026).
- Prices are proposed, illustrative figures for a student project.
