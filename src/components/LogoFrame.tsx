import { useState } from "react";

interface LogoFrameProps {
  company: string;
  logoSlug: string;
}

/**
 * Spec §6.2 + §6.3. White logo frame at (160,120), 480×240, with the company
 * name label below it. On image load failure, swap to a bold text fallback
 * (no broken-image icon).
 */
export function LogoFrame({ company, logoSlug }: LogoFrameProps) {
  const [errored, setErrored] = useState(false);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 120,
          width: 480,
          height: 240,
          background: "var(--white-pure)",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(22, 33, 62, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {errored ? (
          <span
            style={{
              color: "var(--navy-900)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.02em",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            {company}
          </span>
        ) : (
          <img
            src={`/logos/${logoSlug}.png`}
            alt={company}
            onError={() => setErrored(true)}
            style={{ maxWidth: 400, maxHeight: 200, objectFit: "contain" }}
          />
        )}
      </div>

      {/* §6.3 company name label, directly below the frame */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 392,
          color: "var(--navy-900)",
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {company}
      </div>
    </>
  );
}
