import { useEffect, useState, type ReactNode } from "react";

/**
 * A 1920×1080 design canvas scaled to FILL the entire viewport (no letterbox
 * bars). On 16:9 screens — the common case for PC / projectors / large displays
 * — the scale is uniform and undistorted; on other ratios it stretches slightly
 * to guarantee the picture covers the whole screen. Starts at scale 1 (matching
 * SSR) and corrects on mount + resize, so there is no hydration mismatch.
 */
export function StageCanvas({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    function update() {
      setScale({ x: window.innerWidth / 1920, y: window.innerHeight / 1080 });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--base)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
          background: "var(--base)",
          transform: `scale(${scale.x}, ${scale.y})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
