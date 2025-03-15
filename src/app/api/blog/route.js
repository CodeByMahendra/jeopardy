
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json(); 
    const { title, content, image, categoryId } = body;

    if (!title || !content || !image || !categoryId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newBlog = await prisma.blog.create({
      data: { title, content, image, categoryId: Number(categoryId) }, 
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function GET(req, context) {
  try {
    const { category } = await context.params; 
    const categoryName = category[0]; 

    if (!categoryName) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const allBlogs = await prisma.blog.findMany({
      where: {
        category: {
          name: categoryName,
        },
      },
    });

    return NextResponse.json(allBlogs);
  } catch (error) {
    console.error('Error getting blog:', error);
    return NextResponse.json({ error: 'Failed to get blog' }, { status: 500 });
  }
}