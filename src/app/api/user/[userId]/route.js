// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";


// export async function GET(req, { params }) {
//     try {
//         console.log("API Called: Fetching user profile");  
//         const { userId } = params;

//         if (!userId) {
//             return NextResponse.json({ message: "User ID is required" }, { status: 400 });
//         }

//         const user = await prisma.user.findUnique({
//             where: { id: userId },
//             include: {
//                 orders: {
//                     select: {
//                         id: true,
//                         total: true,
//                         status: true,
//                         createdAt: true,
//                         items: {
//                             select: {
//                                 id: true,
//                                 quantity: true,
//                                 price: true,
//                                 product: {
//                                     select: {
//                                         name: true
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 },
//       addresses: true // Include addresses
//             }
//         });


//         if (!user) {
//             return NextResponse.json({ message: "User not found" }, { status: 404 });
//         }

  
        

//         return NextResponse.json({ user }, { status: 200 });

//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        console.log("API Called: Fetching user profile");  
        const { userId } = params;

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

 
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                addresses: true, // 👈 yeh line add karo
                orders: {
                    select: {
                        id: true,
                        total: true,
                        status: true,
                        createdAt: true,
                        items: {
                            select: {
                                id: true,
                                quantity: true,
                                price: true,
                                product: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
          

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
