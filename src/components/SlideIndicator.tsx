interface SlideIndicatorProps {
  currentIndex: number;
  totalSlides: number;
}

/**
 * Spec §6.7. Unobtrusive bottom-right position indicator. Static across slides.
 */
export function SlideIndicator({ currentIndex, totalSlides }: SlideIndicatorProps) {
  return (
    <div
      style={{
        position: "absolute",
        right: 160,
        bottom: 80,
        color: "var(--slate-300)",
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: "0.05em",
      }}
    >
      {currentIndex + 1} / {totalSlides}
    </div>
  );
}
