import { PrismaClient } from '@prisma/client';
import { IdCard } from 'lucide-react';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    
    console.log("Received data =", id);

    if (!id) {
      return NextResponse.json({ message: "Category ID is required" }, { status: 400 });
    }

    await prisma.blog.deleteMany({
      where: { categoryId: id }, 
    });

    const deleteCategory = await prisma.category.delete({
      where: { id },
    });

    console.log("Deleted Category =", deleteCategory);
    return NextResponse.json({ message: "Category deleted successfully", deleteCategory }, { status: 200 });

  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "Error deleting category", error: error.message }, { status: 500 });
  }
}