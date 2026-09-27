import { forwardRef, useState } from "react";
import { motion } from "motion/react";
import type { MediaItem } from "../lib/media";
import { EASE } from "../lib/motion";
import { cn } from "../lib/utils";

/**
 * A family of pieces that belong together — a screenshot series, a model with
 * its renders. Rendered as a fanned stack: the pieces peek out from under the
 * cover so the grid reads "this is a set", and clicking opens the lot in the
 * lightbox.
 */
export const SetTile = forwardRef(function SetTile(
  {
    label,
    items,
    onOpen,
    index,
  }: {
    label: string;
    items: MediaItem[];
    onOpen: () => void;
    index: number;
  },
  _ref
) {
  const [hover, setHover] = useState(false);
  const shown = items.slice(0, 4);

  return (
    <motion.button
      layout
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={onOpen}
      data-cursor="media"
      data-cursor-label={`View ${items.length}`}
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
      transition={{ duration: 0.8, ease: EASE, delay: Math.min(index, 7) * 0.055 }}
      className="group relative col-span-1 sm:col-span-2 lg:col-span-3"
    >
      {/* the fan: each sheet offset down and rotated slightly */}
      <div className="relative h-[clamp(11rem,22vw,15.5rem)]">
        {shown.map((m, i) => {
          const isTop = i === shown.length - 1;
          const offset = (shown.length - 1 - i) * 16;
          const tilt = (i % 2 === 0 ? -1 : 1) * (shown.length - 1 - i) * 1.6;
          return (
            <motion.div
              key={m.src}
              className="absolute inset-x-6 top-0 overflow-hidden rounded-xl border border-line bg-ink-3 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.9)]"
              animate={{
                y: hover ? -offset * 0.35 : offset,
                rotate: hover ? tilt * 0.4 : tilt,
                scale: hover ? 1 : 0.98,
              }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.03 }}
              style={{ zIndex: i, height: `calc(100% - ${offset * 0.6}px)` }}
            >
              <img
                src={m.kind === "video" ? m.poster : m.card ?? m.src}
                alt=""
                loading="lazy"
                className={cn("h-full w-full object-cover", isTop && "transition-transform duration-700 group-hover:scale-[1.04]")}
              />
            </motion.div>
          );
        })}
      </div>

      {/* meta */}
      <div className="mt-4 flex items-start justify-between gap-4 border-t border-line pt-3.5 transition-colors duration-500 group-hover:border-accent/40 sm:mt-5">
        <div className="min-w-0">
          <h3 className="truncate text-[1.0625rem] leading-tight font-semibold tracking-[-0.025em] transition-colors duration-400 group-hover:text-accent sm:text-xl">
            {label}
          </h3>
          <p className="mono mt-1.5 truncate text-dim">{items.length} pieces in this set</p>
        </div>
        <span className="mono shrink-0 pt-1 text-dim transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:text-accent">
          <span className="inline-block">View all</span>
          <svg viewBox="0 0 12 12" className="ml-1.5 inline-block h-2.5 w-2.5 -rotate-45">
            <path d="M2 10 10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="square" />
          </svg>
        </span>
      </div>
    </motion.button>
  );
});
