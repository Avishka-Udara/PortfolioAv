import { motion } from "motion/react";
import { site } from "../data/site";
import { Magnetic } from "./ui";

/** Official Google Drive mark (simple-icons path data). */
function DriveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />
    </svg>
  );
}

/**
 * Persistent Drive CTA. Sits bottom-right on every route, below the lightbox /
 * preloader / mobile-menu layers but above page content. The pulse ring lives
 * outside the (overflow-hidden) pill so it can bloom past the button edge.
 */
export function FloatingDrive() {
  return (
    <motion.div
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-60 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-6"
      initial={{ opacity: 0, y: 28, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 18, mass: 0.6 }}
    >
      {/* attention pulse — sibling of the pill so it isn't clipped */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full border border-hot"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.6, ease: "easeOut" }}
      />

      <Magnetic strength={0.4}>
        <a
          href={site.drive}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor="hover"
          aria-label="See more samples — Google Drive"
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-hot px-4 py-3 text-white shadow-[0_12px_32px_-10px_rgba(255,51,85,0.65)] transition-shadow duration-500 hover:shadow-[0_18px_44px_-10px_rgba(255,51,85,0.9)] sm:gap-2.5 sm:px-5"
        >
          {/* light sweep */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
          />

          <DriveIcon className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
          <span className="mono relative z-10 whitespace-nowrap text-[0.68rem] font-medium uppercase tracking-[0.14em] sm:text-[0.72rem]">
            See more samples
          </span>
        </a>
      </Magnetic>
    </motion.div>
  );
}
