import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useHasFinePointer, useIsDesktop } from "../hooks/useMediaQuery";

/** Elements carrying a data-cursor attribute drive the cursor's label + state. */
type State = { mode: "default" | "hover" | "media"; label: string };

const DEFAULTS: State = { mode: "default", label: "" };

/**
 * Two-part cursor: a trailing ring and a leading dot. Elements opt in with
 * `data-cursor="Play"` / `data-cursor="View"`. Hidden entirely on touch.
 */
export function Cursor() {
  const fine = useHasFinePointer();
  const desktop = useIsDesktop();
  const [state, setState] = useState<State>(DEFAULTS);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  // The custom cursor only renders at the lg breakpoint, so the native
  // pointer may only be hidden there — otherwise there'd be no cursor at all.
  const shown = fine && desktop;

  useEffect(() => {
    if (!shown) return;
    document.documentElement.style.cursor = "none";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (el) {
        const mode = el.dataset.cursor === "media" ? "media" : "hover";
        const label = el.dataset.cursor === "media" ? el.dataset.cursorLabel ?? "Play" : "";
        setState((s) => (s.mode === mode && s.label === label ? s : { mode, label }));
      } else {
        setState((s) => (s.mode === "default" ? s : DEFAULTS));
      }
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [shown, visible]);

  if (!shown) return null;

  const ring = 44;
  const media = state.mode === "media";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      {/* trailing ring */}
      <motion.div
        className="absolute top-0 left-0 grid place-items-center rounded-full"
        style={{
          x: ringX,
          y: ringY,
          width: ring,
          height: ring,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          scale: down ? 0.82 : media ? 2.15 : state.mode === "hover" ? 1.5 : 1,
          backgroundColor: media || state.mode === "hover" ? "#ffffff" : "rgba(255,255,255,0)",
          borderColor: media || state.mode === "hover" ? "#ffffff" : "rgba(255,255,255,0.55)",
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.5 }}
      >
        <motion.span
          className="mono select-none text-[9px] font-medium tracking-[0.1em] text-black"
          animate={{ opacity: media && state.label ? 1 : 0, scale: media ? 1 : 0.6 }}
          transition={{ duration: 0.22 }}
        >
          {state.label}
        </motion.span>
      </motion.div>

      {/* leading dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-white"
        style={{ x, y, width: 5, height: 5, translateX: "-50%", translateY: "-50%", mixBlendMode: "difference" }}
        animate={{ opacity: visible && !media ? 1 : 0, scale: down ? 1.9 : 1 }}
        transition={{ type: "spring", stiffness: 700, damping: 34 }}
      />
    </div>
  );
}
