import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Create a new category in the database for store

export async function POST(req) {
    try {
        const body = await req.json()
        const {name,image} = body

        const newCategory = await prisma.storecategory.create({
            data:{name,image},
    })
    return new Response(JSON.stringify(newCategory), { status: 200 });

    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({error:"Failed to create category"},{status:500}))
    }
}

// Get all categories of store
export async function GET(req){
    try {
        const allCategories = await prisma.storecategory.findMany()
        return new Response(JSON.stringify(allCategories),{
     status:200,
     headers:{"Content-Type":"application/json"},
        })
    } catch (error) {

        return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        
    }
}


// Delete category
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    
    console.log("Received data =", id);

    if (!id) {
      return NextResponse.json({ message: "Category ID is required" }, { status: 400 });
    }

    await prisma.order.deleteMany({
      where: {
        product: {
          categoryId: id,
        },
      },
    });

    await prisma.product.deleteMany({
      where: { categoryId: id }, 
    });

    const deleteCategory = await prisma.storecategory.delete({
      where: { id },
    });

    console.log("Deleted Category =", deleteCategory);
    return NextResponse.json({ message: "Category deleted successfully", deleteCategory }, { status: 200 });

  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "Error deleting category", error: error.message }, { status: 500 });
  }
}