import { forwardRef, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Project } from "../data/projects";
import { categoryMeta, resolveMedia } from "../data/projects";
import { HoverMedia } from "./Media";
import { EASE } from "../lib/motion";
import { useHasFinePointer } from "../hooks/useMediaQuery";
import { isModel } from "../lib/media";
import { cn } from "../lib/utils";

/**
 * Editorial grid. Rather than row/column spans (which fracture at the
 * 2-column breakpoint), cards vary their aspect ratio: wide cards span two
 * tracks, the rest fill one. Tiles land 3-up on large screens.
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

/**
 * Directional wipe: each card picks a clip origin from its position in the
 * row, so the grid opens like a shutter rather than one flat fade. The four
 * insets rotate through so no two adjacent cards share an origin.
 */
const CLIP_FROM = [
  "inset(0 0 100% 0)", // top edge down
  "inset(0 100% 0 0)", // right edge in
  "inset(100% 0 0 0)", // bottom edge up
  "inset(0 0 0 100%)", // left edge in
] as const;

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
  const fine = useHasFinePointer();

  const tileRef = useRef<HTMLDivElement>(null);

  // pointer-driven tilt + parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 220, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 220, damping: 20 });
  // media drifts inside the frame to fake depth
  const driftX = useTransform(mx, [-0.5, 0.5], ["1.6%", "-1.6%"]);
  const driftY = useTransform(my, [-0.5, 0.5], ["1.6%", "-1.6%"]);
  // glare follows the pointer across the surface
  const glare = useTransform(mx, (x) => {
    const gx = ((x + 0.5) * 100).toFixed(1);
    return `radial-gradient(circle at ${gx}% 28%, rgba(255,255,255,0.45), transparent 46%)`;
  });

  const onMove = (e: React.PointerEvent) => {
    if (!fine) return;
    const r = tileRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  if (!cover) return null;

  const meta = categoryMeta[project.category];
  const size = project.size ?? "sm";
  const origin = CLIP_FROM[index % CLIP_FROM.length];
  const isWide = size === "lg";
  const hasModel = media.some((m) => isModel(m));

  const inner = (
    <>
      <div
        ref={tileRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={fine ? { perspective: 1000 } : undefined}
      >
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-ink-3 ring-1 ring-inset ring-white/[0.04] transition-shadow duration-700 group-hover:ring-accent/25 group-hover:shadow-[0_30px_70px_-30px_rgba(0,229,255,0.35),0_20px_50px_-28px_rgba(0,0,0,0.9)]",
            ASPECT[size]
          )}
          style={fine ? { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" } : undefined}
        >
          <motion.div
            className="absolute inset-0"
            style={fine ? { x: driftX, y: driftY, scale: 1.08 } : undefined}
          >
            <HoverMedia
              item={cover}
              alt={`${project.title} — ${project.client}`}
              sizes={isWide ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
              className="absolute inset-0"
              imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          </motion.div>

          {/* legibility scrim + hover wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-95" />
          <div className="absolute inset-0 bg-accent/8 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          {/* pointer glare */}
          {fine && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: glare }}
            />
          )}

          {/* index + category chip */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5 sm:p-4">
            <span className="mono rounded-full border border-line-2 bg-ink/60 px-2.5 py-1.5 text-fg backdrop-blur-md transition-all duration-500 group-hover:border-accent/40 group-hover:text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mono rounded-full border border-line-2 bg-ink/60 px-2.5 py-1.5 text-muted backdrop-blur-md transition-all duration-500 group-hover:border-accent/50 group-hover:text-accent">
              {meta.short}
            </span>
          </div>

          {/* play / 3D affordance for video & model covers */}
          {(cover.kind === "video" || isModel(cover)) && (
            <span className="pointer-events-none absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/40 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/90">
              <span className="pulse-ring absolute inset-0 rounded-full border border-accent" />
              {isModel(cover) ? (
                <svg viewBox="0 0 24 24" className="relative h-6 w-6 text-fg transition-colors duration-500 group-hover:text-ink">
                  <path
                    d="M12 2.6 21 7.4v9.2L12 21.4 3 16.6V7.4z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path d="M12 2.6v18.8M3 7.4l9 4.8 9-4.8M12 12.2v9.2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="relative ml-0.5 h-5 w-5 text-fg transition-colors duration-500 group-hover:text-ink">
                  <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
                </svg>
              )}
            </span>
          )}
        </motion.div>
      </div>

      {/* meta block */}
      <div className="mt-3.5 flex items-start justify-between gap-4 border-t border-transparent transition-colors duration-500 group-hover:border-line sm:mt-4">
        <div className="min-w-0 pt-3">
          <h3 className="truncate text-[1.0625rem] leading-tight font-semibold tracking-[-0.025em] transition-colors duration-400 group-hover:text-accent sm:text-xl">
            {project.title}
          </h3>
          <p className="mono mt-1.5 truncate text-dim">
            {project.client} · {project.year}
            {hasModel && " · 3D"}
          </p>
        </div>
        <span className="mono shrink-0 pt-3 text-dim transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:text-accent">
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
      initial={{ opacity: 0, clipPath: origin }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
      exit={{ opacity: 0, clipPath: origin, transition: { duration: 0.4, ease: EASE } }}
      transition={{ duration: 0.8, ease: EASE, delay: Math.min(index, 7) * 0.055 }}
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
