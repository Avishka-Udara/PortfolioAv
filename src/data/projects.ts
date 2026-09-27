import type { MediaItem } from "../lib/media";
import { mediaIndex } from "../lib/media";

export type CategoryId = "visual" | "motion" | "3d" | "video" | "development" | "lab";

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: CategoryId;
  disciplines: string[];
  summary: string;
  /** source-path keys into generated/media.json — first entry is the cover */
  media: string[];
  tools: string[];
  featured?: boolean;
  /** bigger = leads the grid on larger screens */
  size?: "lg" | "md" | "sm";
  /**
   * Optional sub-sets inside the project — design families that belong
   * together (a screenshot series, a model + its renders). Rendered as one
   * stacked tile instead of spread flat across the grid.
   */
  sets?: { label: string; media: string[] }[];
};

export const categoryMeta: Record<
  CategoryId,
  { id: CategoryId; label: string; short: string; blurb: string }
> = {
  visual: {
    id: "visual",
    label: "Visual Design",
    short: "Design",
    blurb: "Identity, campaigns and the everyday assets that keep a brand consistent.",
  },
  motion: {
    id: "motion",
    label: "Motion",
    short: "Motion",
    blurb: "Frames that move — from a two-second logo sting to a full animated explainer.",
  },
  "3d": {
    id: "3d",
    label: "3D",
    short: "3D",
    blurb: "Modelling, look development and rendered worlds for product and brand storytelling.",
  },
  video: {
    id: "video",
    label: "Video",
    short: "Video",
    blurb: "Post-production from raw footage to graded, mixed, delivered cut.",
  },
  development: {
    id: "development",
    label: "Development",
    short: "Dev",
    blurb: "Front-end craft — design systems built into real, shipping interfaces.",
  },
  lab: {
    id: "lab",
    label: "Experiments / Lab",
    short: "Lab",
    blurb: "Where I break things on purpose. Tests that turn into something shippable.",
  },
};

export const categories: CategoryId[] = ["visual", "motion", "3d", "video", "development", "lab"];

export const projects: Project[] = [
  /* ------------------------------------------------------------- visual */
  {
    slug: "bti-group-identity",
    title: "BTI Group Identity System",
    client: "BTI Group",
    year: "2024",
    category: "visual",
    disciplines: ["Branding", "Campaigns"],
    summary:
      "A single geometric mark scaled across four very different businesses — investment, exchange, funds and an NFT marketplace — without any of them drifting from the parent brand.",
    media: [
      "Logos_png/BTI_GROUP_logo.png",
      "Logos_png/BTI_EXCHANGE_logo.png",
      "Logos_png/BTI INVESTMENT FUNDS_logo.png",
      "Logos_png/BTI NFT MARKETPLACE_logo.png",
    ],
    tools: ["Illustrator", "Photoshop", "After Effects"],
    featured: true,
    size: "lg",
  },
  {
    slug: "bti-wallet-app",
    title: "BTI Wallet — App & Store Design",
    client: "BTI Group",
    year: "2025",
    category: "development",
    disciplines: ["Mobile applications", "UI/UX"],
    summary:
      "Store-ready design for a crypto wallet Android app: full Play Store screenshot set, feature graphic and in-app UI built to stay legible from a 5-inch phone to a tablet.",
    media: [
      "Designings/PlayStore Screenshot Design/d120-01.jpg",
      "Designings/playstore_feature_image_design.jpg",
      "Designings/PlayStore Screenshot Design/d120-02.jpg",
      "Designings/PlayStore Screenshot Design/d120-03.jpg",
      "Designings/PlayStore Screenshot Design/d120-04.jpg",
      "Designings/PlayStore Screenshot Design/d120-05.jpg",
      "Designings/PlayStore Screenshot Design/d120-06.jpg",
    ],
    sets: [
      {
        label: "Play Store screenshot series",
        media: [
          "Designings/PlayStore Screenshot Design/d120-01.jpg",
          "Designings/PlayStore Screenshot Design/d120-02.jpg",
          "Designings/PlayStore Screenshot Design/d120-03.jpg",
          "Designings/PlayStore Screenshot Design/d120-04.jpg",
          "Designings/PlayStore Screenshot Design/d120-05.jpg",
          "Designings/PlayStore Screenshot Design/d120-06.jpg",
        ],
      },
    ],
    tools: ["Figma", "Photoshop", "After Effects"],
    featured: true,
    size: "md",
  },
  {
    slug: "crypto-campaign",
    title: "Crypto Campaign Suite",
    client: "BBachain & partners",
    year: "2024",
    category: "visual",
    disciplines: ["Campaigns", "Advertising", "Social media", "Posters"],
    summary:
      "A full campaign push for institutional crypto — thumbnail art, social cuts and 3D product renders built on one grid so every asset reads as the same brand at a glance.",
    media: [
      "Graphics/crypto 1.jpg",
      "Graphics/crypto 6 - 3D.jpg",
      "Graphics/crypto 4.jpg",
      "Graphics/crypto BoX 3D.jpg",
      "Graphics/crypto 5.jpg",
      "Graphics/crypto 2.jpg",
      "Graphics/crypto 3.jpg",
      "Graphics/crypto 7 - 3D mix.jpg",
    ],
    sets: [
      {
        label: "Campaign poster series",
        media: [
          "Graphics/crypto 1.jpg",
          "Graphics/crypto 2.jpg",
          "Graphics/crypto 3.jpg",
          "Graphics/crypto 4.jpg",
          "Graphics/crypto 5.jpg",
        ],
      },
      {
        label: "3D render set",
        media: [
          "Graphics/crypto 6 - 3D.jpg",
          "Graphics/crypto 7 - 3D mix.jpg",
          "Graphics/crypto BoX 3D.jpg",
        ],
      },
    ],
    tools: ["Photoshop", "Blender", "After Effects"],
    featured: true,
    size: "lg",
  },
  {
    slug: "maatha-packaging",
    title: "Maatha Packaging Design",
    client: "Maatha",
    year: "2024",
    category: "visual",
    disciplines: ["Branding", "Posters"],
    summary:
      "Packaging for a Sri Lankan kithul syrup and tea line — shelf-legible hierarchy, ingredient storytelling and a warm palette that survives low-cost printing.",
    media: [
      "Graphics/MAATHA_Product_designs/Maatha_Tea_Packaage_design.jpg",
      "Graphics/MAATHA_Product_designs/maatha_kithul_syrup.png",
      "Logos_png/Maatha_logo.png",
    ],
    tools: ["Illustrator", "Photoshop"],
    featured: true,
  },
  {
    slug: "spera-healthcare",
    title: "Spera Labs Healthcare Brand",
    client: "Spera Labs",
    year: "2023",
    category: "visual",
    disciplines: ["Branding", "Social media", "Advertising"],
    summary:
      "Business collateral, sticker packs and social promos for a diagnostics lab — a system built to make a medical brand feel approachable without losing clinical trust.",
    media: [
      "Graphics/Speraaa_Hospitaals_Business_card.jpg",
      "Graphics/stiker pack-01.jpg",
      "Graphics/woumen_day_post_spera_labs.jpg",
      "Graphics/Spera_Hospital_social_media_promo.jpg",
      "Graphics/stiker pack.2-01.jpg",
    ],
    tools: ["Illustrator", "Photoshop"],
    featured: true,
    size: "lg",
  },
  {
    slug: "sachitra-hospital",
    title: "Sachitra Hospital Social Campaign",
    client: "Sachitra Hospital",
    year: "2023",
    category: "visual",
    disciplines: ["Social media", "Campaigns", "Posters"],
    summary:
      "A sustained content run for a private hospital — service promos, awareness posts and recruitment creative on a repeatable weekly template.",
    media: [
      "Graphics/Sachitra_Hospiital/post 01 salmon-01.jpg",
      "Graphics/Sachitra_Hospiital/Post 03-01.jpg",
      "Graphics/Sachitra_Hospiital/Post 05-01.jpg",
      "Graphics/Sachitra_Hospiital/Post 09-01.jpg",
      "Graphics/Sachitra_Hospiital/P02.jpg",
      "Graphics/Sachitra_Hospiital/P06.3.jpg",
      "Graphics/Sachitra_Hospiital/P11.jpg",
    ],
    tools: ["Photoshop", "Illustrator"],
    featured: true,
    size: "md",
  },
  {
    slug: "sahana-hospitals",
    title: "Sahana Hospitals Content System",
    client: "Sahana Hospitals",
    year: "2023",
    category: "visual",
    disciplines: ["Social media", "Campaigns", "Posters"],
    summary:
      "Cover art, service posts and hiring creative for a hospital group — designed as a template set so their in-house team can keep publishing without me.",
    media: [
      "Graphics/Sahana_Hospitals/cover.2ny.jpg",
      "Graphics/Sahana_Hospitals/post 04.3-01.jpg",
      "Graphics/Sahana_Hospitals/post 12-01.jpg",
      "Graphics/Sahana_Hospitals/post 23-01.jpg",
      "Graphics/Sahana_Hospitals/post 31.jpg",
      "Graphics/Sahana_Hospitals/post 03-01.jpg",
      "Graphics/Sahana_Hospitals/Hiring.jpg",
    ],
    tools: ["Photoshop", "Illustrator"],
    featured: true,
  },
  {
    slug: "print-packaging",
    title: "Print, Packaging & Merch",
    client: "Multiple",
    year: "2023",
    category: "visual",
    disciplines: ["Branding", "Advertising"],
    summary:
      "Box and bottle mockups, apparel, catalogues and book covers — physical brand touchpoints rendered and art-directed to look real before a single unit is produced.",
    media: [
      "Designings/Box_Mockup_2.jpg",
      "Designings/VitaminD3_bottle_design_and_mockup.jpg",
      "Designings/tshirt_Mockup.jpg",
      "Designings/mockup.jpg",
      "Designings/cute_Bunny_Package_Mockup.png",
      "Designings/ROST_logo_release_mockup.jpg",
      "Graphics/ctlg 2-01.jpg",
      "Graphics/book cover.png",
    ],
    tools: ["Photoshop", "Illustrator", "Blender"],
    featured: true,
    size: "md",
  },
  {
    slug: "thumbnail-campaign",
    title: "Thumbnails & Scroll Stoppers",
    client: "Multiple",
    year: "2022",
    category: "visual",
    disciplines: ["Advertising", "Posters", "Campaigns"],
    summary:
      "YouTube thumbnails and feed posts engineered for the first half-second — big type, hard contrast, one idea per frame.",
    media: [
      "Designings/Youtube_thumbnail.jpg",
      "Graphics/IMG_6960.jpg",
      "Graphics/motivational_post 04-01.jpg",
      "Graphics/CackeBySaandali_Post.jpg",
    ],
    tools: ["Photoshop", "After Effects"],
  },
  {
    slug: "brand-identity-collection",
    title: "Identity & Logo Collection",
    client: "Multiple",
    year: "2022",
    category: "visual",
    disciplines: ["Branding"],
    summary:
      "Marks, monograms and lockups for founders, NGOs and exporters — each built from a clear idea, then tested at the sizes it will actually be used at.",
    media: [
      "Logos_png/Ceylon Releaf-01.png",
      "Logos_png/Nex_Pay_logo.png",
      "Logos_png/Bloom_logo.png",
      "Logos_png/Shishu_boutique_logo.png",
      "Logos_png/HSI_logo.png",
      "Logos_png/GlobalShouth_logo.png",
      "Logos_png/rates.lk_logo.png",
      "Logos_png/logo_white.png",
      "Logos_png/bitzIT_logo.png",
    ],
    tools: ["Illustrator", "Photoshop"],
    featured: true,
    size: "md",
  },
  {
    slug: "community-social",
    title: "Community & NGO Social",
    client: "Implaaza, JLAN, Kirula & more",
    year: "2022",
    category: "visual",
    disciplines: ["Social media", "Campaigns", "Posters"],
    summary:
      "Festival posts, awareness creative and covers for community organisations — designed to be shared, printed and reused by volunteers, not just approved once.",
    media: [
      "Graphics/implaaza_posts/hny-01.jpg",
      "Graphics/JLAN_Social_Media_Cover_image.jpg",
      "Graphics/KIRULA_Social_Media_Cover_Image.jpg",
      "Graphics/implaaza_posts/wp02-01.jpg",
      "Graphics/implaaza_posts/wp03-01.jpg",
      "Graphics/JLAN_social_media_post.jpg",
      "Graphics/get_brand_social_media_post.jpg",
    ],
    tools: ["Photoshop", "Illustrator"],
  },
  {
    slug: "nft-brand-art",
    title: "NFT & Collectible Art",
    client: "BTI NFT Marketplace",
    year: "2023",
    category: "visual",
    disciplines: ["Campaigns", "Advertising", "3D modeling"],
    summary:
      "Character and collectible artwork for an NFT marketplace launch, extended into 3D so the identity could move as well as sit still.",
    media: [
      "Designings/girl_nft_design.jpg",
      "Designings/Newline_post_design.jpg",
      "Graphics/m.d p-3-01.jpg",
    ],
    tools: ["Photoshop", "Blender", "After Effects"],
  },

  /* ------------------------------------------------------------- motion */
  {
    slug: "qtg-logo-animation",
    title: "QTG Logo Animation",
    client: "Quick Token Generator",
    year: "2024",
    category: "motion",
    disciplines: ["Logo animation", "Motion graphics"],
    summary:
      "Two logo stings for the same mark — a crisp 2D build and a heavier 3D version — each under ten seconds and built to loop cleanly on a splash screen.",
    media: [
      "2D/An103 QTG_logo_animatioon.mp4",
      "3D/logo_animation.mp4",
      "Logos_png/BTI NFT MARKETPLACE_logo.png",
    ],
    tools: ["After Effects", "Blender"],
    featured: true,
  },
  {
    slug: "2d-character-animation",
    title: "2D Character Animation",
    client: "Multiple",
    year: "2023",
    category: "motion",
    disciplines: ["2D animation", "Motion graphics"],
    summary:
      "Hand-built character animation set to music — full-body rigs, frame-by-frame cleanup and a 38-second animated piece that holds up outside a phone screen.",
    media: [
      "2D/girl_2d_animation_song.mp4",
      "2D/Comp 1.gif",
      "2D/Comp 1_2.gif",
      "2D/An31.mp4",
    ],
    tools: ["After Effects", "Photoshop", "TVPaint"],
    featured: true,
    size: "lg",
  },
  {
    slug: "motion-social-reels",
    title: "Motion Social Reels",
    client: "Multiple",
    year: "2023",
    category: "motion",
    disciplines: ["Social animations", "Motion graphics", "2D animation"],
    summary:
      "A library of vertical motion pieces — kinetic type, transitions and simple character rigs — produced in batches so a brand can post consistently for months.",
    media: [
      "2D/An 57 ver.mp4",
      "2D/An83.vertical.mp4",
      "2D/An85.mp4",
      "2D/An88.mp4",
      "2D/An 95.4.mp4",
      "2D/An108-2.mp4",
      "2D/An93 s.mp4",
      "2D/An116.2.mp4",
      "2D/An118.mp4",
      "2D/66.mp4",
      "2D/D179 9X16 s.mp4",
    ],
    tools: ["After Effects", "Illustrator"],
    featured: true,
    size: "md",
  },
  {
    slug: "ugc-social-ads",
    title: "UGC-Style Social Ads",
    client: "Rates.lk & partners",
    year: "2024",
    category: "video",
    disciplines: ["Reels/Shorts", "Video editing", "Promotional videos"],
    summary:
      "Text-led performance ads built for the scroll — hook in the first two seconds, claim on screen, and a price card that lands before the viewer mutes.",
    media: [
      "2D/an25 - text based  ugc.mp4",
      "2D/promo 1.2.mp4",
      "Graphics/rates.lk_post.jpg",
    ],
    tools: ["After Effects", "Premiere Pro"],
    featured: true,
  },

  /* ---------------------------------------------------------------- 3D */
  {
    slug: "token-coin-cgi",
    title: "Coin & Token CGI",
    client: "BBachain / fintech",
    year: "2024",
    category: "3d",
    disciplines: ["3D modeling", "Product visualization", "Abstract CGI"],
    summary:
      "Hard-surface coin modelling with full interactive models — open the viewer and orbit the mesh to see the bevels, micro-text and edge lettering from every angle the brief cared about.",
    media: [
      "3D/coin/02.png",
      "3D/BBA_coin/closeup0032.png",
      "3D/coin/03.png",
      "3D/coin/04.png",
      "3D/BBA_coin/closeup1.png",
      "3D/coin/e coin 2.2.obj",
      "3D/BBA_coin/coin.obj",
      "3D/an33.mp4",
    ],
    tools: ["Blender", "Substance Painter", "DaVinci Resolve"],
    featured: true,
    size: "lg",
  },
  {
    slug: "furniture-modeling",
    title: "Furniture Modelling Set",
    client: "Product visualisation",
    year: "2023",
    category: "3d",
    disciplines: ["3D modeling", "Environment design", "Product visualization"],
    summary:
      "A modelled chair and table set with both source meshes available to orbit — lit and rendered as a coherent catalogue, same HDRI and camera language so the range reads as one range.",
    media: [
      "3D/chair_model_images/chair 02.png",
      "3D/table_model_images/table v2-1.png",
      "3D/chair_model_images/chair 03.png",
      "3D/table_model_images/table v2-2.png",
      "3D/chair_model_images/chair 04.png",
      "3D/table_model_images/table v2-3.png",
      "3D/chair_model_images/chair 05.png",
      "3D/table_model_images/table v2-4.png",
      "3D/chair_model_images/chair 06.png",
      "3D/table_model_images/table v2-5.png",
      "3D/chair_model_images/chair.obj",
      "3D/table_model_images/table.obj",
    ],
    tools: ["Blender", "Cycles", "Photoshop"],
    featured: true,
    size: "md",
  },
  {
    slug: "abstract-cgi",
    title: "Abstract CGI Experiments",
    client: "Self-initiated",
    year: "2024",
    category: "3d",
    disciplines: ["Abstract CGI", "3D animation", "Environment design"],
    summary:
      "Loops, light studies and procedural forms made to test a renderer rather than sell anything — the playground where most of my 3D instincts were earned.",
    media: [
      "3D/an350001-0165.mp4",
      "3D/an67.mp4",
      "3D/animation1.mp4",
      "3D/an128 s.mp4",
      "3D/An124_1.mp4",
      "3D/An127.2.mp4",
    ],
    tools: ["Blender", "After Effects"],
    featured: true,
  },
  {
    slug: "bti-nft-marketplace-film",
    title: "BTI NFT Marketplace Film",
    client: "BTI Group",
    year: "2024",
    category: "3d",
    disciplines: ["3D animation", "Abstract CGI", "Motion graphics"],
    summary:
      "A short 3D brand film for a marketplace launch — logo construction, motion and a rendered environment tied back to the identity system.",
    media: [
      "3D/BTI NFT MARKETPLACE0001-0240.mp4",
      "Logos_png/BTI NFT MARKETPLACE_logo.png",
    ],
    tools: ["Blender", "After Effects"],
  },
  {
    slug: "3d-product-film",
    title: "3D Product Films",
    client: "Multiple",
    year: "2023",
    category: "3d",
    disciplines: ["Product visualization", "3D animation"],
    summary:
      "Long-form 3D product films — slow camera moves, deliberate lighting and enough run-time to actually explain how something works.",
    media: [
      "3D/0080-1500_1.mp4",
      "3D/An96 ver.mp4",
    ],
    tools: ["Blender", "DaVinci Resolve", "After Effects"],
  },

  /* -------------------------------------------------------------- video */
  {
    slug: "rates-lk-launch",
    title: "Rates.lk Product Launch",
    client: "Rates.lk",
    year: "2024",
    category: "video",
    disciplines: ["Promotional videos", "Video editing", "Motion graphics", "Color grading"],
    summary:
      "A 54-second launch film and a matching website promo — cut, graded and sound-designed to explain a rate-tracking product in under a minute.",
    media: [
      "2D/rates.lk_website_promo.mp4",
      "Graphics/rate_card.jpg",
      "Logos_png/rates.lk_logo.png",
      "Graphics/p03.jpg",
      "Graphics/P11.jpg",
    ],
    tools: ["After Effects", "Premiere Pro", "DaVinci Resolve"],
    featured: true,
    size: "lg",
  },

  /* --------------------------------------------------------- development */
  {
    slug: "website-promo-film",
    title: "Website Promo Films",
    client: "Rates.lk, Maatha & more",
    year: "2024",
    category: "development",
    disciplines: ["Websites", "Web applications", "Motion graphics"],
    summary:
      "Designed and built marketing sites, then animated them — screen-captured UI, kinetic type and motion that makes a web product feel expensive.",
    media: [
      "2D/An 57 ver.mp4",
      "Graphics/Felx_Designs/flex 2.5X5-01.jpg",
      "Graphics/slfast_Social_media_post.jpg",
    ],
    tools: ["Figma", "React", "After Effects"],
  },

  /* ----------------------------------------------------------------- lab */
  {
    slug: "lab-experiments",
    title: "Lab: Ongoing Experiments",
    client: "Self-initiated",
    year: "2024",
    category: "lab",
    disciplines: ["Creative coding", "WebGL", "Three.js", "Interactive experiments", "AI experiments"],
    summary:
      "Where I test new tools before a client ever sees them — generative visuals, shader studies and interface prototypes built to find the next thing worth making.",
    media: [
      "Graphics/x banner.jpg",
      "Graphics/smas_property_social_media_Post.jpg",
      "Graphics/SWBuddy.png",
      "Graphics/car_Details_post.jpg",
      "Graphics/HSI_SocialMedia_post/02-01.jpg",
      "Graphics/HSI_SocialMedia_post/P01-01.jpg",
    ],
    tools: ["Three.js", "GLSL", "Blender", "Figma"],
  },
];

/* ------------------------------------------------------------- helpers -- */

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const featured = projects.filter((p) => p.featured);

export const usedMediaKeys = new Set(projects.flatMap((p) => p.media));

/** Human labels for source folders, used by the archive grid. */
const FOLDER_LABELS: Record<string, string> = {
  "companies_and_NGO_i_works_with": "Client logos",
  Designings: "Packaging & mockups",
  Graphics: "Graphics & campaigns",
  Logos_png: "Logos",
  "2D": "2D animation",
  "3D": "3D & CGI",
};

/** Everything not attached to a curated project, grouped for the archive grid. */
export const archiveGroups = (() => {
  const groups: Record<string, string[]> = {};
  for (const key of Object.keys(mediaIndex)) {
    if (usedMediaKeys.has(key)) continue;
    const [folder, ...rest] = key.split("/");
    // sub-folders (e.g. Graphics/Sahana_Hospitals) keep their own name
    const base = FOLDER_LABELS[folder] ?? folder.replace(/_/g, " ");
    const label = rest.length > 1 ? `${base} — ${rest[0].replace(/_/g, " ")}` : base;
    (groups[label] ??= []).push(key);
  }
  return Object.entries(groups)
    .map(([label, keys]) => ({ label, keys }))
    .sort((a, b) => b.keys.length - a.keys.length);
})();

/** Resolve a project's media, dropping any key that failed to process. */
export const resolveMedia = (p: Project): MediaItem[] =>
  p.media.map((k) => mediaIndex[k]).filter(Boolean) as MediaItem[];
