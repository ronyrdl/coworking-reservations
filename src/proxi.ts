
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.JWT_ACCESS_SECRET;

if (!secret) {
  throw new Error("Falta JWT_ACCESS_SECRET en .env");
}

const key = new TextEncoder().encode(secret);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/reservations");

  const isAdminRoute = pathname.startsWith("/admin");

  if (!token && (isPrivateRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && (isPrivateRoute || isAdminRoute)) {
    try {
      const { payload } = await jwtVerify(token, key);

      if (isAdminRoute && payload.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard", request.url),
        );
      }
    } catch {
      const response = NextResponse.redirect(
        new URL("/login", request.url),
      );

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reservations/:path*",
    "/admin/:path*",
  ],
};
