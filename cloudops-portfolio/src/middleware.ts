import { NextResponse, type NextRequest } from "next/server";
import { maybeRateLimitApiRequest } from "@/lib/rate-limit";

/**
 * PORTFOLIO BUILD — auth gate removed.
 *
 * In the real CloudOps app this middleware is a cookie-based auth gate that
 * redirects the operator console (/console, /services, /traces, /load) and the
 * cart/checkout/admin routes to Cognito login. The standalone portfolio has no
 * Cognito and no session, so every route is public — that's the whole point:
 * a visitor lands straight on the live-looking console.
 *
 * The original protected-route logic and the /login redirect are preserved in
 * git history and documented in PLAN.md if you ever want to re-gate a route.
 * We keep a light API rate-limit so a deployed demo can't be trivially hammered.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    const limited = maybeRateLimitApiRequest(req);
    if (limited) return limited;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
