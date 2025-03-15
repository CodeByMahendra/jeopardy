


// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
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



import GoogleProvider from "next-auth/providers/google";
import {NextAuthOptions} from "next-auth"

export const authOptions:NextAuthOptions={
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
      ]

}
