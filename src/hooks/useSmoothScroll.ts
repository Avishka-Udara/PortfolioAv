import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/**
 * One Lenis instance for the whole app, wired to framer-motion's frame loop
 * so scroll-linked animations stay in sync with the smoothed value.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.05,
      // exponential ease-out: fast pickup, long glide
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    lenis = instance;

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis = null;
    };
  }, []);
}

/** Jump to top on route change, and honour #hash links from the nav. */
export function useScrollReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // let the new page paint first, then find the anchor
      const id = hash.slice(1);
      const t = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          lenis ? lenis.scrollTo(el, { offset: -72 }) : el.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
      return () => window.clearTimeout(t);
    }
    lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [pathname, hash]);
}

/** Imperative scroll-to used by buttons and in-page CTAs. */
export function scrollToId(id: string, offset = -72) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToTop() {
  lenis ? lenis.scrollTo(0, { duration: 1 }) : window.scrollTo({ top: 0, behavior: "smooth" });
}

export function stopScroll() {
  lenis ? lenis.stop() : document.body.style.overflow = "hidden";
}

export function startScroll() {
  lenis ? lenis.start() : (document.body.style.overflow = "");
}
