"use client";

// "X people have shared a memory" — animates up on load (DESIGN.md signature moment #3).
import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

export function LiveCounter({ count, label }: { count: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reducedMotion || count === 0) {
      node.textContent = String(count);
      return;
    }

    const controls = animate(0, count, {
      duration: Math.min(1.2, 0.3 + count * 0.03),
      ease: "easeOut",
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });

    return () => controls.stop();
  }, [count, reducedMotion]);

  return (
    <p className="text-sm text-[var(--board-ink)]/70">
      <span ref={ref} className="font-semibold text-[var(--board-ink)]">
        0
      </span>{" "}
      {label}
    </p>
  );
}
