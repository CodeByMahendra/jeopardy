import { supabase } from "@/lib/supabaseClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { user, session, error } = await supabase.auth.getUser();

  if (error) return res.status(400).json({ error: error.message });

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existingUser) {
  const userData =  await prisma.user.create({
      data: {
        email: user.email,
        name: user.user_metadata.full_name ,
      },
    });
    console.log("User Data =",userData)
  }

  res.status(200).json({ user, session });
}
