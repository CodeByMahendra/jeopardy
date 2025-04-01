import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET; 

export async function POST(req) {
  try {
    const { password, token } = await req.json();

    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    return Response.json({ message: "Password updated successfully" });

  } catch (error) {
    return Response.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
