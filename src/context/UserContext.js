

// "use client";
// import { createContext, useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";

// export const UserContext = createContext(null);

// export default function UserProvider({ children }) {
//   const { data: session } = useSession();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (session?.user) {
//       setUser(session.user);
//     } else {
//       setUser(null);
//     }
//   }, [session]);

//   const logout = async () => {
//     await signOut(); 
//     setUser(null);
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// }


"use client";
import { createContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const { data: session } = useSession();
  const router = useRouter(); // ✅ Initialize router
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const logout = async () => {
    await signOut({ redirect: false }); // ✅ Prevent NextAuth auto-redirect
    setUser(null);
    router.push("/sign-in"); // ✅ Redirect to Sign-in page after logout
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
