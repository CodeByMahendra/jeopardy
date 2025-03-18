import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();
const SECRET_KEY = "moijhfdftyujbvy"

export async function GET(req) {
    try {
        console.log("🔵 API /api/user called"); 

        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            console.error(" Authorization header missing");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        console.log(" Token received:", token);

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(" Decoded Token:", decoded);

        const userId = decoded.id;
        console.log(" Fetching user from DB, userId:", userId);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, score: true }, 
        });

        if (!user) {
            console.error(" User not found in DB");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("✅ User found:", user);
        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error("Error in /api/user:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
