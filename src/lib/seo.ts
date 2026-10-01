/**
 * SEO utilities and structured data for Avishka Udara portfolio
 */

export interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'portfolio' | 'profile';
  keywords?: string[];
  jsonLd?: object;
  noindex?: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'portfolio' | 'profile';
  keywords?: string[];
}

/**
 * Enhanced professional profile structured data for Avishka Udara
 */
export const professionalProfileStructuredData = {
  "@context": "https://schema.org",
  "@type": ["Person", "CreativeWork", "ProfilePage"],
  "@id": "https://avishkaudara.com/#person",
  "name": "Avishka Udara",
  "alternateName": ["Avishka Udara Liyanage", "Avishka U. Liyanage", "A. Udara"],
  "givenName": "Avishka",
  "familyName": "Udara",
  "additionalName": "Liyanage",
  "url": "https://avishkaudara.com",
  "mainEntityOfPage": "https://avishkaudara.com",
  "image": {
    "@type": "ImageObject",
    "url": "https://avishkaudara.com/media/og.jpg",
    "width": 1200,
    "height": 630
  },
  "description": "Avishka Udara is a professional visual designer, motion artist and 3D generalist from Sri Lanka with 9+ years of experience in brand identity, social campaigns, 2D/3D animation, CGI and creative development.",
  "disambiguatingDescription": "Visual Designer and Motion Artist from Sri Lanka specializing in brand identity, motion graphics, and 3D animation",
  
  // Professional Information
  "jobTitle": [
    "Visual Designer", 
    "Motion Artist", 
    "3D Generalist",
    "Creative Director",
    "Brand Identity Designer",
    "Motion Graphics Designer",
    "Freelance Designer"
  ],
  "hasOccupation": [
    {
      "@type": "Occupation",
      "name": "Visual Designer",
      "description": "Specializes in brand identity, logo design, social media graphics and visual campaigns",
      "skills": ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Brand Design", "Logo Design"],
      "occupationLocation": {
        "@type": "Country",
        "name": "Sri Lanka"
      }
    },
    {
      "@type": "Occupation", 
      "name": "Motion Graphics Artist",
      "description": "Creates 2D animation, motion graphics, logo animations and explainer videos",
      "skills": ["Adobe After Effects", "2D Animation", "Motion Graphics", "Video Editing"],
      "occupationLocation": {
        "@type": "Country", 
        "name": "Sri Lanka"
      }
    },
    {
      "@type": "Occupation",
      "name": "3D Artist",
      "description": "3D modeling, product visualization, CGI and 3D animation specialist",
      "skills": ["Blender", "3D Modeling", "Product Visualization", "CGI", "3D Animation"],
      "occupationLocation": {
        "@type": "Country",
        "name": "Sri Lanka"
      }
    }
  ],
  
  // Location & Contact
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "LK",
    "addressRegion": "Sri Lanka",
    "addressLocality": "Sri Lanka"
  },
  "nationality": {
    "@type": "Country",
    "name": "Sri Lanka"
  },
  "homeLocation": {
    "@type": "Place",
    "name": "Sri Lanka",
    "address": {
      "@type": "PostalAddress", 
      "addressCountry": "LK"
    }
  },
  "workLocation": "Remote Worldwide",
  
  // Contact Information
  "email": "audara799@gmail.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "audara799@gmail.com",
    "contactType": "Professional Inquiries",
    "areaServed": "Worldwide",
    "availableLanguage": "English"
  },
  
  // Professional Details
  "knowsAbout": [
    "Visual Design", "Motion Graphics", "3D Animation", "Brand Identity", 
    "Creative Direction", "Adobe After Effects", "Blender", "Adobe Photoshop", 
    "Adobe Illustrator", "Logo Design", "Social Media Design", "Package Design", 
    "UI/UX Design", "Video Editing", "CGI", "Product Visualization",
    "Character Animation", "Explainer Videos", "Creative Campaigns",
    "Brand Development", "Typography", "Color Theory", "Design Systems"
  ],
  
  "knowsLanguage": [
    {
      "@type": "Language",
      "name": "English",
      "alternateName": "en"
    },
    {
      "@type": "Language", 
      "name": "Sinhala",
      "alternateName": "si"
    }
  ],
  
  // Professional Experience
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Professional Experience",
    "description": "9+ Years Professional Experience in Visual Design and Motion Graphics"
  },
  
  // Awards & Recognition
  "award": [
    "9+ Years Professional Design Experience",
    "240+ Successfully Delivered Projects", 
    "60+ Satisfied Clients Worldwide",
    "12 Countries Served"
  ],
  
  // Work Examples
  "workExample": [
    {
      "@type": "CreativeWork",
      "name": "BTI Group Identity System", 
      "description": "Complete brand identity system for BTI Group including logo design, visual guidelines and brand applications",
      "dateCreated": "2024",
      "client": "BTI Group",
      "genre": "Brand Identity Design",
      "creator": {
        "@type": "Person",
        "name": "Avishka Udara"
      }
    },
    {
      "@type": "CreativeWork",
      "name": "2D Character Animation Portfolio",
      "description": "Hand-built character animation and motion graphics for various clients including music video animations",
      "dateCreated": "2023", 
      "genre": "Motion Graphics",
      "creator": {
        "@type": "Person",
        "name": "Avishka Udara"
      }
    },
    {
      "@type": "CreativeWork",
      "name": "Coin & Token CGI Visualization",
      "description": "Hard-surface 3D coin modeling with interactive models for fintech clients",
      "dateCreated": "2024",
      "client": "BBachain",
      "genre": "3D Visualization",
      "creator": {
        "@type": "Person", 
        "name": "Avishka Udara"
      }
    }
  ],
  
  // Services Offered
  "makesOffer": [
    {
      "@type": "Offer",
      "name": "Brand Identity Design",
      "description": "Complete brand identity systems including logo design, color palettes, typography and brand guidelines",
      "category": "Visual Design Services"
    },
    {
      "@type": "Offer", 
      "name": "Motion Graphics & Animation",
      "description": "2D animation, motion graphics, logo animations, explainer videos and social media animations",
      "category": "Motion Design Services"
    },
    {
      "@type": "Offer",
      "name": "3D Visualization & Animation", 
      "description": "3D modeling, product visualization, CGI and 3D animation for products and brands",
      "category": "3D Design Services"
    }
  ],
  
  // Professional Network
  "owns": {
    "@type": "CreativeWork",
    "name": "Avishka Udara Design Portfolio",
    "url": "https://avishkaudara.com"
  },
  
  // Additional Professional Info
  "slogan": "Design that moves.",
  "motto": "Design that moves.",
  "catchPhrase": "Visual Designer, Motion Artist & 3D Generalist from Sri Lanka",
  
  // Social Proof
  "interactionStatistic": [
    {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/CreateAction", 
      "userInteractionCount": 240,
      "description": "Projects completed"
    },
    {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WorksForAction",
      "userInteractionCount": 60,
      "description": "Clients served"
    }
  ],
  
  // Availability
  "availabilityStarts": new Date().toISOString().split('T')[0],
  "availabilityEnds": "2025-12-31",
  "seeks": {
    "@type": "Demand",
    "name": "Freelance Design Projects",
    "description": "Available for brand identity, motion graphics, 3D visualization projects worldwide"
  }
};

/**
 * Professional service/business structured data
 */
export const businessProfileStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://avishkaudara.com/#business", 
  "name": "Avishka Udara Design",
  "alternateName": ["Avishka Udara Creative Services", "AU Design"],
  "description": "Professional visual design, motion graphics and 3D animation services by Avishka Udara from Sri Lanka",
  "url": "https://avishkaudara.com",
  "logo": "https://avishkaudara.com/media/og.jpg",
  "image": "https://avishkaudara.com/media/og.jpg",
  
  "founder": {
    "@type": "Person",
    "name": "Avishka Udara",
    "@id": "https://avishkaudara.com/#person"
  },
  "employee": {
    "@type": "Person", 
    "name": "Avishka Udara",
    "@id": "https://avishkaudara.com/#person"
  },
  
  // Business Details
  "foundingDate": "2016",
  "slogan": "Design that moves.",
  "motto": "Visual design, motion graphics and 3D animation services",
  
  // Location
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "LK",
    "addressRegion": "Sri Lanka",
    "addressLocality": "Sri Lanka"
  },
  "areaServed": [
    {
      "@type": "Place",
      "name": "Worldwide"
    },
    {
      "@type": "Country",
      "name": "Sri Lanka"  
    },
    {
      "@type": "Country",
      "name": "Global"
    }
  ],
  
  // Services
  "serviceType": [
    "Visual Design",
    "Motion Graphics",
    "3D Animation", 
    "Brand Identity Design",
    "Logo Design",
    "Social Media Design",
    "Motion Graphics Animation",
    "3D Modeling",
    "Product Visualization",
    "Video Editing",
    "Creative Direction"
  ],
  
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Creative Design Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Brand Identity Design",
          "description": "Complete brand identity systems, logo design, and visual guidelines"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Motion Graphics & Animation", 
          "description": "2D animation, motion graphics, logo animations, and explainer videos"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "3D Visualization & Animation",
          "description": "3D modeling, product visualization, CGI, and 3D animation"
        }
      }
    ]
  },
  
  // Contact
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "audara799@gmail.com",
    "contactType": "Customer Service",
    "areaServed": "Worldwide",
    "availableLanguage": ["English", "Sinhala"]
  },
  
  // Professional Stats
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "bestRating": "5",
    "ratingCount": "60",
    "description": "Based on 60+ satisfied clients over 9+ years"
  },
  
  // Industries Served
  "knowsAbout": [
    "Healthcare Design",
    "Fintech Branding", 
    "Technology Companies",
    "Startup Branding",
    "NGO Design",
    "Product Visualization",
    "Social Media Marketing",
    "Brand Development"
  ],
  
  // Awards & Recognition  
  "award": [
    "9+ Years Professional Experience",
    "240+ Projects Successfully Delivered",
    "60+ Satisfied Clients",
    "12 Countries Served"
  ]
};
/**
 * FAQ structured data for rich snippets
 */
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who is Avishka Udara?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Avishka Udara is a professional visual designer, motion artist and 3D generalist from Sri Lanka with over 9 years of experience in brand identity design, motion graphics, 3D animation, and creative campaigns."
      }
    },
    {
      "@type": "Question", 
      "name": "What services does Avishka Udara offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Avishka Udara offers visual design services including brand identity design, logo creation, motion graphics, 2D/3D animation, social media campaigns, packaging design, and creative direction for businesses and organizations."
      }
    },
    {
      "@type": "Question",
      "name": "What software does Avishka Udara use?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Avishka Udara is proficient in Adobe After Effects, Blender, Photoshop, Illustrator, Premiere Pro, DaVinci Resolve, Figma, and other industry-standard creative software for visual design and motion graphics."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Avishka Udara based?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Avishka Udara is based in Sri Lanka and offers remote design services to clients worldwide. He has worked with clients across 12+ countries over his 9+ year career."
      }
    },
    {
      "@type": "Question",
      "name": "How much experience does Avishka Udara have?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Avishka Udara has 9+ years of professional experience in visual design, motion graphics, and 3D animation. He has completed 240+ projects for 60+ clients across multiple industries."
      }
    },
    {
      "@type": "Question",
      "name": "What industries does Avishka Udara work with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Avishka Udara has worked with clients in healthcare, fintech, technology, startups, NGOs, and various other industries. Notable clients include BTI Group, Spera Labs, Sahana Hospitals, and many others."
      }
    }
  ]
};

/**
 * Generate person JSON-LD structured data
 */
export function personJsonLd() {
  return professionalProfileStructuredData;
}

/**
 * Generate work/project JSON-LD structured data
 */
export function workJsonLd(data: {
  title: string;
  description: string;
  path: string;
  image?: string;
  client: string;
  year: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": data.title,
    "description": data.description,
    "url": `https://avishkaudara.com${data.path}`,
    "image": data.image ? `https://avishkaudara.com${data.image}` : undefined,
    "creator": {
      "@type": "Person",
      "name": "Avishka Udara",
      "url": "https://avishkaudara.com"
    },
    "client": {
      "@type": "Organization",
      "name": data.client
    },
    "dateCreated": data.year,
    "inLanguage": "en",
    "genre": "Visual Design"
  };
}

/**
 * Set SEO metadata for the current page
 */
export function setSeo(input: SeoInput = {}) {
  const baseTitle = "Avishka Udara — Visual Design, Motion & 3D";
  const baseDescription = "Avishka Udara is a visual designer, motion artist and 3D generalist from Sri Lanka with 9+ years of experience in brand identity, social campaigns, 2D/3D animation, CGI and creative development.";
  const baseUrl = "https://avishkaudara.com";

  const title = input.title ? `${input.title} — Avishka Udara` : baseTitle;
  const description = input.description || baseDescription;
  const image = input.image || "/media/og.jpg";
  const url = input.path ? `${baseUrl}${input.path}` : baseUrl;

  // Update document title
  document.title = title;

  // Update meta tags
  updateMetaTag("description", description);
  updateMetaTag("title", title);
  if (input.keywords?.length) {
    updateMetaTag("keywords", input.keywords.join(", "));
  }

  // Update Open Graph with enhanced data
  updateMetaProperty("og:title", title);
  updateMetaProperty("og:description", description);
  updateMetaProperty("og:image", image.startsWith("http") ? image : `${baseUrl}${image}`);
  updateMetaProperty("og:image:width", "1200");
  updateMetaProperty("og:image:height", "630");
  updateMetaProperty("og:image:alt", `${title} - Portfolio Preview`);
  updateMetaProperty("og:url", url);
  updateMetaProperty("og:type", input.type || "website");
  updateMetaProperty("og:site_name", "Avishka Udara Portfolio");
  updateMetaProperty("og:locale", "en_US");

  // Update Twitter Card with enhanced data
  updateMetaTag("twitter:card", "summary_large_image");
  updateMetaTag("twitter:title", title);
  updateMetaTag("twitter:description", description);
  updateMetaTag("twitter:image", image.startsWith("http") ? image : `${baseUrl}${image}`);
  updateMetaTag("twitter:image:alt", `${title} - Portfolio Preview`);
  updateMetaTag("twitter:creator", "@avishkaudara");
  updateMetaTag("twitter:site", "@avishkaudara");

  // Enhanced SEO meta tags
  updateMetaTag("classification", "Creative Services, Design Portfolio");
  updateMetaTag("category", "Visual Design, Motion Graphics, Creative Services");
  updateMetaTag("coverage", "Worldwide");
  updateMetaTag("distribution", "Global");
  updateMetaTag("rating", "General");
  updateMetaTag("revisit-after", "7 days");

  // Update canonical URL
  updateLinkTag("canonical", url);

  // Add robots directive with enhanced settings
  const robotsContent = input.noindex 
    ? "noindex, nofollow" 
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
  updateMetaTag("robots", robotsContent);

  // Geographic information
  updateMetaTag("geo.region", "LK");
  updateMetaTag("geo.country", "Sri Lanka");
  updateMetaTag("geo.placename", "Sri Lanka");
  updateMetaTag("ICBM", "7.8731, 80.7718");

  // Business information
  updateMetaTag("business:contact_data:locality", "Sri Lanka");
  updateMetaTag("business:contact_data:country_name", "Sri Lanka");
  updateMetaTag("business:contact_data:region", "Asia");

  // Dublin Core metadata
  updateMetaTag("DC.title", title);
  updateMetaTag("DC.creator", "Avishka Udara");
  updateMetaTag("DC.subject", "Visual Design, Motion Graphics, 3D Animation, Brand Identity");
  updateMetaTag("DC.description", description);
  updateMetaTag("DC.publisher", "Avishka Udara");
  updateMetaTag("DC.type", "Portfolio");
  updateMetaTag("DC.identifier", url);
  updateMetaTag("DC.language", "en");
  updateMetaTag("DC.rights", "© 2024 Avishka Udara. All rights reserved.");

  // Add structured data
  if (input.jsonLd) {
    updateJsonLd(input.jsonLd);
  }
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

/**
 * Helper function to update or create meta property tags (for Open Graph)
 */
function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

/**
 * Helper function to update or create link tags
 */
function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Update JSON-LD structured data
 */
function updateJsonLd(data: object) {
  // Remove existing dynamic structured data
  const existing = document.querySelector('script[data-dynamic-jsonld="true"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-dynamic-jsonld", "true");
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
}

/**
 * Generate page-specific SEO data with enhanced keywords and descriptions
 */
export const getPageSEO = (page: string, params?: Record<string, string>): SEOData => {
  const baseSEO = {
    title: "Avishka Udara — Visual Design, Motion & 3D",
    description: "Avishka Udara is a visual designer, motion artist and 3D generalist from Sri Lanka with 9+ years of experience in brand identity, social campaigns, 2D/3D animation, CGI and creative development.",
    image: "/media/og.jpg",
    type: 'website' as const
  };

  switch (page) {
    case '/':
      return {
        ...baseSEO,
        keywords: [
          "Avishka Udara", 
          "Visual Designer Sri Lanka", 
          "Motion Graphics Designer", 
          "3D Artist Sri Lanka",
          "Brand Identity Designer", 
          "Logo Designer", 
          "Creative Director",
          "Freelance Designer",
          "Sri Lankan Creative",
          "After Effects Expert",
          "Blender Artist",
          "Brand Designer",
          "Motion Animator",
          "Creative Services",
          "Design Portfolio Sri Lanka"
        ]
      };

    case '/work':
      const filter = params?.f;
      return {
        title: filter ? `${filter} Portfolio — Avishka Udara` : "Portfolio — Avishka Udara Visual Design Work",
        description: filter 
          ? `${filter} projects by Avishka Udara — professional visual design and motion graphics work from Sri Lanka.`
          : "Browse Avishka Udara's professional portfolio featuring visual design, motion graphics, 3D animation and brand identity projects for clients across healthcare, fintech, and technology industries.",
        image: "/media/og.jpg",
        type: 'portfolio' as const,
        keywords: filter ? [
          `Avishka Udara ${filter}`,
          `${filter} Portfolio`,
          `${filter} Designer Sri Lanka`,
          "Visual Design Work",
          "Creative Projects",
          "Professional Portfolio"
        ] : [
          "Avishka Udara Portfolio", 
          "Visual Design Work", 
          "Motion Graphics Portfolio", 
          "3D Animation Projects", 
          "Brand Identity Cases",
          "Logo Design Portfolio",
          "Creative Project Showcase",
          "Design Case Studies",
          "Motion Design Examples",
          "Brand Design Work",
          "Sri Lankan Designer Portfolio"
        ]
      };

    case '/about':
      return {
        title: "About Avishka Udara — Visual Designer & Motion Artist",
        description: "Meet Avishka Udara, a professional visual designer and motion artist from Sri Lanka specializing in brand identity, motion graphics and 3D animation with 9+ years of experience across multiple industries.",
        image: "/media/og.jpg",
        keywords: [
          "About Avishka Udara", 
          "Visual Designer Biography", 
          "Motion Artist Sri Lanka", 
          "Creative Professional",
          "Designer Background",
          "Creative Experience",
          "Brand Designer Story",
          "Motion Graphics Expert",
          "3D Animation Specialist",
          "Sri Lankan Creative Professional",
          "Freelance Designer Background"
        ]
      };

    case '/contact':
      return {
        title: "Contact Avishka Udara — Visual Design Services",
        description: "Get in touch with Avishka Udara for professional visual design, motion graphics, 3D animation and brand identity projects. Available for freelance work worldwide with fast turnaround times.",
        image: "/media/og.jpg",
        keywords: [
          "Contact Avishka Udara", 
          "Hire Visual Designer", 
          "Motion Graphics Services", 
          "3D Animation Services",
          "Brand Design Services",
          "Freelance Designer Contact",
          "Creative Services Inquiry",
          "Design Project Quote",
          "Motion Design Consultation",
          "Sri Lankan Designer Services",
          "Professional Design Services"
        ]
      };

    default:
      return baseSEO;
  }
};

/**
 * Generate structured data script tag
 */
export const generateStructuredData = (...dataObjects: object[]): string => {
  return dataObjects.map(data => 
    `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`
  ).join('\n');
};