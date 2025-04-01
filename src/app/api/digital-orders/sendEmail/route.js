



import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendDigitalDownloadEmail } from "@/utils/sendEmail";

export async function POST(req) {
  try {
    const { userId, orderId } = await req.json();

    if (!userId || !orderId) {
      return NextResponse.json({ error: "User ID and Order ID are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
      include: {
        items: { 
          include: {
            product: true, 
          },
        },
      },
    });

    if (!order || !order.items || order.items.length === 0) {
      return NextResponse.json({ error: "Invalid order or no items available" }, { status: 400 });
    }

    const digitalItem = order.items.find(item => item.product.type === "DIGITAL");

    if (!digitalItem || !digitalItem.product.fileUrl) {
      return NextResponse.json({ error: "No digital product available or file URL missing" }, { status: 400 });
    }

    //  email with the download link
    await sendDigitalDownloadEmail(user.email, digitalItem.product.name, digitalItem.product.fileUrl);

    return NextResponse.json({ message: "Download email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error sending download email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
