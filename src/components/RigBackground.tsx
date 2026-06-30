import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-bleed rig backdrop. Cross-fades when `src` changes (i.e. on company
 * change) and runs a slow Ken Burns zoom on the active image. Dark scrims keep
 * the left-anchored content and bottom chrome legible over any image.
 */
export function RigBackground({ src }: { src: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "var(--base)" }}>
      <AnimatePresence>
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{
            opacity: 1,
            scale: 1.02,
            transition: {
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 16, ease: "easeOut" },
            },
          }}
          exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform, opacity",
          }}
        />
      </AnimatePresence>

      {/* left-weighted scrim for headline legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(95deg, rgba(5,7,13,0.94) 0%, rgba(5,7,13,0.78) 26%, rgba(5,7,13,0.34) 52%, rgba(5,7,13,0.10) 72%, rgba(5,7,13,0.42) 100%)",
        }}
      />
      {/* bottom + top scrims */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,7,13,0.55) 0%, rgba(5,7,13,0) 22%, rgba(5,7,13,0) 64%, rgba(5,7,13,0.80) 100%)",
        }}
      />
    </div>
  );
}
