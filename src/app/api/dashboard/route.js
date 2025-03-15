import { NextResponse } from "next/server";
import { prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching questions", error }, { status: 500 });
  }
}

