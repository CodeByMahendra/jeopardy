


// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";

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
//       if (user) session.user.id = user.id;
//       return session;
//     },
//     async signIn({ user, account }) {
//       if (account.provider === "google") {
//         try {
//           const existingUser = await prisma.user.findUnique({
//             where: { email: user.email },
//           });
//           if (!existingUser) {
//             await prisma.user.create({
//               data: {
//                 name: user.name,
//                 email: user.email,
//                 image: user.image,
//               },
//             });
//           }
//           return true;
//         } catch (error) {
//           console.error("Sign-in error:", error);
//           return false;
//         }
//       }
//       return true;
//     },
//   },
//   session: {
//     strategy: "jwt", 
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

const GoogleProvider = require ("next-auth/providers/google").default;
const NextAuth = require("next-auth").default;
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

// ✅ App Router ke liye named exports
export const GET = async (req) => {
  return NextAuth(authOptions)(req);
};

export const POST = async (req) => {
  return NextAuth(authOptions)(req);
};
