import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY; 

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
    }
    const { email } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "25m" });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false, 
      tls: {
        rejectUnauthorized: false, 
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    return new Response(JSON.stringify({ message: "Reset link sent!" }), { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
