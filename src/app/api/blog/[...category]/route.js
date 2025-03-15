import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const categoryName = context.params.category?.[0]?.trim(); 

    console.log("Requested Category:", categoryName);

    if (!categoryName) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const allCategories = await prisma.category.findMany();
    console.log("All Categories in DB:", allCategories);

    const categoryData = allCategories.find(cat => cat.name.trim().toLowerCase() === categoryName.toLowerCase());

    if (!categoryData) {
      return NextResponse.json({ error: `Category '${categoryName}' not found` }, { status: 404 });
    }

    const allBlogs = await prisma.blog.findMany({
      where: { categoryId: categoryData.id },
    });

    if (allBlogs.length === 0) {
      return NextResponse.json({ error: `No blogs found for category: ${categoryName}` }, { status: 404 });
    }

    return NextResponse.json(allBlogs);
  } catch (error) {
    console.error("Error getting blog:", error);
    return NextResponse.json({ error: "Failed to get blog" }, { status: 500 });
  }
}
