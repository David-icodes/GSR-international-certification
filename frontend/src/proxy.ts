import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/owner")) {
    const newPath = pathname.replace(/^\/owner/, "/admin");
    return NextResponse.redirect(new URL(newPath, request.url), { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner", "/owner/:path*"]
};
