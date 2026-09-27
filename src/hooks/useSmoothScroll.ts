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
      const id = hash.slice(1);
      // The target page renders progressively (route transitions, lazy media),
      // so wait until the anchor actually exists before jumping to it — a fixed
      // timeout fires too early when coming from another route. Then re-anchor
      // a few times, because images settling below the fold keep shifting the
      // target's absolute position.
      let tries = 0;
      let anchored = false;
      const jump = () => {
        const el = document.getElementById(id);
        if (!el) return false;
        lenis
          ? lenis.scrollTo(el, { offset: -72, duration: 1.1 })
          : el.scrollIntoView({ behavior: "smooth" });
        return true;
      };
      const t = window.setInterval(() => {
        tries++;
        if (!anchored && jump()) {
          anchored = true;
          // nudge again as late-loading media above the anchor reflows the page
          [800, 1900].forEach((ms) => window.setTimeout(() => jump(), ms));
        }
        if (anchored || tries > 40) window.clearInterval(t);
      }, 90);
      return () => window.clearInterval(t);
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
