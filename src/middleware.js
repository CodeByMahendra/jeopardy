// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose"; 

// const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "moijhfdftyujbvy");

// async function verifyToken(token) {
//     try {
//         const { payload } = await jwtVerify(token, SECRET_KEY);
//         return payload;
//     } catch (error) {
//         console.error("JWT verification failed:", error);
//         return null;
//     }
// }

// export async function middleware(req) {
//     const token = req.cookies.get("token")?.value;
//     console.log('Token===',token)
//     if (!token) {
//         console.log("No token found, redirecting to login...");
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     const decoded = await verifyToken(token);

//     if (!decoded) {
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     console.log("Decoded Token:", decoded);

//     const { pathname } = req.nextUrl;

//     if (decoded.role === "USER" && pathname.startsWith("/admin")) {
//         return NextResponse.redirect(new URL("/users/game", req.url));
//     }

//     if (decoded.role === "ADMIN" && pathname.startsWith("/users")) {
//         return NextResponse.redirect(new URL("/admin/create-blog", req.url));
//     }

//     return NextResponse.next();
// }

// // ✅ Correct matcher to apply middleware only on protected routes
// export const config = {
//     matcher: ["/admin/:path*", "/users/:path*"],
// };








import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (token.role === "USER" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/users/game", req.url));
    }

    if (token.role === "ADMIN" && pathname.startsWith("/users")) {
      return NextResponse.redirect(new URL("/admin/create-blog", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/users/:path*"],
};
