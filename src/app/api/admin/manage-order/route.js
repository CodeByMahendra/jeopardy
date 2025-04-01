


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



// get all order in database
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,  
          },
        },
      },
      orderBy: {
        createdAt: "desc",  
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Error fetching orders", error }, { status: 500 });
  }
}
