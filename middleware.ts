import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed if the user is authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account/:path*", "/favorites", "/cart", "/checkout"],
};
