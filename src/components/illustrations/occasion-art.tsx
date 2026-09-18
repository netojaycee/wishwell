// Hand-drawn spot illustrations, one per OccasionType.key, coloured entirely from the
// theme palette (DESIGN.md: never hardcode colour). Motion follows the motion profile:
// celebratory bobs and twinkles, warm drifts gently, solemn is always perfectly still,
// solemn never receives an animation class at all. Unknown keys fall back to a generic
// letter-in-envelope so a new occasion row renders without a deploy (CLAUDE.md rule 1).
// Pure SVG + CSS classes from globals.css (`fh-*`), no JS, safe in Server Components.
import type { CSSProperties } from "react";

type Profile = "celebratory" | "warm" | "solemn";
export type ArtPalette = { accent: string; accentSoft: string; ink: string; surface?: string };

const A = "var(--art-accent)";
const S = "var(--art-soft)";
const I = "var(--art-ink)";
const W = "var(--art-surface)";

const line = { stroke: I, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type Motion = {
  bob?: string;
  float?: string;
  sway?: string;
  twinkle?: string;
  flicker?: string;
  steam?: string;
};

const MOTION: Record<Profile, Motion> = {
  celebratory: { bob: "fh-bob", float: "fh-float", sway: "fh-sway", twinkle: "fh-twinkle", flicker: "fh-flicker", steam: "fh-steam" },
  warm: { bob: "fh-float-slow", float: "fh-float-slow", sway: "fh-sway-slow", flicker: "fh-flicker-slow", steam: "fh-steam" },
  solemn: {},
};

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

function sparkle(x: number, y: number, r: number) {
  return `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;
}

function heart(x: number, y: number, s: number) {
  return `M${x} ${y + 3 * s}C${x - 7 * s} ${y - 1 * s} ${x - 3.5 * s} ${y - 6.5 * s} ${x} ${y - 3 * s}C${x + 3.5 * s} ${y - 6.5 * s} ${x + 7 * s} ${y - 1 * s} ${x} ${y + 3 * s}Z`;
}

function star(cx: number, cy: number, outer: number, inner: number, points = 5) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function flame(cx: number, top: number) {
  return `M${cx} ${top}c3.5 5 5.5 8 3 11.5a4 4 0 0 1-6 0c-2.5-3.5-.5-6.5 3-11.5z`;
}

function Backdrop() {
  return <circle cx="60" cy="62" r="50" fill={S} />;
}

function Birthday({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <ellipse cx="60" cy="100" rx="44" ry="5" fill={I} opacity="0.12" />
      <g className={m.bob}>
        <rect x="22" y="64" width="76" height="34" rx="7" fill={W} {...line} />
        <path
          d="M22 74v-3a7 7 0 0 1 7-7h62a7 7 0 0 1 7 7v3c-2 6-9 6-11 0c-2 7-10 7-12 0c-2 6-9 6-11 0c-2 7-11 7-13 0c-2 6-9 6-11 0c-2 7-10 7-12 0c-2 5-4 5-6 0z"
          fill={A}
          {...line}
        />
        {[32, 48, 64, 80].map((x, i) => (
          <line key={x} x1={x} y1={86 + (i % 2) * 4} x2={x + 5} y2={84 + (i % 2) * 4} stroke={A} strokeWidth="3" strokeLinecap="round" />
        ))}
        <rect x="36" y="42" width="48" height="22" rx="6" fill={W} {...line} />
        <path d="M36 52q6 5 12 0t12 0t12 0t12 0" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" />
        {[47, 58, 69].map((x) => (
          <rect key={x} x={x - 2.5} y="27" width="5" height="15" rx="2" fill={S} {...line} strokeWidth={2.5} />
        ))}
        {[47, 58, 69].map((x, i) => (
          <path key={`f${x}`} d={flame(x, 13)} fill={A} className={m.flicker} style={{ transformOrigin: "50% 100%", ...delay(i * 0.3) }} />
        ))}
      </g>
      <path d={sparkle(14, 40, 6)} fill={A} className={m.twinkle} />
      <path d={sparkle(106, 30, 5)} fill={A} className={m.twinkle} style={delay(0.8)} />
      <path d={sparkle(104, 58, 4)} fill={I} opacity="0.5" className={m.twinkle} style={delay(1.4)} />
    </>
  );
}

function Congratulations({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <ellipse cx="60" cy="102" rx="34" ry="4" fill={I} opacity="0.12" />
      <g className={m.bob}>
        <path d="M34 32h-9a11 11 0 0 0 11 18" fill="none" {...line} strokeWidth={4} />
        <path d="M86 32h9a11 11 0 0 1-11 18" fill="none" {...line} strokeWidth={4} />
        <path d="M34 24h52v16a26 26 0 0 1-52 0z" fill={A} {...line} />
        <polygon points={star(60, 42, 10, 4.5)} fill={W} />
        <rect x="54" y="64" width="12" height="18" fill={W} {...line} />
        <rect x="38" y="82" width="44" height="14" rx="4" fill={A} {...line} />
        <line x1="48" y1="89" x2="72" y2="89" stroke={W} strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d={sparkle(16, 26, 7)} fill={A} className={m.twinkle} />
      <path d={sparkle(104, 20, 5)} fill={I} opacity="0.5" className={m.twinkle} style={delay(0.6)} />
      <path d={sparkle(102, 62, 6)} fill={A} className={m.twinkle} style={delay(1.2)} />
      <path d={sparkle(18, 68, 4)} fill={I} opacity="0.4" className={m.twinkle} style={delay(1.8)} />
    </>
  );
}

function Wedding({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <g className={m.bob}>
        <circle cx="47" cy="68" r="22" fill="none" stroke={I} strokeWidth="10" />
        <circle cx="47" cy="68" r="22" fill="none" stroke={A} strokeWidth="5" />
        <circle cx="73" cy="68" r="22" fill="none" stroke={I} strokeWidth="10" />
        <circle cx="73" cy="68" r="22" fill="none" stroke={W} strokeWidth="5" />
        {/* redraw the left ring's lower-right arc on top so the rings read as interlocked */}
        <path d="M67.5 76a22 22 0 0 1-9 11.5" fill="none" stroke={I} strokeWidth="10" strokeLinecap="round" />
        <path d="M67.5 76a22 22 0 0 1-9 11.5" fill="none" stroke={A} strokeWidth="5" strokeLinecap="round" />
        <path d="M47 46l-9-8l5-7h8l5 7z" fill={W} {...line} strokeWidth={2.5} />
      </g>
      <path d={heart(94, 30, 1.6)} fill={A} className={m.float} />
      <path d={heart(22, 34, 1.1)} fill={A} opacity="0.7" className={m.float} style={delay(1.2)} />
      <path d={sparkle(100, 92, 5)} fill={I} opacity="0.4" className={m.twinkle} style={delay(0.5)} />
    </>
  );
}

function NewBaby({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <g className={m.sway} style={{ transformOrigin: "50% 0%" }}>
        <path
          d="M44 22L30 30L18 46L30 56L36 50V90a6 6 0 0 0 6 6H52V88H68V96H78a6 6 0 0 0 6-6V50L90 56L102 46L90 30L76 22C72 32 48 32 44 22Z"
          fill={W}
          {...line}
        />
        <path d="M22 42l10 8M98 42l-10 8" stroke={A} strokeWidth="4" strokeLinecap="round" />
        <path d={heart(60, 60, 1.8)} fill={A} />
        <circle cx="55" cy="84" r="2" fill={I} />
        <circle cx="65" cy="84" r="2" fill={I} />
      </g>
      <path d={sparkle(16, 88, 5)} fill={A} className={m.twinkle} />
      <path d={sparkle(104, 86, 6)} fill={A} className={m.twinkle} style={delay(0.9)} />
      <path d={heart(104, 18, 1)} fill={A} opacity="0.8" className={m.float} style={delay(0.4)} />
    </>
  );
}

function WorkAnniversary({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <g className={m.sway} style={{ transformOrigin: "50% 0%" }}>
        <path d="M50 66L40 104L50 98L56 106L62 72" fill={A} {...line} />
        <path d="M70 66L80 104L70 98L64 106L58 72" fill={A} {...line} />
        <polygon points={star(60, 48, 32, 27, 16)} fill={W} {...line} />
        <circle cx="60" cy="48" r="19" fill={A} {...line} />
        <polygon points={star(60, 48, 10, 4.5)} fill={W} />
      </g>
      <path d={sparkle(18, 26, 6)} fill={A} className={m.twinkle} />
      <path d={sparkle(104, 34, 5)} fill={I} opacity="0.45" className={m.twinkle} style={delay(1)} />
    </>
  );
}

function Farewell({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <path d="M10 96C26 70 44 100 58 78" fill="none" stroke={I} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 7" opacity="0.55" />
      <g className={m.float}>
        <path d="M106 22L24 56L52 66Z" fill={W} {...line} />
        <path d="M106 22L52 66L60 92Z" fill={A} {...line} />
        <path d="M52 66L60 92L68 72" fill={I} opacity="0.18" />
      </g>
      <path d={heart(22, 28, 1.2)} fill={A} opacity="0.8" className={m.float} style={delay(1.5)} />
    </>
  );
}

function Retirement({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <g opacity="0.9">
        {[-60, -30, 0, 30, 60].map((deg) => (
          <line
            key={deg}
            x1="60"
            y1="36"
            x2="60"
            y2="28"
            stroke={A}
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 60 70)`}
          />
        ))}
      </g>
      <path d="M34 70a26 26 0 0 1 52 0z" fill={A} {...line} />
      <line x1="16" y1="70" x2="104" y2="70" {...line} />
      <path d="M28 82q6-5 12 0t12 0" fill="none" {...line} strokeWidth={2.5} />
      <path d="M56 92q6-5 12 0t12 0t12 0" fill="none" {...line} strokeWidth={2.5} />
      <path d="M22 94q5-4 10 0" fill="none" {...line} strokeWidth={2.5} opacity="0.6" />
      <g className={m.float}>
        <path d="M80 30q4-4 8 0q4-4 8 0" fill="none" {...line} strokeWidth={2.5} />
      </g>
      <g className={m.float} style={delay(1.6)}>
        <path d="M20 40q3-3 6 0q3-3 6 0" fill="none" {...line} strokeWidth={2.5} opacity="0.7" />
      </g>
    </>
  );
}

function GetWell({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      {[46, 58, 70].map((x, i) => (
        <path
          key={x}
          d={`M${x} 42c-4-5 4-9 0-15`}
          fill="none"
          stroke={I}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
          className={m.steam}
          style={delay(i * 1.1)}
        />
      ))}
      <ellipse cx="58" cy="98" rx="36" ry="6" fill={A} {...line} />
      <path d="M80 58h6a10 10 0 0 1 0 20h-6" fill="none" {...line} strokeWidth={4} />
      <path d="M32 48H82V82a14 14 0 0 1-14 14H46a14 14 0 0 1-14-14Z" fill={W} {...line} />
      <path d={heart(57, 70, 1.9)} fill={A} />
      <path d={sparkle(102, 34, 5)} fill={A} className={m.twinkle} />
    </>
  );
}

function Letter({ m }: { m: Motion }) {
  return (
    <>
      <Backdrop />
      <g className={m.bob}>
        <rect x="32" y="22" width="56" height="44" rx="4" fill={W} {...line} />
        <line x1="42" y1="34" x2="78" y2="34" stroke={I} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        <line x1="42" y1="42" x2="72" y2="42" stroke={I} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        <path d="M22 50L60 76L98 50V90a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6Z" fill={W} {...line} />
        <path d="M24 94L50 70M96 94L70 70" fill="none" {...line} strokeWidth={2.5} opacity="0.5" />
        <path d={heart(60, 76, 2)} fill={A} {...line} strokeWidth={2} />
      </g>
      <path d={heart(100, 22, 1.3)} fill={A} className={m.float} />
      <path d={heart(18, 36, 1)} fill={A} opacity="0.7" className={m.float} style={delay(1.3)} />
    </>
  );
}

// Solemn by design: no motion classes are referenced here at all, whatever profile is
// passed, a memorial candle never flickers or bobs.
function Memorial() {
  return (
    <>
      <Backdrop />
      <circle cx="60" cy="30" r="17" fill={W} opacity="0.75" />
      <path d={flame(60, 16)} fill={A} />
      <line x1="60" y1="32" x2="60" y2="38" stroke={I} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="46" y="38" width="28" height="58" rx="5" fill={W} {...line} />
      <path d="M52 38v10a3 3 0 0 0 6 0v-10" fill={S} stroke={I} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="60" cy="98" rx="30" ry="5" fill={A} {...line} />
      <path d="M86 98C90 84 94 74 100 64" fill="none" {...line} strokeWidth={2.5} />
      <ellipse cx="96" cy="76" rx="6" ry="3" transform="rotate(-50 96 76)" fill={A} opacity="0.7" />
      <ellipse cx="90" cy="86" rx="6" ry="3" transform="rotate(-20 90 86)" fill={A} opacity="0.7" />
      <ellipse cx="100" cy="66" rx="5" ry="2.5" transform="rotate(-70 100 66)" fill={A} opacity="0.7" />
    </>
  );
}

const ART: Record<string, (props: { m: Motion }) => React.ReactElement> = {
  birthday: Birthday,
  congratulations: Congratulations,
  wedding: Wedding,
  "new-baby": NewBaby,
  "work-anniversary": WorkAnniversary,
  farewell: Farewell,
  retirement: Retirement,
  "get-well": GetWell,
  "thank-you": Letter,
  memorial: Memorial,
};

export function OccasionArt({
  occasionKey,
  profile,
  palette,
  className,
  animate = "always",
  title,
}: {
  occasionKey: string;
  profile: Profile;
  palette: ArtPalette;
  className?: string;
  /** "hover" pauses motion until a `.group` ancestor is hovered, for grids of tiles. */
  animate?: "always" | "hover" | "never";
  title?: string;
}) {
  const Art = ART[occasionKey] ?? Letter;
  const m = animate === "never" ? {} : MOTION[profile];
  const style = {
    "--art-accent": palette.accent,
    "--art-soft": palette.accentSoft,
    "--art-ink": palette.ink,
    "--art-surface": palette.surface ?? "#ffffff",
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className ?? ""} ${animate === "hover" ? "fh-hover-only" : ""}`}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      overflow="visible"
    >
      <Art m={m} />
    </svg>
  );
}
