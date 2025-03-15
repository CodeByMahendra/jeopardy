import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY; 

export async function POST(req) {
  try {
    const { password, token } = await req.json();

    const decoded = jwt.verify(token, SECRET_KEY);
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
