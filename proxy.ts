import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

// Public clean paths & static files
const PUBLIC_PATHS = ["/login", "/register", "/unauthorized", "/landing.html"];

// Maps clean URLs to their corresponding static HTML files in the public directory
const STATIC_REWRITES: Record<string, string> = {
  "/drivers":     "/drivers.html",
  "/trips":       "/trips.html",
  "/maintenance": "/maintenance.html",
  "/reports":     "/reports.html",
  "/settings":    "/settings.html",
  "/fleet-map":   "/fleet-map.html",
  "/alerts":      "/alerts.html",
};

// Role-based authorization rules (supports clean paths & raw HTML paths)
const ROLE_GUARDS: Record<string, string[]> = {
  "/maintenance":      ["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"],
  "/maintenance.html": ["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"],
  "/reports":          ["ADMIN", "FLEET_MANAGER", "FINANCIAL_ANALYST"],
  "/reports.html":     ["ADMIN", "FLEET_MANAGER", "FINANCIAL_ANALYST"],
  "/settings":         ["ADMIN", "FLEET_MANAGER"],
  "/settings.html":    ["ADMIN", "FLEET_MANAGER"],
  "/users":            ["ADMIN", "FLEET_MANAGER"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow API routes, dynamic Next.js compilation chunks, and public assets to bypass auth
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/src/") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // 1. GUEST USER FLOW
  if (!user) {
    if (pathname === "/" || pathname === "/landing.html") {
      // Show public landing page content on root request
      return NextResponse.rewrite(new URL("/landing.html", req.url));
    }
    
    // Redirect direct hits on clean static routes or raw HTML files to /login
    const cleanPath = pathname.replace(".html", "");
    const isProtectedStatic = cleanPath in STATIC_REWRITES || pathname.endsWith(".html");
    const isProtectedReact = pathname === "/users" || pathname === "/vehicles" || pathname === "/bookings" || pathname === "/routes";
    
    if (!isPublic && (isProtectedStatic || isProtectedReact)) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }

  // 2. LOGGED-IN USER FLOW
  if (user) {
    // If logged-in user hits landing, login, register, or root:
    if (
      pathname === "/" ||
      pathname === "/landing.html" ||
      pathname === "/login" ||
      pathname === "/register"
    ) {
      // Redirect or rewrite directly to the main dashboard
      return NextResponse.rewrite(new URL("/index.html", req.url));
    }

    // Enforce Role-based access controls
    for (const [pagePath, allowedRoles] of Object.entries(ROLE_GUARDS)) {
      if (pathname === pagePath || pathname.startsWith(pagePath + "/")) {
        if (!allowedRoles.includes(user.role)) {
          const unauthUrl = req.nextUrl.clone();
          unauthUrl.pathname = "/unauthorized";
          return NextResponse.redirect(unauthUrl);
        }
      }
    }

    // Clean URL Rewrite matching: e.g. /drivers -> /drivers.html
    if (pathname in STATIC_REWRITES) {
      return NextResponse.rewrite(new URL(STATIC_REWRITES[pathname], req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
