import { type Variants } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

/**
 * Content orchestration. The keyed container staggers its descendants in on
 * enter, then leaves as one block on exit (background cross-fades separately).
 * Children with matching variant labels ("hidden"/"show") inherit the state.
 */
export const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
  exit: {
    opacity: 0,
    x: -48,
    transition: { duration: 0.38, ease: EASE_IN },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE_OUT } },
};

export const lineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};
