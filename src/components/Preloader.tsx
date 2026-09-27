import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../lib/motion";
import { site } from "../data/site";

/**
 * One-time intro: counter + a name that resolves out of a blur.
 * Held briefly so the first paint isn't a flash of empty canvas.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("au-intro") === "1") {
      onDone();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      sessionStorage.setItem("au-intro", "1");
      onDone();
      return;
    }

    let raf = 0;
    const start = performance.now();
    const DURATION = 1500;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // easeOutExpo so it sprints then settles
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("au-intro", "1");
        setLeaving(true);
        window.setTimeout(onDone, 620);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-5 py-6 sm:px-8 sm:py-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {/* top rule */}
          <motion.div
            className="h-px w-full origin-left bg-line-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          />

          <div className="flex items-end justify-between gap-6">
            <motion.p
              className="mono text-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Portfolio · 2026
            </motion.p>
            <motion.p
              className="mono text-accent tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              {String(count).padStart(3, "0")}
            </motion.p>
          </div>

          <motion.h2
            className="display text-[13vw] leading-[0.82] sm:text-[9vw]"
            initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: EASE }}
          >
            {site.name.split(" ").map((w) => (
              <span key={w} className="inline-block">
                {w}
                <span className="text-accent">.</span>{' '}
              </span>
            ))}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
