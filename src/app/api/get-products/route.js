import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function POST(req) {

    try {
        
        const body = await req.json()
        const { userId } = body;




        const user = await prisma.user.findUnique({where:{id:userId}})

const products = await prisma.product.findMany();

const updateProducts = products.map(product =>{
    let price = product.basePrice;
    if(user.membership === "ONE_MONTH"){
        price = product.priceOneMonth;

    }

   else if(user.membership === "ONE_YEAR"){
        price = product.priceOneYear;

    }

    if(user.membership === "LIFETIME"){
        price = product.priceLifetime;

    }

    return {...product,price}
    })
    return NextResponse.json(updateProducts, { status: 200 });


    } catch (error) {

              console.error("Error updateProducts:", error);
              return NextResponse.json({ message: "Error updateProducts", error }, { status: 500 });
        
    }
    
}