export const site = {
  name: "Avishka Udara",
  initials: "AU",
  role: "Visual Designer · Motion Artist · 3D Generalist",
  location: "Sri Lanka",
  timezone: "GMT+5:30",
  email: "audara799@gmail.com",
  telegram: "https://t.me/Avishka_udara",
  telegramHandle: "@Avishka_udara",
  drive: "https://drive.google.com/drive/folders/194GPtlevcTmcmE1zUH7hi3UdejsmO-fp",
  years: 9,
  tagline: "Design that moves.",
  intro:
    "I'm a multidisciplinary visual designer and motion artist from Sri Lanka. For the past 9+ years I've helped brands, hospitals, startups and NGOs turn ideas into identity systems, campaigns and films that actually land.",
  bestFit: "Brand identity, social campaigns, motion promos, and long-term creative support",
  availability: "Open for freelance, remote work, and ongoing partnerships",
} as const;

export const stats = [
  { value: 9, suffix: "+", label: "Years in design" },
  { value: 240, suffix: "+", label: "Projects delivered" },
  { value: 60, suffix: "+", label: "Brands & clients" },
  { value: 12, suffix: "", label: "Countries served" },
] as const;

export const process = [
  {
    step: "01",
    title: "Discovery",
    body: "We talk goals, audience and format. I audit what exists and find the gap worth filling.",
  },
  {
    step: "02",
    title: "Direction",
    body: "Concept routes, moodboards and a clear visual language before a single pixel ships.",
  },
  {
    step: "03",
    title: "Craft",
    body: "Design, animation, 3D and edit — produced in-house with obsessive attention to detail.",
  },
  {
    step: "04",
    title: "Delivery",
    body: "Organised exports, source files, templates and a system your team can actually run.",
  },
] as const;

export const capabilities = [
  {
    id: "visual",
    index: "01",
    name: "Visual Design",
    blurb: "Identity, campaigns and the everyday assets that keep a brand consistent.",
    items: [
      "Branding",
      "Social media",
      "Posters",
      "Advertising",
      "UI/UX",
      "Campaigns",
    ],
  },
  {
    id: "motion",
    index: "02",
    name: "Motion",
    blurb: "Frames that move — from a two-second logo sting to a full animated explainer.",
    items: [
      "2D animation",
      "Motion graphics",
      "Explainer videos",
      "Logo animation",
      "Social animations",
    ],
  },
  {
    id: "3d",
    index: "03",
    name: "3D",
    blurb: "Modelling, look development and rendered worlds for product and brand storytelling.",
    items: [
      "3D modeling",
      "Product visualization",
      "3D animation",
      "Abstract CGI",
      "Environment design",
    ],
  },
  {
    id: "video",
    index: "04",
    name: "Video",
    blurb: "Post-production from raw footage to graded, mixed, delivered cut.",
    items: [
      "Video editing",
      "Commercials",
      "Reels/Shorts",
      "Promotional videos",
      "Color grading",
      "VFX",
    ],
  },
  {
    id: "development",
    index: "05",
    name: "Development",
    blurb: "Front-end craft — design systems built into real, shipping interfaces.",
    items: [
      "Websites",
      "Web applications",
      "SaaS",
      "ERP systems",
      "POS systems",
      "Desktop applications",
      "Mobile applications",
    ],
  },
  {
    id: "lab",
    index: "06",
    name: "Experiments / Lab",
    blurb: "Where I break things on purpose. Tests that turn into something shippable.",
    items: [
      "AI experiments",
      "Creative coding",
      "WebGL",
      "Three.js",
      "Interactive experiments",
      "Interesting prototypes",
    ],
  },
] as const;

export const clients = [
  "BTI Group",
  "Spera Labs",
  "Sahana Hospitals",
  "Sachitra Hospital",
  "Rates.lk",
  "Maatha",
  "NexPay",
  "Bloom",
  "Ceylon Releaf",
  "Health Solutions & Innovations",
  "Global South Exports",
  "Implaaza",
  "QTG",
  "Shishu Boutique",
  "bitzIT",
  "Bitzi IT",
] as const;

export const nav = [
  { label: "Work", to: "/work" },
  { label: "Capabilities", to: "/#capabilities" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;
