import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// get all products in database

export async function GET() {

    try {
        const allProducts = await prisma.product.findMany()
        console.log("all Produc=",allProducts)

        return NextResponse.json(allProducts)

    } catch (error) {

        console.error(error)

        return NextResponse.json({ message: "Error getting allProducts", error }, { status: 500 });

        
    }
}
