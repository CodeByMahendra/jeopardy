

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req) {
    try {
        const { userId, membership } = await req.json();
console.log(userId,membership)
        if (!userId || !membership) {
            return NextResponse.json({ message: "User ID and new membership are required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { membership: membership }
        });

        return NextResponse.json({ message: "Membership updated successfully", user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("Error updating membership:", error);
        return NextResponse.json({ message: "Error updating membership" }, { status: 500 });
    }
}
