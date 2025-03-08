import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        // Get userId from query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId"); // Correct way to fetch user ID

        console.log("UserId =", userId);

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch user from DB
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                score: true,
                attemptedQuestions: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            score: user.score, 
            attemptedQuestions: user.attemptedQuestions || {} 
        });

    } catch (error) {
        console.error("Error fetching score:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
