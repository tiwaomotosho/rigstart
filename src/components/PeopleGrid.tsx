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
  const columns = people.length <= 2 ? 1 : 2;

  return (
    <div
      style={{
        position: "absolute",
        right: 140,
        top: 0,
        bottom: 0,
        width: 820,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 26,
        }}
      >
        {people.map((person, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 22,
              padding: "30px 34px",
              borderRadius: 18,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 20px 56px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                width: 6,
                borderRadius: 3,
                background: "linear-gradient(180deg, var(--accent-2), var(--accent-2-deep))",
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 600,
                  fontSize: 40,
                  lineHeight: 1.06,
                  color: "var(--text)",
                  letterSpacing: "-0.015em",
                }}
              >
                {person.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 500,
                  fontSize: 21,
                  lineHeight: 1.25,
                  color: "var(--text-muted)",
                  marginTop: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
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
