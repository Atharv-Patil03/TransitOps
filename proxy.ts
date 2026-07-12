import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/register", "/unauthorized"];

// Role requirements for specific route prefixes
const ROLE_GUARDS: Record<string, string[]> = {
  "/maintenance": ["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"],
  "/reports":     ["ADMIN", "FLEET_MANAGER", "FINANCIAL_ANALYST"],
  "/settings":    ["ADMIN", "FLEET_MANAGER"],
  "/users":       ["ADMIN", "FLEET_MANAGER"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow API routes and static assets to pass through
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users to login
  if (!user && !isPublic) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from /login and /register
  if (user && (pathname === "/login" || pathname === "/register")) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  // Role-based route guards
  if (user && !isPublic) {
    for (const [prefix, allowedRoles] of Object.entries(ROLE_GUARDS)) {
      if (pathname.startsWith(prefix)) {
        if (!allowedRoles.includes(user.role)) {
          const unauthUrl = req.nextUrl.clone();
          unauthUrl.pathname = "/unauthorized";
          return NextResponse.redirect(unauthUrl);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
