


// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// import { formSchema } from "@/lib/auth-schema";
// const SECRET_KEY = "moijhfdftyujbvy"; 

// export async function POST(req) {
//     try {
//         const body = await req.json();

//         console.log("body=",body)
        
//         const parsedBody = formSchema.safeParse(body);

//         console.log("Parshed=",parsedBody)
//         if (!parsedBody.success) {
//             return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
//         }

//         const { name,  email, password, role, secretCode } = body;

//         const existingUser = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (existingUser) {
//             return NextResponse.json({ error: "User already exists" }, { status: 400 });
//         }

//         let assignedRole = "USER"; 
//         if (role === "ADMIN") {
//             if (secretCode === process.env.ADMIN_SECRET) {
//                 assignedRole = "ADMIN"; 
//             } else {
//                 return NextResponse.json({ error: "Invalid secret code for admin role" }, { status: 403 });
//             }
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
//             const token = jwt.sign(
//                        { id: existingUser.id, email: existingUser.email, role: existingUser.role },
//                        SECRET_KEY,
//                        { expiresIn: "1h" }
//                    );
//         // Create new user in database
//         const newUser = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//                 password: hashedPassword,
//                 role: assignedRole,  
//                 token,
//             },
//         });


//         console.log("NewUser=",newUser)
//         return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });

//     } catch (error) {
//         console.error("Error in signup API:", error);
//         return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//     }
// }



import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

import { formSchema } from "@/lib/auth-schema";
const SECRET_KEY = "moijhfdftyujbvy"; 

export async function POST(req) {
    try {
        const body = await req.json();

        console.log("body=", body);
        
        const parsedBody = formSchema.safeParse(body);

        console.log("Parsed=", parsedBody);
        if (!parsedBody.success) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        const { name, email, password, role, secretCode } = body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        let assignedRole = "USER"; 
        if (role === "ADMIN") {
            if (secretCode === process.env.ADMIN_SECRET) {
                assignedRole = "ADMIN"; 
            } else {
                return NextResponse.json({ error: "Invalid secret code for admin role" }, { status: 403 });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: assignedRole,  
            },
        });

        // Generate JWT token **after** user is created
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        console.log("NewUser=", newUser);
        return NextResponse.json({ message: "User registered successfully", user: newUser, token }, { status: 201 });

    } catch (error) {
        console.error("Error in signup API:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
