


import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const digitalOrders = await prisma.order.findMany({
      where: {
        userId: userId,
        isDigital: true,
      },
      include: {
        items: {
          include: {
            product: true, 
          },
        },
      },
    });

    return NextResponse.json(digitalOrders, { status: 200 });

  } catch (error) {
    console.error("Error fetching digital orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
