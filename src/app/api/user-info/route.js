import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    console.log("Decoded User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, score: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
