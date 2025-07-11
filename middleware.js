import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const path = req.nextUrl.pathname;

    // Redirect logic
    if (path.startsWith("/admin") && isAdmin) {
      return NextResponse.redirect(new URL("/admin/manage-blogs", req.url));
    }
    if (path.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/game", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/sign-in", // Redirect unauthenticated users to sign-in
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [ "/admin/:path*"],
};
