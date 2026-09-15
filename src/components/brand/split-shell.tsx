import { BrandPanel } from "./brand-panel";

// The sign-in/sign-up split screen. Desktop: story panel column + form column. Mobile:
// the same story panel as a short top band with the form rising over it on a rounded
// sheet — so phones get the same warmth as desktop instead of a bare centered form.
// (About/Contact used to live here too; they now sit in the (marketing) group with the
// real SiteHeader/SiteFooter and use BrandPanel as a side card.)
export function SplitShell({
  children,
  tagline = "One link. Everyone contributes. Nothing to manage but the memory.",
  contentClassName = "max-w-sm",
}: {
  children: React.ReactNode;
  tagline?: string;
  contentClassName?: string;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:grid lg:grid-cols-2">
      <BrandPanel variant="band" tagline={tagline} className="px-6 pt-5 pb-12 lg:hidden" />
      <BrandPanel
        variant="column"
        tagline={tagline}
        className="hidden lg:flex lg:flex-col lg:justify-between lg:p-12"
      />

      <div className="relative z-10 -mt-6 flex flex-1 items-start justify-center rounded-t-[28px] bg-[var(--background)] px-6 pt-10 pb-14 shadow-[0_-16px_32px_-16px_rgba(0,0,0,0.35)] lg:mt-0 lg:items-center lg:rounded-none lg:py-16 lg:shadow-none">
        <div className={`w-full ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
}
