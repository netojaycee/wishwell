// Route guard (Next 16 `proxy` convention, runs on Node.js before rendering): signed-in
// owners are bounced off the auth pages, signed-out visitors off the dashboard. It does a
// real Better Auth session check (cheap thanks to the session cookie cache) rather than
// "does a cookie exist", so a stale cookie can't ping-pong someone between /sign-in and
// /dashboard. Pages and Server Actions still verify the session themselves
// (requireSession) — proxy is the fast first line, not the only one. Contributors never
// authenticate, so boards and posting are deliberately not matched.
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { safeRedirect } from "@/lib/redirect";

const AUTH_PAGES = new Set(["/sign-in", "/sign-up"]);

export async function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);

  if (AUTH_PAGES.has(pathname)) {
    if (!session) return NextResponse.next();
    const target = safeRedirect(searchParams.get("redirectTo")) ?? "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Everything else matched is the owner area.
  if (session) return NextResponse.next();
  const signIn = new URL("/sign-in", request.url);
  signIn.searchParams.set("redirectTo", `${pathname}${search}`);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
