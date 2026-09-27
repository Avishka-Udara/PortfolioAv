import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { EASE } from "../lib/motion";
import { cn } from "../lib/utils";
import { useHasFinePointer } from "../hooks/useMediaQuery";

/** Button that leans toward the pointer on fine-pointer devices. */
export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useHasFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.5 });

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      style={fine ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!fine) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

type BtnProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost" | "accent";
  className?: string;
  cursorLabel?: string;
};

export function Btn({ children, to, href, onClick, variant = "solid", className }: BtnProps) {
  const base =
    "mono group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 transition-colors duration-400";

  const styles = {
    // sweep rises behind the label, so the text must stay dark over the fill
    solid: "bg-fg text-ink hover:text-ink",
    accent: "bg-accent text-ink hover:text-ink",
    ghost: "border border-line-2 text-fg hover:border-fg hover:text-ink",
  }[variant];

  const inner = (
    <>
      {/* fill sweep */}
      <span
        className={cn(
          "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100",
          variant === "solid" ? "bg-accent" : "bg-fg"
        )}
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </>
  );

  const attrs = { className: cn(base, styles, className), "data-cursor": "hover" as const };

  return (
    <Magnetic>
      {to ? (
        <Link to={to} {...attrs}>
          {inner}
        </Link>
      ) : href ? (
        <a href={href} target="_blank" rel="noreferrer noopener" {...attrs}>
          {inner}
        </a>
      ) : (
        <button onClick={onClick} {...attrs}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" className={cn("h-3 w-3", className)} aria-hidden>
      <path
        d="M2 12 12 2M4.5 2H12v7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** Counts up once scrolled into view. */
export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 1.7, ease: EASE });
    return () => controls.stop();
  }, [inView, to, mv]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}

/** Small mono label with a leading rule — used as section eyebrows. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px w-8 bg-accent" />
      <span className="mono text-accent">{children}</span>
    </div>
  );
}

/** Infinite horizontal marquee. Duplicated content for a seamless wrap. */
export function Marquee({
  children,
  speed = 38,
  className,
  reverse = false,
  fade = true,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  reverse?: boolean;
  fade?: boolean;
}) {
  return (
    <div className={cn("group relative overflow-hidden", fade && "edge-fade", className)}>
      <div
        className="animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]"
        style={
          {
            "--dur": `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Full-bleed section heading: eyebrow + big statement + optional lede. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={cn("flex items-center gap-3", align === "center" && "justify-center")}
      >
        <span className="h-px w-8 bg-accent" />
        <span className="mono text-accent">{eyebrow}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="display mt-5 text-[clamp(1.9rem,5.2vw,4.25rem)]"
      >
        {title}
      </motion.h2>

      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          className={cn(
            "mt-5 max-w-xl text-[0.975rem] leading-relaxed text-muted sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
