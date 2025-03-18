


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  

//  Get User Score
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { score: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ score: user.score });

  } catch (error) {
    console.error("Error fetching score:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
