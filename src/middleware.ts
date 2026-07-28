import { NextResponse, type NextRequest } from "next/server";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/constants";

const PUBLIC_ACCOUNT_PATHS = [
  "/account/login",
  "/account/register",
  "/account/forgot-password",
  "/account/reset-password",
  "/account/verify-otp",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value);
  const isPublicAccountPath = PUBLIC_ACCOUNT_PATHS.some((path) => pathname.startsWith(path));

  if (isAuthenticated && isPublicAccountPath) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (!isAuthenticated && pathname.startsWith("/account") && !isPublicAccountPath) {
    const loginUrl = new URL("/account/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
