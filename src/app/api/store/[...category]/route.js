import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, context) {
  try {

    const body = await req.json()
    const { userId } = body;


    console.log("UserId  == ",userId)
    const categoryName = context.params.category?.[0]?.trim(); 

    console.log("Requested Category:", categoryName);



    if (!categoryName) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

            const user = await prisma.user.findUnique({where:{id:userId}})
    

    const allCategories = await prisma.storecategory.findMany();
    console.log("All Categories in DB:", allCategories);

    const categoryData = allCategories.find(cat => cat.name.trim().toLowerCase() === categoryName.toLowerCase());

    if (!categoryData) {
      return NextResponse.json({ error: `Category '${categoryName}' not found` }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { categoryId: categoryData.id },
    });


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
  
  

    // if (allProduct.length === 0) {
    //   return NextResponse.json({ error: `No blogs found for category: ${categoryName}` }, { status: 404 });
    // }



    // return NextResponse.json(allProduct);
  } catch (error) {
    console.error("Error getting blog:", error);
    return NextResponse.json({ error: "Failed to get blog" }, { status: 500 });
  }
}
