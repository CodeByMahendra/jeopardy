
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
  
      if (!userId) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });
  
      return new Response(JSON.stringify(cart), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch cart" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }


export async function POST(req) {
    try {
      const body = await req.json();
      const { userId, productId, price, quantity } = body;
  
      if (!userId || !productId || !price) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      let cart = await prisma.cart.findUnique({
        where: { userId },
      });
  
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }
  
      const existingCartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId }, // ✅ Fixed issue
      });
  
      if (existingCartItem) {
        await prisma.cartItem.update({
          where: { id: existingCartItem.id }, // ✅ Use `cartId` if needed
          data: { quantity: existingCartItem.quantity + 1 },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId, price, quantity: quantity || 1 }, // ✅ Use `cartId`
        });
      }
  
      return NextResponse.json({ message: "Added to cart" }, { status: 200 });
    } catch (error) {
      console.error("Error adding to cart:", error);
      return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
    }
  }

  
  export async function PUT(req) {
    try {
      const { cartItemId, quantity } = await req.json(); // Fix req.json()
  
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
  
      return NextResponse.json({ message: "Cart updated!" }, { status: 200 }); // Fix response
    } catch (error) {
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }
  }
  
  export async function DELETE(req) {
    try {
      const { cartItemId } = await req.json(); 
  
      await prisma.cartItem.delete({ where: { id: cartItemId } });
  
      return NextResponse.json({ message: "Removed from cart!" }, { status: 200 }); // Fix response
    } catch (error) {
      return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
    }
  }



  