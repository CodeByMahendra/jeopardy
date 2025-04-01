import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// Update order status in database
export async function PUT(req) {
    try {
        const body = await req.json();
        const { orderId, status } = body;
        console.log("Order Id=",orderId)
        console.log("status Id=",status)


        if (!orderId || !status) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return NextResponse.json({ message: "Order status updated", updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json({ message: "Error updating order status", error }, { status: 500 });
    }
}