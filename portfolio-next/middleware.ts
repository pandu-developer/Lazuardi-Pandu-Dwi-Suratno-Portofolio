import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Protect every /admin route except the login page itself.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const ok = await verifyToken(req.cookies.get(COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
