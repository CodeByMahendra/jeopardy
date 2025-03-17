

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { signInFormSchema } from "@/lib/auth-schema";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "moijhfdftyujbvy";

export async function POST(req) {
    try {
        const body = await req.json();

        const validation = signInFormSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const { email, password } = body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // if (user.role === "ADMIN" && secretCode !== "banna@2025") {
        //     return NextResponse.json({ error: "Incorrect admin code!" }, { status: 401 });
        // }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        console.log("User logged in successfully:", { id: user.id, email: user.email, role: user.role });

        const response = NextResponse.json({ message: "Login successful!", user });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600, // 1 hour
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


