interface EventChromeProps {
  brand: string;
  eventTitle: string;
  currentIndex: number;
  totalSlides: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Persistent corner UI that does NOT animate between slides: the brand lockup
 * (top-left), the slide counter (top-right), and the progress dots (bottom).
 */
export function EventChrome({ brand, eventTitle, currentIndex, totalSlides }: EventChromeProps) {
  return (
    <>
      {/* Brand lockup */}
      <div style={{ position: "absolute", left: 140, top: 96, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 14px var(--accent)" }} />
        <span
          style={{
            fontFamily: "var(--display)",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.22em",
            color: "var(--text)",
          }}
        >
          {brand}
        </span>
        <span style={{ width: 1, height: 18, background: "var(--line)" }} />
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {eventTitle}
        </span>
      </div>

      {/* Counter */}
      <div style={{ position: "absolute", right: 140, top: 88, textAlign: "right" }}>
        <span style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 30, color: "var(--text)" }}>
          {pad(currentIndex + 1)}
        </span>
        <span style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: 18, color: "var(--text-faint)" }}>
          {" "}
          / {pad(totalSlides)}
        </span>
      </div>

      {/* Progress dots */}
      <div style={{ position: "absolute", left: 140, bottom: 92, display: "flex", alignItems: "center", gap: 10 }}>
        {Array.from({ length: totalSlides }).map((_, i) => {
          const active = i === currentIndex;
          return (
            <span
              key={i}
              style={{
                height: 4,
                width: active ? 34 : 14,
                borderRadius: 2,
                background: active ? "var(--accent)" : "rgba(245,247,250,0.22)",
                boxShadow: active ? "0 0 12px rgba(232,176,75,0.6)" : "none",
                transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
          );
        })}
      </div>
    </>
  );
}
