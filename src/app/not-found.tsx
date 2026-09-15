import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#fdf8ee] px-6 py-20 text-center">
      <LogoMark className="h-10 w-10" color="#c4713f" />
      <h1 className="mt-6 font-heading text-3xl text-[#241c0a]">This page isn&apos;t here</h1>
      <p className="mt-3 max-w-sm text-[#241c0a]/60">
        The link might be mistyped, or the board may have been made private by its owner.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[#241c0a] px-6 py-3 text-sm font-semibold text-white"
      >
        Go home
      </Link>
    </div>
  );
}
