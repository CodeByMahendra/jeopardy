




const NextAuth = require("next-auth").default;
const CredentialsProvider = require("next-auth/providers/credentials").default;
const GoogleProvider = require("next-auth/providers/google").default;



import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and Password are required!");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email!");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid password!");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        console.log("Token:", token);
        return { id: user.id, name: user.name, email: user.email, role: user.role, token };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        let existingUser = await prisma.user.findUnique({ where: { email: user.email } });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              // image: user.image,
            },
          });


        }

        user.id = existingUser.id;
      }
      return true;
    },

    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role || "USER";

    //     token.accessToken = jwt.sign(
    //       { id: user.id, email: user.email, role: user.role },
    //       process.env.JWT_SECRET,
    //       { expiresIn: "1h" }
    //     );
    //   }
    //   return token;
    // },


    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER"; 
    
        token.accessToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
      }
      return token;
    },
    



    // async session({ session, token }) {
    //   if (token) {
    //     const dbUser = await prisma.user.findUnique({
    //       where: { id: token.id },
    //       select: { id: true, name: true, email: true, role: true, membership: true }, 
    //     });
    
    //     if (dbUser) {
    //       session.user.id = dbUser.id;
    //       session.user.role = dbUser.role;
    //       session.user.membership = dbUser.membership || "NONE"; 
    //       session.accessToken = token.accessToken;
    //     }
    //   }
    //   return session;
    // }
    

    async session({ session, token }) {
      if (token) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { id: true, name: true, email: true, role: true, membership: true },
        });
    
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role || "USER"; // Ensure role is passed
          session.user.membership = dbUser.membership || "NONE"; 
          session.accessToken = token.accessToken;
        }
      }
      return session;
    }
    


  },



  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };













// const NextAuth = require("next-auth").default;
// const CredentialsProvider = require("next-auth/providers/credentials").default;
// const GoogleProvider = require("next-auth/providers/google").default;

// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials.email || !credentials.password) {
//           throw new Error("Email and Password are required!");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           throw new Error("No user found with this email!");
//         }

//         const passwordMatch = await bcrypt.compare(credentials.password, user.password);
//         if (!passwordMatch) {
//           throw new Error("Invalid password!");
//         }

//         const token = jwt.sign(
//           { id: user.id, email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );

//         console.log("✅ Token Generated:", token);
//         return { id: user.id, name: user.name, email: user.email, role: user.role, token };
//       },
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],

//   pages: {
//     signIn: "/sign-in",
//   },

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account.provider === "google") {
//         let existingUser = await prisma.user.findUnique({ where: { email: user.email } });

//         if (!existingUser) {
//           existingUser = await prisma.user.create({
//             data: {
//               name: user.name,
//               email: user.email,
//               // image: user.image,
//             },
//           });
//         }

//         user.id = existingUser.id;
//       }
//       return true;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role || "USER";

//         token.accessToken = jwt.sign(
//           { id: user.id, email: user.email, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token) {
//         const dbUser = await prisma.user.findUnique({
//           where: { id: token.id },
//           select: { id: true, name: true, email: true, role: true, membership: true },
//         });

//         if (dbUser) {
//           session.user.id = dbUser.id;
//           session.user.role = dbUser.role;
//           session.user.membership = dbUser.membership || "NONE";
//           session.accessToken = token.accessToken;
//         }
//       }
//       console.log("✅ Session Data:", session);
//       return session;
//     },

//     // 🔹 Fix: Redirect user to '/users/game' after successful login
//     async redirect({ url, baseUrl }) {
//       console.log("🔄 Redirecting:", url, baseUrl);
//       return "/game"; // Always redirect after login
//     },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
