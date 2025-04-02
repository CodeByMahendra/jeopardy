import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// Add to wishlist

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Received Data=", body);
    
        const { userId, productId } = body;

        console.log("UserId=",userId)
      console.log("ProductId=",productId)    
        if (!userId || !productId) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }
    
        const existingWishlistItem = await prisma.wishlist.findFirst({
            where: {
              userId,
              productId,
            },
          });
          
          if (existingWishlistItem) {
            return NextResponse.json({ message: "Product already in wishlist" }, { status: 400 });
          }
          
    
        const newWishlistItem = await prisma.wishlist.create({
        data: {
            userId,
            productId,
        },
        });
    
        console.log("New Wishlist Item:", newWishlistItem);
        return NextResponse.json(newWishlistItem);
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return NextResponse.json({ message: "Error adding to wishlist", error }, { status: 500 });
    }
    }


  


    // Remove from wishlist
export async function DELETE(req) {
        try {
            const body = await req.json();
            console.log("Received Data=", body);
        
            const { userId, productId } = body;
        
            if (!userId || !productId) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
            }
        
            const deletedWishlistItem = await prisma.wishlist.deleteMany({
            where: {
                userId,
                productId,
            },
            });
        
            console.log("Deleted Wishlist Item:", deletedWishlistItem);
            return NextResponse.json({ message: "Product removed from wishlist" });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return NextResponse.json({ message: "Error removing from wishlist", error }, { status: 500 });
        }
    }



    // Get all wishlist items for a user
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
    
        if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
    
        const wishlistItems = await prisma.wishlist.findMany({
        where: { userId },
        include: {
            product: true,
        },
        });
    
        console.log("Wishlist Items:", wishlistItems);
        return NextResponse.json(wishlistItems);
    } catch (error) {
        console.error("Error fetching wishlist items:", error);
        return NextResponse.json({ message: "Error fetching wishlist items", error }, { status: 500 });
    }
    }