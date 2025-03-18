



import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";  
import jwt from "jsonwebtoken";

import { formSchema } from "@/lib/auth-schema";
const SECRET_KEY = "moijhfdftyujbvy"; 

export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Received Body:", body);
  
      const parsedBody = formSchema.safeParse(body);
      if (!parsedBody.success) {
        console.error("Validation Error:", parsedBody.error);
        return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
      }
  
      const { name, email, password, role, secretCode } = body;
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }
  
      let assignedRole = "USER";
      if (role === "ADMIN") {
        if (!process.env.ADMIN_SECRET) {
          console.error("ADMIN_SECRET not set in environment variables");
          return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }
  
        if (secretCode === process.env.ADMIN_SECRET) {
          assignedRole = "ADMIN";
        } else {
          return NextResponse.json({ error: "Invalid secret code for admin role" }, { status: 403 });
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: assignedRole },
      });
  
      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, SECRET_KEY, {
        expiresIn: "1h",
      });
  
      console.log("New User Created:", newUser);
  
      const response = NextResponse.json({ message: "User registered successfully", user: newUser, token }, { status: 201 });
      
      response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Secure; Path=/; Max-Age=3600`);
      
      return response;
    } catch (error) {
      console.error("Signup API Error:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
  