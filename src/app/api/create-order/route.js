import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req) {

    try {
  
        const body = await req.json()
   console.log("Data=",body)
   const { userId , productId} = body;
  
        if(!userId  || !productId ){
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!user || !product) return res.status(404).json({ error: "User or Product not found" });
  
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

        console.log("Price=",price)
        const createOrder = await prisma.order.create({  data: {
            userId,
            productId,
            total: price,
            status: "Pending",

          }, });


  
        console.log("createBlog:", createOrder);
    return NextResponse.json(createOrder);
  
    } catch (error) {
        console.error("Error  createOrder:", error);
        return NextResponse.json({ message: "Error  createOrder", error }, { status: 500 });
    }
    
  }
  