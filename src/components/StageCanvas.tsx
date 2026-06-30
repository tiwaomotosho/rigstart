import { useEffect, useState, type ReactNode } from "react";

/**
 * Spec §8. A fixed 1920×1080 stage, centered and uniformly scaled to fit the
 * viewport with pure-black letterbox bars. The scale starts at 1 (matching SSR)
 * and is corrected on mount + every resize, so there is no hydration mismatch.
 */
export function StageCanvas({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          position: "relative",
          overflow: "hidden",
          background: "var(--bg-canvas)",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
