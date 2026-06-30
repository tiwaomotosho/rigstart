/**
 * Spec §6.6. Persistent top-right wordmark (styled text, no image). Anchored by
 * its right edge at right:160, top:120. Does not animate between slides.
 */
export function SeplatWordmark() {
  return (
    <div
      style={{
        position: "absolute",
        right: 160,
        top: 120,
        display: "flex",
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          position: "relative",
          color: "var(--navy-900)",
          fontWeight: 800,
          fontSize: 26,
        }}
      >
        Seplat
        {/* small red dot accent near the top of the "p" */}
        <span
          style={{
            position: "absolute",
            left: 46,
            top: -2,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--red-500)",
          }}
        />
      </span>
      <span
        style={{
          marginLeft: 2,
          color: "var(--green-500)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 15,
          transform: "translateY(6px)",
        }}
      >
        energy
      </span>
    </div>
  );
}
