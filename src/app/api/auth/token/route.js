// import { cookies } from "next/headers"; // ✅ Next.js function to read cookies

// export async function GET() {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value; // ✅ Get token from cookies

//   if (!token) {
//     return Response.json({ error: "Token not found" }, { status: 401 });
//   }

//   return Response.json({ token }); // ✅ Send token to frontend
// }


import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Token not found" }, { status: 401 });
  }

  return Response.json({ token });
}
