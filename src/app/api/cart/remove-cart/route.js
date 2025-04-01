import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// remove product from cart
export async function DELETE(req) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const productId = searchParams.get("productId");
  
      if (!userId || !productId) {
        return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 });
      }
  
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });
  
      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
  
      const existingCartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });
  
      if (!existingCartItem) {
        return NextResponse.json({ error: "Product not in cart" }, { status: 404 });
      }
  
      await prisma.cartItem.delete({
        where: { id: existingCartItem.id },
      });
  
      return NextResponse.json({ message: "Removed from cart" }, { status: 200 });
    } catch (error) {
      console.error("Error removing from cart:", error);
      return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
    }
  }
  