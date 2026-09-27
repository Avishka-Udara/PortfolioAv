import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav, site } from "../data/site";
import { cn } from "../lib/utils";
import { EASE } from "../lib/motion";
import { startScroll, stopScroll } from "../hooks/useSmoothScroll";

function Wordmark() {
  return (
    <Link
      to="/"
      className="group relative flex items-center gap-2.5"
      data-cursor="hover"
      aria-label={`${site.name} — home`}
    >
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-[7px] bg-fg text-[11px] font-bold text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-8deg] group-hover:scale-105">
        <span className="relative z-10 transition-colors duration-300 group-hover:text-accent">
          {site.initials}
        </span>
        <span className="absolute inset-0 -translate-y-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
      </span>
      <span className="hidden text-[15px] leading-none font-semibold tracking-[-0.02em] sm:block">
        Avishka<span className="text-accent">.</span>Udara
      </span>
    </Link>
  );
}

export function Nav() {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));

  // close the sheet on route change
  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (open) stopScroll();
    else startScroll();
    return startScroll;
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) => {
    const [path, h] = to.split("#");
    if (path && path !== "/") return pathname.startsWith(path);
    if (h) return pathname === "/" && hash === `#${h}`;
    return pathname === "/";
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-70 transition-[padding] duration-500",
          solid ? "py-3" : "py-5 sm:py-7"
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl px-3 py-2 transition-all duration-500 sm:px-4 sm:py-2.5",
              solid
                ? "border border-line bg-ink-2/72 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
                : "border border-transparent"
            )}
          >
            <Wordmark />

            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  data-cursor="hover"
                  data-active={isActive(n.to)}
                  className={cn(
                    "link-sweep mono rounded-lg px-3 py-2 transition-colors duration-300",
                    isActive(n.to) ? "text-fg" : "text-muted hover:text-fg"
                  )}
                >
                  {n.label}
                </Link>
              ))}
              <a
                href={`mailto:${site.email}`}
                data-cursor="hover"
                className="mono group ml-2 flex items-center gap-2 rounded-lg bg-fg px-4 py-2.5 text-ink transition-colors duration-300 hover:bg-accent"
              >
                Hire me
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0">
                  <path d="M2 10 10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="square" />
                </svg>
              </a>
            </nav>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative z-10 grid h-10 w-10 place-items-center rounded-xl border border-line bg-ink-2/60 md:hidden"
            >
              <span className="relative block h-3 w-4.5">
                <motion.span
                  className="absolute inset-x-0 top-0 block h-px bg-fg"
                  animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
                <motion.span
                  className="absolute inset-x-0 top-1.5 block h-px bg-fg"
                  animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-65 flex flex-col justify-between bg-ink/97 px-5 pt-28 pb-8 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <nav className="flex flex-col">
              {[...nav, { label: "All work", to: "/work" }].map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.6, ease: EASE }}
                >
                  <Link
                    to={n.to}
                    className="flex items-baseline gap-4 border-b border-line py-4"
                    onClick={() => setOpen(false)}
                  >
                    <span className="mono w-5 shrink-0 text-dim">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className="text-[8.5vw] leading-[0.95] font-semibold tracking-[-0.04em]"
                      style={{ fontSize: "clamp(2.1rem,9vw,3.4rem)" }}
                    >
                      {n.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mono flex flex-col gap-2.5 text-muted"
            >
              <a href={`mailto:${site.email}`} className="text-accent">
                {site.email}
              </a>
              <a href={site.telegram} target="_blank" rel="noreferrer noopener">
                Telegram {site.telegramHandle}
              </a>
              <span className="text-dim">
                {site.location} · {site.timezone}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Thin progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-80 h-px origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
