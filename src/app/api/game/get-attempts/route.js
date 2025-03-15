import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
        }

        const userId = decoded.id;

        const attempts = await prisma.attempt.findMany({
            where: { userId },
            select: { questionId: true, isCorrect: true },
        });

        return NextResponse.json({ attempts }, { status: 200 });
    } catch (error) {
        console.error("Fetch attempts API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
