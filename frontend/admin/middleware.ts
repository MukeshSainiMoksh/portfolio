import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware runs on the edge — no access to localStorage.
// Token protection is handled client-side in the dashboard layout.
// This middleware just ensures /login always renders.

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
