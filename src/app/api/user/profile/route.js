import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const { userId } = params;

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                orders: {
                    select: {
                        id: true,
                        total: true,
                        status: true,
                        createdAt: true
                    }
                },
                addresses: true // 👈 include addresses

            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ message: "Error retrieving user profile" }, { status: 500 });
    }
}
