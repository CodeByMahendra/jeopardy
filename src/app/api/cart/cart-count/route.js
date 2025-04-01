import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    const count = cart?.items?.length || 0;

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
