

import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Token not found" }, { status: 401 });
  }

  return Response.json({ token });
}
