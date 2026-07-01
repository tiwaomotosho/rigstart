interface EventChromeProps {
  eventTitle: string;
  tagline: string;
  currentIndex: number;
  totalSlides: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Persistent corner UI that does NOT animate between slides: the Seplat brand
 * lockup + event title (top-left), the slide counter (top-right), the theme
 * line (bottom-right), and the progress dots (bottom-left).
 */
export function EventChrome({ eventTitle, tagline, currentIndex, totalSlides }: EventChromeProps) {
  return (
    <>
      {/* Brand lockup + event title */}
      <div style={{ position: "absolute", left: 140, top: 88, display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ display: "flex", alignItems: "baseline", fontFamily: "var(--display)" }}>
          <span style={{ fontWeight: 700, fontSize: 30, color: "var(--accent)", letterSpacing: "-0.01em" }}>
            Seplat
          </span>
          <span
            style={{
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--accent-2)",
              marginLeft: 5,
              transform: "translateY(2px)",
            }}
          >
            energy
          </span>
        </span>
        <span style={{ width: 1, height: 24, background: "var(--line)" }} />
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {eventTitle}
        </span>
      </div>

      {/* Counter */}
      <div style={{ position: "absolute", right: 140, top: 84, textAlign: "right" }}>
        <span style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 40, color: "var(--text)" }}>
          {pad(currentIndex + 1)}
        </span>
        <span style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: 24, color: "var(--text-faint)" }}>
          {" "}
          / {pad(totalSlides)}
        </span>
      </div>

      {/* Progress dots */}
      <div style={{ position: "absolute", left: 140, bottom: 90, display: "flex", alignItems: "center", gap: 12 }}>
        {Array.from({ length: totalSlides }).map((_, i) => {
          const active = i === currentIndex;
          return (
            <span
              key={i}
              style={{
                height: 6,
                width: active ? 48 : 18,
                borderRadius: 3,
                background: active ? "var(--accent)" : "rgba(245,247,250,0.22)",
                boxShadow: active ? "0 0 14px rgba(225,37,27,0.65)" : "none",
                transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
          );
        })}
      </div>

      {/* Theme line */}
      <div
        style={{
          position: "absolute",
          right: 140,
          bottom: 88,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span style={{ width: 28, height: 2, background: "var(--accent-2)" }} />
        <span
          style={{
            fontFamily: "var(--display)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: "0.01em",
            color: "rgba(245,247,250,0.78)",
          }}
        >
          {tagline}
        </span>
      </div>
    </>
  );
}
