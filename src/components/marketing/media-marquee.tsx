// Home page's auto-scrolling strip of demo cards (photos, GIFs, words) across several
// occasions, each in its own theme. Memorial content is deliberately excluded — solemn
// boards are still, and a scrolling ticker is not. Stops under reduced motion and becomes
// a normal horizontal scroller instead.
import { boardThemeVars } from "@/lib/theme/vars";
import { showcaseFor } from "@/lib/content/moments";
import type { ThemeRow } from "@/lib/types";
import { DemoCard } from "@/components/showcase/demo-card";

const STRIP: [occasionKey: string, postIndex: number][] = [
  ["birthday", 0],
  ["thank-you", 1],
  ["wedding", 0],
  ["get-well", 2],
  ["new-baby", 0],
  ["congratulations", 1],
  ["retirement", 0],
  ["farewell", 0],
  ["birthday", 1],
  ["work-anniversary", 2],
  ["wedding", 2],
  ["farewell", 1],
  ["new-baby", 1],
  ["thank-you", 2],
];

function Strip({ themes, duplicate = false }: { themes: Record<string, ThemeRow | undefined>; duplicate?: boolean }) {
  return (
    // pr-5 matches gap-5 so both halves are exactly equal width → seamless -50% loop.
    <div className={`flex items-start gap-5 pr-5 ${duplicate ? "motion-reduce:hidden" : ""}`} aria-hidden={duplicate || undefined}>
      {STRIP.map(([key, index], i) => {
        const theme = themes[key];
        const post = showcaseFor(key).posts[index];
        if (!theme || !post) return null;
        return (
          <div key={`${key}-${index}`} className="w-[210px] shrink-0 sm:w-[230px]" style={boardThemeVars(theme)}>
            <DemoCard post={post} rotate={i % 2 ? 1.2 : -1.2} sizes="230px" />
          </div>
        );
      })}
    </div>
  );
}

export function MediaMarquee({ themes }: { themes: Record<string, ThemeRow | undefined> }) {
  return (
    <div className="fh-marquee-wrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
      <div className="fh-marquee flex w-max py-6 pl-5">
        <Strip themes={themes} />
        <Strip themes={themes} duplicate />
      </div>
    </div>
  );
}
