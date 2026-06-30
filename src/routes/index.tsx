import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

import { attendees } from "@/data/attendees";
import { buildSlides } from "@/lib/buildSlides";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { StageCanvas } from "@/components/StageCanvas";
import { CompanySlide } from "@/components/CompanySlide";
import { SeplatWordmark } from "@/components/SeplatWordmark";
import { SlideIndicator } from "@/components/SlideIndicator";

// Slides are derived once from the static seed data (spec §5).
const slides = buildSlides(attendees);

export const Route = createFileRoute("/")({
  component: Display,
});

function Display() {
  const { currentIndex, direction } = useSlideNavigation(slides.length);
  const slide = slides[currentIndex];

  return (
    <StageCanvas>
      {/* Persistent corner UI — does not animate between slides (spec §6.6/§6.7) */}
      <SeplatWordmark />

      {/* mode="wait" + key per slide: the outgoing slide fully exits before the
          incoming one enters. The two inner groups carry the distinct timing. */}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: "absolute", inset: 0 }}
        >
          <CompanySlide slide={slide} direction={direction} />
        </motion.div>
      </AnimatePresence>

      <SlideIndicator currentIndex={currentIndex} totalSlides={slides.length} />
    </StageCanvas>
  );
}
