"use client";

// Fires once on mount for celebratory boards only. Never imported on warm/solemn paths —
// see BoardAmbient, which is the single place motionProfile decides what renders.
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function ConfettiBurst({ accent, accentSoft }: { accent: string; accentSoft: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    fired.current = true;

    const colors = [accent, accentSoft, "#ffffff"];
    confetti({
      particleCount: 90,
      spread: 80,
      startVelocity: 40,
      origin: { y: 0.3 },
      colors,
      ticks: 200,
    });

    // canvas-confetti appends its own <canvas> straight to document.body, outside
    // React's tree — a client-side route change won't remove it unless we do here.
    return () => {
      confetti.reset();
    };
  }, [accent, accentSoft]);

  return null;
}
