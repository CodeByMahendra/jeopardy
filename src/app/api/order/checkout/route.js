

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!cart || cart.items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    let totalCost = cart.items.reduce((acc, item) => {
      const price = user.membership === "LIFETIME"
        ? item.product.priceLifetime
        : user.membership === "ONE_YEAR"
        ? item.product.priceOneYear
        : user.membership === "ONE_MONTH"
        ? item.product.priceOneMonth
        : item.product.basePrice;
      return acc + price * item.quantity;
    }, 0);

    if (user.score < totalCost) {
      return NextResponse.json({ error: "Not enough score" }, { status: 400 });
    }

   

    // Create order
const order = await prisma.order.create({
  data: {
    userId,
    total: totalCost,
    status: "Pending",
    isDigital: cart.items.some(item => item.product.type === "DIGITAL"),
    items: {
      create: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: user.membership === "LIFETIME" ? item.product.priceLifetime :
               user.membership === "ONE_YEAR" ? item.product.priceOneYear :
               user.membership === "ONE_MONTH" ? item.product.priceOneMonth :
               item.product.basePrice,
        totalPrice: item.quantity * (
          user.membership === "LIFETIME" ? item.product.priceLifetime :
          user.membership === "ONE_YEAR" ? item.product.priceOneYear :
          user.membership === "ONE_MONTH" ? item.product.priceOneMonth :
          item.product.basePrice
        ),
        isDigital: item.product.type === "DIGITAL",
        orderId: undefined, 
      })),
    },
  },
  include: {
    items: true,
  },
});


    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { score: user.score - totalCost },
      }),
      prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    ]);

    return NextResponse.json({
      message: "Order placed successfully",
      newScore: user.score - totalCost,
      order, 
    }, { status: 200 });

  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
