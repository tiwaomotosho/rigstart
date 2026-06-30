import { useState } from "react";
import { motion } from "framer-motion";

import { type CompanySlide as CompanySlideData } from "@/lib/buildSlides";
import { itemVariants, lineVariants } from "@/lib/motionVariants";
import { PeopleGrid } from "./PeopleGrid";

interface CompanySlideProps {
  slide: CompanySlideData;
}

export function CompanySlide({ slide }: CompanySlideProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  const count = slide.people.length;
  const groupLabel =
    slide.totalSlidesForCompany > 1
      ? `Group ${slide.slideIndexInCompany + 1} of ${slide.totalSlidesForCompany} · `
      : "";
  const meta = `${groupLabel}${count} ${count === 1 ? "representative" : "representatives"} in attendance`;

  return (
    <>
      {/* Left identity zone */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 0,
          bottom: 0,
          width: 820,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!logoFailed && (
          <motion.img
            variants={itemVariants}
            src={`/logos/${slide.logoSlug}.png`}
            alt={slide.company}
            onError={() => setLogoFailed(true)}
            style={{
              height: 46,
              maxWidth: 540,
              objectFit: "contain",
              objectPosition: "left center",
              opacity: 0.9,
              marginBottom: 28,
            }}
          />
        )}

        <motion.span
          variants={itemVariants}
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Attending Company
        </motion.span>

        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: "var(--display)",
            fontWeight: 700,
            fontSize: 88,
            lineHeight: 0.98,
            letterSpacing: "-0.025em",
            color: "var(--text)",
            margin: "18px 0 0",
            maxWidth: 820,
            textShadow: "0 6px 40px rgba(0,0,0,0.45)",
          }}
        >
          {slide.company}
        </motion.h1>

        <motion.div
          variants={lineVariants}
          style={{
            height: 3,
            width: 132,
            marginTop: 32,
            transformOrigin: "left center",
            background: "linear-gradient(90deg, var(--accent), rgba(232,176,75,0))",
          }}
        />

        <motion.span
          variants={itemVariants}
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: "0.02em",
            color: "var(--text-muted)",
            marginTop: 26,
          }}
        >
          {meta}
        </motion.span>
      </div>

      {/* Right roster zone */}
      <PeopleGrid people={slide.people} />
    </>
  );
}
