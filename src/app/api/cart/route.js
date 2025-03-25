import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";  


export async function POST(req) {
    try {
        const { userId, productId, quantity } = await req.json();

        if (!userId || !productId || !quantity) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        let cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId,
                },
            });
        }

        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId, 
            },
        });

        if (existingCartItem) {
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                    price: 100, 
                },
            });
        }

        return new Response(JSON.stringify({ message: "Product added to cart" }), { status: 200 });
    } catch (error) {

        console.error(error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}





export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, 
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const updatedCartItems = cart.items.map((item) => {
      let price = item.product.basePrice;

      if (user.membership === "ONE_MONTH") {
        price = item.product.priceOneMonth;
      } else if (user.membership === "ONE_YEAR") {
        price = item.product.priceOneYear;
      } else if (user.membership === "LIFETIME") {
        price = item.product.priceLifetime;
      }

      return {
        ...item,
        product: {
          ...item.product,
          price,
        },
      };
    });

    return NextResponse.json(updatedCartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

  

export async function DELETE(req) {
    try {
      const { userId, productId } = await req.json();
  
      if (!userId || !productId) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
  
      await prisma.cartItem.deleteMany({
        where: { cart: { userId }, productId },
      });
  
      return NextResponse.json({ message: "Item removed" }, { status: 200 });
    } catch (error) {
      console.error("Error removing cart item:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }