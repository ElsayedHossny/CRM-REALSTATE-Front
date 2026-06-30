import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/clients/:path*",
    "/controlPanel/:path*",
    "/expenses/:path*",
    "/installmentPlans/:path*",
    "/invoices/:path*",
    "/logout/:path*",
    "/payments/:path*",
    "/products/:path*",
    "/profitandloss/:path*",
    "/residentialapartments/:path*",
    "/sales/:path*",
    "/settings/:path*",
    "/storeManagement/:path*",
    "/touristrealestate/:path*",
    "/users/:path*",
    "/villas/:path*",
  ],
};