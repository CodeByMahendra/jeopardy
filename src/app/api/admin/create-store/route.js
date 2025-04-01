


import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//Get all products

export async function GET() {
  try {
    const allproducts = await prisma.product.findMany();
    console.log("All products:", allproducts);
    return NextResponse.json(allproducts);
  } catch (error) {
    console.error("Error getting products:", error);
    return NextResponse.json({ message: "Error getting products", error }, { status: 500 });
  }
}

//update product
export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const { id, name, image, description, categoryId, basePrice, priceOneMonth, priceOneYear, priceLifetime } = body;

    if (!id || !name || !image || !description || !categoryId || basePrice === undefined || priceOneMonth === undefined || priceOneYear === undefined || priceLifetime === undefined) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, image, description, categoryId, basePrice:Number(basePrice), priceOneMonth:Number(priceOneMonth), priceOneYear:Number(priceOneYear), priceLifetime:Number(priceLifetime) },
    });

    console.log("Updated Product:", updatedProduct);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
  }
}


//delete product
export async function DELETE(req) {
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    console.log("Deleted Product:", deletedProduct);
    return NextResponse.json({ message: "Product deleted successfully", deletedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Error deleting product", error }, { status: 500 });
  }
}



//create product

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received data=", body);

    const { name, image, description, category, basePrice, priceOneMonth, priceOneYear, priceLifetime ,type,fileUrl} = body;

    if (!name || !image || !description || !category || !basePrice || !priceOneMonth || !priceOneYear || !priceLifetime  ) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const createProduct = await prisma.product.create({
      data: {
        name,
        image,
        description,
        basePrice,
        priceOneMonth,
        priceOneYear,
        priceLifetime,
        category: {
          connect: { id: category } 
        },
        fileUrl,
        type
      }
    });

    console.log("Created Product=", createProduct);
    return NextResponse.json(createProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Error creating product", error }, { status: 500 });
  }
}