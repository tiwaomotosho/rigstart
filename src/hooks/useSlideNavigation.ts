import { useEffect, useState } from "react";

export type SlideDirection = "forward" | "backward";

export interface SlideNavigationState {
  currentIndex: number;
  direction: SlideDirection;
}

/**
 * Spec §7. Keyboard-only navigation over a slide deck of `total` slides.
 * Right Arrow / Spacebar advance; Left Arrow goes back; both no-op at the
 * boundaries. Held keys (event.repeat) are ignored to avoid rapid-fire.
 */
export function useSlideNavigation(total: number): SlideNavigationState {
  const [state, setState] = useState<SlideNavigationState>({
    currentIndex: 0,
    direction: "forward",
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      const isForward =
        event.key === "ArrowRight" || event.key === " " || event.code === "Space";
      const isBackward = event.key === "ArrowLeft";

      if (event.key === " " || event.code === "Space") {
        // Prevent the browser's default spacebar page-scroll.
        event.preventDefault();
      }

      if (isForward) {
        setState((prev) =>
          prev.currentIndex < total - 1
            ? { currentIndex: prev.currentIndex + 1, direction: "forward" }
            : prev,
        );
      } else if (isBackward) {
        setState((prev) =>
          prev.currentIndex > 0
            ? { currentIndex: prev.currentIndex - 1, direction: "backward" }
            : prev,
        );
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [total]);

  return state;
}
