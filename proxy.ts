import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/register", "/unauthorized", "/landing.html"];

// Role requirements for specific pages
const ROLE_GUARDS: Record<string, string[]> = {
  "/maintenance.html": ["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"],
  "/reports.html":     ["ADMIN", "FLEET_MANAGER", "FINANCIAL_ANALYST"],
  "/settings.html":    ["ADMIN", "FLEET_MANAGER"],
  "/users":            ["ADMIN", "FLEET_MANAGER"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow API routes, static assets, and Next.js internal chunks to pass through
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/src/") || // Serve frontend JS/CSS assets without auth
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // 1. Unauthenticated users flow
  if (!user) {
    if (pathname === "/" || pathname === "/landing.html") {
      // Rewrite root "/" to the public landing page
      return NextResponse.rewrite(new URL("/landing.html", req.url));
    }
    if (!isPublic) {
      // Redirect protected static pages and routes to login
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Authenticated users flow
  if (user) {
    // If logged-in user visits landing page, login page, register page, or root:
    if (
      pathname === "/" ||
      pathname === "/landing.html" ||
      pathname === "/login" ||
      pathname === "/register"
    ) {
      // Rewrite root/landing to the actual authenticated dashboard
      return NextResponse.rewrite(new URL("/index.html", req.url));
    }

    // Role-based route/page guards
    for (const [pagePath, allowedRoles] of Object.entries(ROLE_GUARDS)) {
      if (pathname.startsWith(pagePath)) {
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
