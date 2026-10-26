/* Moroccan Verve Talent — site content.
   Edit this file to update contact details, prices or survey numbers; the page re-renders from it. */
window.MVT_DATA = {
  // Fill these in to show your contact links in the footer. Empty values are hidden.
  contact: {
    email: "linafilahi229@gmail.com",
    phone: "+212 619-239822",
    instagram: "",  // e.g. "https://instagram.com/yourhandle"
    tiktok: "",     // e.g. "https://www.tiktok.com/@yourhandle"
  },

  // The 19 talents from the MVT website, with taglines and proposed monthly prices (DH).
  // price: null means no proposed price yet.
  categories: [
    { id: "all", label: "All talents" },
    { id: "stage", label: "Stage" },
    { id: "words", label: "Words and worlds" },
    { id: "screen", label: "Sound and screen" },
    { id: "art", label: "Art and style" },
    { id: "food", label: "Food" },
    { id: "sport", label: "Sport" },
  ],
  talents: [
    { id: "dancing", name: "Dancing", tagline: "Move like nobody's watching", icon: "dancing", cat: "stage", price: 200, includes: "Dance styles, technique and group routines" },
    { id: "contemporary", name: "Contemporary Dance", tagline: "Tell stories with your body", icon: "contemporary", cat: "stage", price: null, includes: "Storytelling through movement" },
    { id: "singing", name: "Singing", tagline: "Let your voice break free", icon: "singing", cat: "stage", price: 250, includes: "Vocal training, practice and group performances" },
    { id: "acting", name: "Acting", tagline: "Become every story", icon: "acting", cat: "stage", price: 200, includes: "Drama, character work and audition practice" },
    { id: "performing", name: "Performing Arts", tagline: "Own the stage, own the room", icon: "performing", cat: "stage", price: 220, includes: "Stage performance, movement and multidisciplinary performance" },
    { id: "poetry", name: "Poetry", tagline: "Turn pain into verses", icon: "poetry", cat: "words", price: 150, includes: "Poetry writing, spoken word and performance" },
    { id: "writing", name: "Writing", tagline: "Build worlds with words", icon: "writing", cat: "words", price: 150, includes: "Stories, scripts and creative writing workshops" },
    { id: "producing", name: "Producing", tagline: "Build the sound of tomorrow", icon: "producing", cat: "screen", price: 300, includes: "Beatmaking, music production and audio editing" },
    { id: "film", name: "Cinematography & Filmmaking", tagline: "Frame the unseen", icon: "film", cat: "screen", price: 300, includes: "Camera skills, storytelling, filming and editing" },
    { id: "animation", name: "Digital Animation", tagline: "Make the impossible move", icon: "animation", cat: "screen", price: 300, includes: "2D/3D animation basics and digital animation projects" },
    { id: "photo", name: "Photography", tagline: "Freeze a feeling forever", icon: "photo", cat: "screen", price: 250, includes: "Photography techniques, composition and editing" },
    { id: "drawing", name: "Drawing & Painting", tagline: "Paint the world you see", icon: "drawing", cat: "art", price: 200, includes: "Sketching, painting and visual-art techniques" },
    { id: "street", name: "Street Art & Muralism", tagline: "Turn walls into witnesses", icon: "street", cat: "art", price: 250, includes: "Street-art styles, mural design and supervised projects" },
    { id: "fashion", name: "Creative Fashion Design", tagline: "Wear your imagination", icon: "fashion", cat: "art", price: 250, includes: "Fashion concepts, sketching, styling and design" },
    { id: "worlds", name: "Worldbuilding", tagline: "Design universes from scratch", icon: "worlds", cat: "words", price: 200, includes: "Creating fictional worlds, characters, settings and stories" },
    { id: "baking", name: "Baking", tagline: "Turn flour into feeling", icon: "baking", cat: "food", price: 250, includes: "Breads, pastries, cakes and baking techniques" },
    { id: "culinary", name: "Culinary Arts & Gastronomy", tagline: "Plate your heritage, reinvent it", icon: "culinary", cat: "food", price: 250, includes: "Cooking techniques, food culture and creative cuisine" },
    { id: "football", name: "Football", tagline: "Dribble past every limit", icon: "football", cat: "sport", price: 180, includes: "Football skills, drills, teamwork and match practice" },
    { id: "sports", name: "Sports & Athletics", tagline: "Run toward who you'll become", icon: "sports", cat: "sport", price: 180, includes: "General sports, athletics, fitness and movement training" },
  ],

  // Membership packages (DH per month) and one-off fees.
  packages: [
    { id: "starter", name: "MVT Starter", price: 200, talents: 1, text: "One selected talent and access to the MVT community." },
    { id: "explorer", name: "MVT Explorer", price: 350, talents: 2, text: "Two talents, for members who want to explore different interests." },
    { id: "allrounder", name: "MVT All-Rounder", price: 550, talents: 3, text: "Three talents, subject to availability and material costs." },
    { id: "solidarity", name: "MVT Solidarity", price: 100, talents: null, text: "A limited number of reduced-price places, depending on available funding." },
  ],
  registrationFee: 50,
  fees: [
    { value: "50 DH", label: "One-time registration fee" },
    { value: "50–100 DH", label: "One-day workshop" },
    { value: "100–150 DH", label: "Special event or masterclass" },
  ],
  budget: {
    scenario: "50 members paying an average of 250 DH per month",
    revenue: 12500,
    costs: [
      { label: "Instructor payments", value: 5000, color: "blue" },
      { label: "Room rental and facilities", value: 2500, color: "green" },
      { label: "Materials and equipment", value: 1000, color: "red" },
      { label: "Marketing and administration", value: 1000, color: "ink" },
    ],
    remaining: 3000,
  },

  // Survey: 61 answers to an online questionnaire, 18–19 October 2026.
  survey: {
    total: 61,
    dates: "18–19 October 2026",
    questions: [
      { q: "Do you have a talent or hobby you’d like to share?", short: "Have a talent", answers: [["Yes", 48], ["Maybe", 13]] },
      { q: "What is your talent or hobby?", short: "Their talents", answers: [["Sports", 30], ["Dancing / Singing / Music", 8], ["Art / Fashion", 8], ["Cooking / Baking", 6], ["Videography / Photography", 5], ["Other", 4]] },
      { q: "Have you ever struggled to find a place to practise or express your talent?", short: "Struggled to find a place", answers: [["Sometimes", 28], ["Often", 23], ["Never", 10]] },
      { q: "What is your biggest challenge?", short: "Biggest challenge", answers: [["Lack of suitable spaces", 15], ["Lack of money or equipment", 14], ["Lack of opportunities", 13], ["Lack of support", 11], ["Other", 8]] },
      { q: "Would you join a platform that helps you showcase your talent and connect with others?", short: "Would join MVT", answers: [["Yes", 31], ["Maybe", 23], ["No", 7]] },
      { q: "What would you like MVT to offer?", short: "What MVT should offer", answers: [["Events and competitions", 24], ["Workshops and training", 23], ["Networking opportunities", 7], ["Online talent promotion", 7]] },
    ],
    quotes: [
      "I hope MVT will help us find places to train and organize competitions",
      "Provide a virtual gallery to display artwork, host monthly drawing contests, and offer workshops on art techniques",
      "Moroccan beatbox competitions",
      "To have a map showing places where I can practice my hobby and even a little community to chat and host events",
      "I want this project to help Moroccan people practice what they love freely with all the love & support",
      "Showcasing our talent through visuals that others can feel and enjoy",
      "I want indoor gymnastics and Zumba halls near me",
      "Give more opportunities to talents by organising events, trainings and competitions",
    ],
  },

  // Parts of the logo; x/y are positions on the 1600×1600 logo image.
  logoParts: [
    { id: "star", title: "The star", icon: "star", x: 800, y: 385, text: "A rising star: every member can shine. It also echoes the star on Morocco’s flag." },
    { id: "colours", title: "Spray-paint colours", icon: "drawing", x: 430, y: 520, text: "Bursts of street-art colour for the many kinds of talent MVT brings together." },
    { id: "letters", title: "The MVT letters", icon: "type", x: 1240, y: 700, text: "Bold, wide letters for a confident brand that gives young talent a loud voice." },
    { id: "redgreen", title: "Red and green", icon: "flag", x: 560, y: 1010, text: "The colours of the Moroccan flag, rooting MVT in Moroccan identity and pride." },
    { id: "crowd", title: "The crowd-surfer", icon: "users", x: 830, y: 960, text: "A performer lifted by the crowd: the MVT community carries every talent." },
    { id: "circle", title: "The circle", icon: "circle", x: 1405, y: 760, text: "Hand-drawn, like a stage or a spotlight: a space where everyone belongs." },
  ],
};
