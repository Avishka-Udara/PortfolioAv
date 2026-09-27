/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Canonical site origin, e.g. "https://example.com". Used for absolute SEO
   * tags (canonical, og:url) and to build public/sitemap.xml at build time.
   * When unset the app falls back to window.location.origin.
   */
  readonly VITE_SITE_URL?: string;
  /**
   * Formspree form ID (the part after /f/ in your form's action URL). When set,
   * the contact page posts to a real form instead of only opening a mail client.
   */
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
