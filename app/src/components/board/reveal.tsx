"use client";

// Entrance animation whose character follows the board's motion profile (DESIGN.md):
// celebratory gets a spring scale-in, warm a soft fade-up, solemn a slow plain fade —
// never a bounce or scale on solemn. Always respects prefers-reduced-motion.
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type MotionProfile = "celebratory" | "warm" | "solemn";

const VARIANTS: Record<MotionProfile, Variants> = {
  celebratory: {
    hidden: { opacity: 0, y: 24, scale: 0.94, rotate: -1 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  },
  warm: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  solemn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.9, ease: "easeInOut" } },
  },
};

const REDUCED: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export function Reveal({
  children,
  profile,
  delay = 0,
  className,
  once = true,
  inView = false,
}: {
  children: ReactNode;
  profile: MotionProfile;
  delay?: number;
  className?: string;
  once?: boolean;
  inView?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion ? REDUCED : VARIANTS[profile];

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={inView ? undefined : "show"}
      whileInView={inView ? "show" : undefined}
      viewport={inView ? { once, margin: "-60px" } : undefined}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
