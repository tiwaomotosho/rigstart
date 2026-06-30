import { motion, type Variants } from "framer-motion";

import { type CompanySlide as CompanySlideData } from "@/lib/buildSlides";
import { type SlideDirection } from "@/hooks/useSlideNavigation";
import { LogoFrame } from "./LogoFrame";
import { PeopleList } from "./PeopleList";

interface CompanySlideProps {
  slide: CompanySlideData;
  direction: SlideDirection;
}

// Spec §9. The logo group and the people-list group are two separate motion
// elements with deliberately different timing (distances 80px vs 120px, plus a
// 0.1s delay on the logo enter) to read as layered parallax. Variant labels are
// driven by the keyed parent in App; these children inherit the active label and
// supply their own per-element transforms/timing via the `custom` direction.

const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];
const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

const logoVariants: Variants = {
  enter: (d: SlideDirection) => ({
    x: d === "backward" ? -80 : 80,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT, delay: 0.1 },
  },
  exit: (d: SlideDirection) => ({
    x: d === "backward" ? 80 : -80,
    opacity: 0,
    transition: { duration: 0.35, ease: EASE_IN },
  }),
};

const peopleVariants: Variants = {
  enter: (d: SlideDirection) => ({
    x: d === "backward" ? -120 : 120,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
  exit: (d: SlideDirection) => ({
    x: d === "backward" ? 120 : -120,
    opacity: 0,
    transition: { duration: 0.3, ease: EASE_IN },
  }),
};

const groupStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
};

export function CompanySlide({ slide, direction }: CompanySlideProps) {
  return (
    <>
      <motion.div custom={direction} variants={logoVariants} style={groupStyle}>
        <LogoFrame company={slide.company} logoSlug={slide.logoSlug} />
      </motion.div>

      <motion.div custom={direction} variants={peopleVariants} style={groupStyle}>
        <PeopleList people={slide.people} layout={slide.layout} />
      </motion.div>
    </>
  );
}
