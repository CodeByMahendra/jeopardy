import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching questions", error }, { status: 500 });
  }
}




export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("Received Data=", body);

    const { id, question, options, answer, points } = body;

    if (!id || !question || !options || !answer || points === undefined) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: { question, options, answer, points: Number(points) },
    });

    console.log("Updated Question:", updatedQuestion);
    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ message: "Error updating question", error }, { status: 500 });
  }
}
