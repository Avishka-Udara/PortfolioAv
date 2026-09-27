import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { Project } from "../data/projects";
import { categoryMeta, resolveMedia } from "../data/projects";
import { HoverMedia } from "./Media";
import { EASE } from "../lib/motion";
import { cn } from "../lib/utils";

/**
 * Editorial grid. Rather than row/column spans (which fracture at the
 * 2-column breakpoint), cards vary their aspect ratio: wide cards span two
 * tracks, the rest fill one. Tiles perfectly 3-up on large screens.
 */
const SIZES = {
  lg: "sm:col-span-2",
  md: "",
  sm: "",
} as const;

const ASPECT = {
  lg: "aspect-16/9",
  md: "aspect-4/3",
  sm: "aspect-square",
} as const;

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen?: () => void;
};

export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard(
  { project, index, onOpen },
  ref
) {
  const media = resolveMedia(project);
  const cover = media[0];
  if (!cover) return null;

  const meta = categoryMeta[project.category];
  const size = project.size ?? "sm";

  const inner = (
    <>
      <div className={cn("relative overflow-hidden rounded-2xl bg-ink-3", ASPECT[size])}>
        <HoverMedia
          item={cover}
          alt={`${project.title} — ${project.client}`}
          sizes={
            size === "lg"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          className="absolute inset-0"
          imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />

        {/* legibility scrim + hover wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-95" />
        <div className="absolute inset-0 bg-accent/8 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {/* index + category chip */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5 sm:p-4">
          <span className="mono rounded-full border border-line-2 bg-ink/60 px-2.5 py-1.5 text-fg backdrop-blur-md">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mono rounded-full border border-line-2 bg-ink/60 px-2.5 py-1.5 text-muted backdrop-blur-md transition-colors duration-500 group-hover:border-accent/50 group-hover:text-accent">
            {meta.short}
          </span>
        </div>

        {/* play affordance for video covers */}
        {cover.kind === "video" && (
          <span className="pointer-events-none absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/40 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/90">
            <span className="pulse-ring absolute inset-0 rounded-full border border-accent" />
            <svg viewBox="0 0 24 24" className="relative ml-0.5 h-5 w-5 text-fg transition-colors duration-500 group-hover:text-ink">
              <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
            </svg>
          </span>
        )}
      </div>

      {/* meta block */}
      <div className="mt-3.5 flex items-start justify-between gap-4 sm:mt-4">
        <div className="min-w-0">
          <h3 className="truncate text-[1.0625rem] leading-tight font-semibold tracking-[-0.025em] sm:text-xl">
            {project.title}
          </h3>
          <p className="mono mt-1.5 truncate text-dim">
            {project.client} · {project.year}
          </p>
        </div>
        <span className="mono shrink-0 pt-1 text-dim transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:text-accent">
          <span className="inline-block">View</span>
          <svg viewBox="0 0 12 12" className="ml-1.5 inline-block h-2.5 w-2.5 -rotate-45">
            <path d="M2 10 10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="square" />
          </svg>
        </span>
      </div>
    </>
  );

  return (
    <motion.article
      ref={ref}
      layout
      className={cn("group relative", SIZES[size])}
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
      transition={{ duration: 0.75, ease: EASE, delay: Math.min(index, 7) * 0.045 }}
    >
      {onOpen ? (
        <button onClick={onOpen} className="block w-full text-left" data-cursor="media" data-cursor-label="View">
          {inner}
        </button>
      ) : (
        <Link to={`/work/${project.slug}`} className="block" data-cursor="media" data-cursor-label="View">
          {inner}
        </Link>
      )}
    </motion.article>
  );
});
