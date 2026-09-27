import type { Variants, Transition } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const; // outExpo
export const EASE_IO = [0.83, 0, 0.17, 1] as const; // inOutQuint

export const t = (duration = 0.7, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
});

/** Container that hands out stagger to children. */
export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Parent that reveals children one after another. */
export const parentIn: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: t(0.8) },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: t(0.9) },
};

export const wipeUp: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: t(0.95) },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: { opacity: 1, scale: 1, transition: t(0.9) },
};

/** Masks + slides a line of text up from its own bounding box. */
export const lineIn: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: t(0.9) },
};
