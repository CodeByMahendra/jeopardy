// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     const { token } = req.nextauth;
//     const { pathname } = req.nextUrl;

//     if (!token) {
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     if (token.role === "USER" && pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/game", req.url));
//     }

//     // if (token.role === "ADMIN" && pathname.startsWith("/users")) {
//     //   return NextResponse.redirect(new URL("/admin/create-blog", req.url));
//     // }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token, 
//     },
//   }
// );

// export const config = {
//   matcher: ["/admin/:path*"],
// //    "/users/:path*"],
// };





// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth?.token; // Ensure token exists before accessing it
//     const { pathname } = req.nextUrl;

//     if (!token) {
//       return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     if (token?.role === "USER" && pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/game", req.url));
//     }

//     // Uncomment this if needed
//     // if (token?.role === "ADMIN" && pathname.startsWith("/users")) {
//     //   return NextResponse.redirect(new URL("/admin/create-blog", req.url));
//     // }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token, // Ensure the user is authenticated
//     },
//   }
// );

// export const config = {
//   matcher: ["/admin/:path*"], 
//   // "/users/:path*"],
// };


import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const { pathname } = req.nextUrl;

    console.log("Middleware Token:", token); 

    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (token.role === "USER" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/game", req.url));
    }

    if (token.role === "ADMIN" && pathname.startsWith("/admin")) {
      console.log("Admin accessing admin route ✅");
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Authorized Token in Middleware:", token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"], 
};
