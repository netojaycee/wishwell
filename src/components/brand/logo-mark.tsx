// The Fondly Held mark: an open, hand-drawn heart with a small held dot above the
// gap, deliberately not a closed/filled heart, so it reads warm rather than romantic
// or cartoonish, and stays appropriate on memorial boards, not just celebratory ones.
export function LogoMark({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <path
        d="M35,18 C20,15 8,25 8,40 C8,58 26,73 47,88 C50,90 50,90 53,88 C74,73 92,58 92,40 C92,25 80,15 65,18"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="50" cy="18" r="8" fill={color} />
    </svg>
  );
}
