// Route guard (Next 16 `proxy` convention, runs on Node.js before rendering): signed-in
// owners are bounced off the auth pages, signed-out visitors off the dashboard. It does a
// real Better Auth session check (cheap thanks to the session cookie cache) rather than
// "does a cookie exist", so a stale cookie can't ping-pong someone between /sign-in and
// /dashboard. Pages and Server Actions still verify the session themselves
// (requireSession), proxy is the fast first line, not the only one. Contributors never
// authenticate, so board pages only pass through here to turn an invite link
// (/b/<slug>?invite=<token>) into a per-board cookie before landing on the clean URL;
// no session lookup happens for them.
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { safeRedirect } from "@/lib/redirect";
import { inviteCookieName } from "@/lib/board-state";

const AUTH_PAGES = new Set(["/sign-in", "/sign-up"]);

export async function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  if (pathname.startsWith("/b/")) {
    const token = searchParams.get("invite");
    const slug = pathname.split("/")[2];
    if (!token || !slug || !/^[\w-]{8,64}$/.test(token)) return NextResponse.next();
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("invite");
    const response = NextResponse.redirect(clean);
    response.cookies.set(inviteCookieName(slug), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  }
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
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/b/:path*"],
};
