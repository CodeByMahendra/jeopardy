import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

 export async function GET() {

    try {
        
        const usersWithOrders = await prisma.user.findMany({
            where: {
              orders: { some: {} }, 
            },
            include: {
              orders: {
                include: {
                  product: true, 
                },
              },
            },
          });

          return NextResponse.json(usersWithOrders);

    } catch (error) {

        console.error("Error  usersWithOrders:", error);
        return NextResponse.json({ message: "Error  usersWithOrders", error }, { status: 500 });
        
    }

    
 }

