

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req) {
  try {
    const { id } = await req.json(); 
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = String(id); 

    await prisma.attempt.deleteMany({
      where: { userId },
    });

    await prisma.account.deleteMany({
      where: { userId },
    });

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    console.log("Deleted user=",deletedUser)

    return NextResponse.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

