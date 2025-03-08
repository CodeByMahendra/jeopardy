

// import { authHandler } from "better-auth"; // Replace with correct function
// import { PrismaClient } from "@prisma/client";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export const auth = authHandler({
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         {
//             id: "credentials",
//             name: "Credentials",
//             type: "credentials",
//             authorize: async (credentials) => {
//                 const user = await prisma.user.findUnique({
//                     where: { email: credentials.email },
//                 });

//                 if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
//                     throw new Error("Invalid email or password");
//                 }

//                 return user;
//             },
//         },
//     ],
//     basePath: "/api/auth",
// });
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";  
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const authOptions = {
//   adapter: PrismaAdapter(prisma), 
//   secret: process.env.NEXTAUTH_SECRET, 
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       session.user.id = user.id;
//       return session;
//     },
//   },
// };

// // ✅ Export auth instance
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) session.user.id = user.id;
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: user.name,
                email: user.email,
                image: user.image,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Sign-in error:", error);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt", // Using JWT-based sessions for scalability
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
