import { motion } from "framer-motion";

import { type Attendee } from "@/data/attendees";
import { itemVariants } from "@/lib/motionVariants";

interface PeopleGridProps {
  people: Attendee[];
}

/**
 * Right-zone roster of glass cards. Columns adapt to headcount; each card
 * staggers in (variant inherited from the slide container).
 */
export function PeopleGrid({ people }: PeopleGridProps) {
  const columns = people.length <= 3 ? 1 : 2;

  return (
    <div
      style={{
        position: "absolute",
        right: 140,
        top: 0,
        bottom: 0,
        width: 768,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 22,
        }}
      >
        {people.map((person, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 18,
              padding: "22px 26px",
              borderRadius: 16,
              background: "rgba(255, 255, 255, 0.045)",
              border: "1px solid rgba(255, 255, 255, 0.09)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 18px 50px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div
              style={{
                width: 4,
                borderRadius: 2,
                background: "linear-gradient(180deg, var(--accent), var(--accent-deep))",
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 600,
                  fontSize: 28,
                  lineHeight: 1.12,
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                {person.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: 1.3,
                  color: "var(--text-muted)",
                  marginTop: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {person.title}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
