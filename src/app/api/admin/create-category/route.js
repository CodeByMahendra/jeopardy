import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Failed to create category' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), { status: 500 });
    console.log(error)
  }
}
