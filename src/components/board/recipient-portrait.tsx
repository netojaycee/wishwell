// The recipient's photos as a small fan of prints: the main photo large in front, up to 3
// more tucked behind. Used on the board hero so visitors immediately see who it's for.
// Solemn boards lay the prints straight (no playful tilt); nothing here animates.
import type { OccasionTypeRow } from "@/lib/types";

type MotionProfile = OccasionTypeRow["motionProfile"];

const TILTS = [-7, 6, -3];

export function RecipientPortrait({
  photos,
  name,
  profile,
  size = "lg",
  children,
}: {
  photos: string[];
  name: string;
  profile: MotionProfile;
  size?: "lg" | "sm";
  children?: React.ReactNode; // badge overlaid on the main photo's corner
}) {
  const [main, ...extras] = photos;
  if (!main) return null;
  const tilt = (i: number) => (profile === "solemn" ? 0 : TILTS[i % TILTS.length]);

  // Order in the row: first extra to the left of the main photo, the rest to the right.
  const left = extras.slice(0, 1);
  const right = extras.slice(1);
  const lg = size === "lg";

  const print = (url: string, i: number) => (
    <div
      key={url}
      className={`relative shrink-0 overflow-hidden rounded-2xl border-[3px] shadow-lg ${
        lg ? "-mx-3 h-24 w-20 sm:-mx-4 sm:h-36 sm:w-28" : "-mx-2 h-16 w-14"
      }`}
      style={{ borderColor: "var(--board-surface)", transform: `rotate(${tilt(i)}deg)` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- user photo from R2; image optimization is off site-wide */}
      <img src={url} alt={`${name}, photo ${i + 2}`} loading="lazy" className="h-full w-full object-cover object-[50%_30%]" />
    </div>
  );

  return (
    <div className="flex items-center justify-center">
      {left.map((url) => print(url, 0))}
      <div className="relative z-10 shrink-0">
        <div
          className={`overflow-hidden border-4 shadow-xl ${
            lg ? "h-40 w-32 rounded-[1.75rem] sm:h-56 sm:w-44 sm:rounded-[2rem]" : "h-24 w-20 rounded-2xl"
          }`}
          style={{ borderColor: "var(--board-surface)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- user photo from R2; image optimization is off site-wide */}
          <img src={main} alt={name} fetchPriority="high" className="h-full w-full object-cover object-[50%_30%]" />
        </div>
        {children}
      </div>
      {right.map((url, i) => print(url, i + 1))}
    </div>
  );
}
