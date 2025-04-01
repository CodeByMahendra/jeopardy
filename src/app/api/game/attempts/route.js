
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { questionId, selectedOption } = body;

        console.log("Question ID:", questionId);
        console.log("Selected Option:", selectedOption);
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token:", token);
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
        }

        const userId = decoded.id;

        const existingAttempt = await prisma.attempt.findFirst({
            where: { userId, questionId },
        });

        if (existingAttempt) {
            return NextResponse.json({ error: "You have already attempted this question." }, { status: 400 });
        }

        // Get the correct answer
        const question = await prisma.question.findUnique({ where: { id: questionId } });
        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        const isCorrect = question.answer.trim().toLowerCase() === selectedOption.trim().toLowerCase();

        // Record the attempt in the database
        await prisma.attempt.create({
            data: {
                userId,
                questionId,
                isCorrect,
            },
        });

        // Update user score if correct
        if (isCorrect) {
            await prisma.user.update({
                where: { id: userId },
                data: { score: { increment: question.points } },
            });
        }

        return NextResponse.json({ message: "Attempt recorded", isCorrect }, { status: 200 });
    } catch (error) {
        console.error("Attempt API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
