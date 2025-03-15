export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
};



// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const SECRET_KEY = "moijhfdftyujbvy";

// export function middleware(req) {
//     const token = req.cookies.get("token")?.value;

//     if (!token) {
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);

//         if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
//             return NextResponse.redirect(new URL("/users", req.url));
//         }

//         if (req.nextUrl.pathname.startsWith("/users") && decoded.role !== "user") {
//             return NextResponse.redirect(new URL("/admin", req.url));
//         }

//         return NextResponse.next();
//     } catch (error) {
//         return NextResponse.redirect(new URL("/sign-in", req.url));
//     }
// }

// export const config = {
//     matcher: ["/users/:path*", "/admin/:path*"], // ✅ Protecting these routes
// };
