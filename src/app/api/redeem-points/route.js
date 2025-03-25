import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";


export async function PUT(req) {
    


    try {

        const body = await req.json()
        const { userId ,productId} = body;

        if(!userId || !productId){
            return NextResponse.json({message:"All fields are required"})
        }

        console.log("UserId=",userId)
        console.log("ProductId=",productId)



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

  if (user.score < price) {
    return res.status(400).json({ error: "Not enough points" });
  }

 const userShopping= await prisma.user.update({
    where: { id: userId },
    data: { score: { decrement: price } }, 
  });


 



  return NextResponse.json(userShopping, { status: 200 });

}
    catch (error) {

        console.error("Error userShopping:", error);
        return NextResponse.json({ message: "Error userShopping", error }, { status: 500 });
  
        
    }
    
}





