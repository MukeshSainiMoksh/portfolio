import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Token lives in a cookie (see lib/auth.ts) so we can gate routes here,
// before any dashboard HTML is sent. The API still re-validates the JWT
// on every request — this is a UX/first-line guard, not the security boundary.

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  const isLogin = pathname.startsWith("/login");

  if (!token && !isLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && isLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
