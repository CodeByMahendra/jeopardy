import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req,context){
    try {

        const { category } = await context.params; 
        const categoryName = category[0]; 

          if (!categoryName) {
              return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
            }

        const allCategories = await prisma.order.findMany({
            where :{

                category: {
                    name: categoryName,
                  },

            }
        })
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