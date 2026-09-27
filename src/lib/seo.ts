import { site } from "../data/site";

/**
 * Per-route metadata. The base document ships sensible defaults in
 * index.html; this layer rewrites them per route so a project link shared on
 * WhatsApp/LinkedIn previews *that project*, not the generic site card.
 */

/** Canonical origin. Configure with `VITE_SITE_URL` at build time; otherwise
 *  derive from the current location so canonical / og:url are always absolute
 *  no matter where the build happens to be hosted. */
export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const BASE_TITLE = "Avishka Udara — Visual Design, Motion & 3D";
const SEPARATOR = "—";

export type SeoInput = {
  /** page title; the base title is appended unless `raw` is set */
  title?: string;
  /** use `title` verbatim, without the base-title suffix */
  raw?: boolean;
  description?: string;
  /** route path (e.g. "/work/rates-lk-launch"), for canonical + og:url */
  path?: string;
  /** absolute or root-relative (e.g. "/media/og.jpg") */
  image?: string;
  type?: "website" | "article" | "profile";
  /** opt out of indexing (404, filtered views…) */
  noindex?: boolean;
  /** JSON-LD structured data, or false to clear it */
  jsonLd?: Record<string, unknown> | false;
};

const DEFAULTS: SeoInput = {
  title: BASE_TITLE,
  description:
    "Avishka Udara is a visual designer, motion artist and 3D generalist from Sri Lanka with 9+ years of experience in brand identity, social campaigns, 2D/3D animation, CGI and creative development.",
  path: "/",
  image: "/media/og.jpg",
  type: "website",
};

/** The resolved set — every optional field filled from DEFAULTS. */
type Resolved = Required<Omit<SeoInput, "raw" | "noindex" | "jsonLd">> &
  Pick<SeoInput, "raw" | "noindex" | "jsonLd">;

const abs = (p?: string) =>
  !p ? undefined : /^https?:\/\//i.test(p) ? p : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`;

/** Find or create a meta tag. */
function meta(attr: "name" | "property", key: string): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

const JSONLD_ID = "seo-jsonld";

function setJsonLd(data: Record<string, unknown> | false) {
  const existing = document.getElementById(JSONLD_ID);
  if (data === false) {
    existing?.remove();
    return;
  }
  const el = (existing as HTMLScriptElement | null) ?? document.createElement("script");
  el.id = JSONLD_ID;
  el.type = "application/ld+json";
  el.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(el);
}

/** Apply a set of metadata, filling gaps with the site defaults. */
export function setSeo(input: SeoInput = {}) {
  const o = { ...DEFAULTS, ...input } as Resolved;

  const fullTitle = o.raw || !o.title ? o.title : `${o.title} ${SEPARATOR} ${site.name}`;
  const url = abs(o.path) ?? SITE_URL;
  const image = abs(o.image) ?? abs(DEFAULTS.image) ?? SITE_URL;

  document.title = fullTitle ?? BASE_TITLE;

  meta("name", "description").content = o.description;
  meta("property", "og:title").content = fullTitle ?? BASE_TITLE;
  meta("property", "og:description").content = o.description;
  meta("property", "og:type").content = o.type ?? "website";
  meta("property", "og:url").content = url;
  meta("property", "og:image").content = image;
  meta("property", "og:site_name").content = site.name;
  meta("name", "twitter:card").content = "summary_large_image";
  meta("name", "twitter:title").content = fullTitle ?? BASE_TITLE;
  meta("name", "twitter:description").content = o.description;
  meta("name", "twitter:image").content = image;
  meta("name", "robots").content = o.noindex ? "noindex, follow" : "index, follow";

  setCanonical(url);
  setJsonLd(o.jsonLd ?? false);
}

/** Structured data: the person behind the site. */
export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressCountry: "LK" },
  url: SITE_URL,
  knowsAbout: ["Brand identity", "Motion graphics", "3D visualisation", "Video editing"],
});

/** Structured data: a single portfolio entry. */
export const workJsonLd = (o: {
  title: string;
  description: string;
  path: string;
  image?: string;
  client?: string;
  year?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: o.title,
  description: o.description,
  url: abs(o.path),
  image: abs(o.image) ?? abs("/media/og.jpg"),
  creator: { "@type": "Person", name: site.name },
  ...(o.client ? { client: { "@type": "Organization", name: o.client } } : {}),
  ...(o.year ? { datePublished: `${o.year}` } : {}),
});
