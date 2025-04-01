// import { NextResponse } from "next/server";
// import {prisma} from '@/lib/prisma';



// export async function GET(req) {
//     try {
//            const { searchParams } = new URL(req.url);
//             const userId = searchParams.get("userId");
        
//             if (!userId) {
//               return NextResponse.json({ error: "User ID required" }, { status: 400 });
//             }
        
//             const user = await prisma.user.findUnique({ where: { id: userId } });


//                   return NextResponse.json({ error: "User  found",user }, { status: 200 });
            
        

//     } catch (error) {

//         console.error("Error fetching cart:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        
//     }
    
// }


import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
