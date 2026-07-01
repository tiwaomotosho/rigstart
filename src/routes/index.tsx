import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

import { buildSlides } from "@/lib/buildSlides";
import { assignBackgrounds, RIG_BACKGROUNDS } from "@/data/backgrounds";
import { containerVariants } from "@/lib/motionVariants";
import { useAttendees } from "@/hooks/useAttendees";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { StageCanvas } from "@/components/StageCanvas";
import { RigBackground } from "@/components/RigBackground";
import { CompanySlide } from "@/components/CompanySlide";
import { EventChrome } from "@/components/EventChrome";

const EVENT_TITLE = "Safety Leadership Forum";
const TAGLINE = "Leading with Safety, Driving Performance";

export const Route = createFileRoute("/")({
  component: Display,
});

function Display() {
  const { attendees } = useAttendees();

  const slides = useMemo(() => (attendees ? buildSlides(attendees) : []), [attendees]);
  const backgroundForCompany = useMemo(() => {
    const companies = [...new Set(slides.map((s) => s.company))];
    return assignBackgrounds(companies);
  }, [slides]);

  const { currentIndex } = useSlideNavigation(slides.length);

  if (!attendees || slides.length === 0) {
    return (
      <StageCanvas>
        <LoadingScreen />
      </StageCanvas>
    );
  }

  const index = Math.min(currentIndex, slides.length - 1);
  const slide = slides[index];
  const background = backgroundForCompany[slide.company] ?? RIG_BACKGROUNDS[0];

  return (
    <StageCanvas>
      <RigBackground src={background} />

      <EventChrome
        eventTitle={EVENT_TITLE}
        tagline={TAGLINE}
        currentIndex={index}
        totalSlides={slides.length}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{ position: "absolute", inset: 0 }}
        >
          <CompanySlide slide={slide} />
        </motion.div>
      </AnimatePresence>
    </StageCanvas>
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <motion.span
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }}
      />
      <span
        style={{
          fontFamily: "var(--display)",
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        Preparing the room
      </span>
    </div>
  );
}
