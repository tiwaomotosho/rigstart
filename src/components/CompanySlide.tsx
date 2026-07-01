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
          width: 800,
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
              height: 62,
              maxWidth: 620,
              objectFit: "contain",
              objectPosition: "left center",
              opacity: 0.95,
              marginBottom: 34,
            }}
          />
        )}

        <motion.span
          variants={itemVariants}
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: "0.36em",
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
            fontSize: 124,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            margin: "22px 0 0",
            maxWidth: 800,
            textShadow: "0 6px 44px rgba(0,0,0,0.5)",
          }}
        >
          {slide.company}
        </motion.h1>

        <motion.div
          variants={lineVariants}
          style={{
            height: 4,
            width: 190,
            marginTop: 40,
            transformOrigin: "left center",
            background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)",
          }}
        />

        <motion.span
          variants={itemVariants}
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: 25,
            letterSpacing: "0.02em",
            color: "var(--text-muted)",
            marginTop: 32,
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
