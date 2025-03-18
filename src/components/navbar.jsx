
// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { AirVent, Trophy } from "lucide-react";
// import { buttonVariants } from "./ui/button";

// export default function Navbar() {
//   const router = useRouter();
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");

//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         setRole(user.role); 
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         setRole(null);
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user"); 
//     document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//     setRole(null);
//     router.push("/sign-in");
//   };

//   return (
//     <div className="border-b shadow-md px-6 bg-white">
//       <div className="flex items-center justify-between mx-auto max-w-5xl h-16">

//         <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
//           <AirVent className="h-6 w-6" />
//           <span className="text-lg font-semibold">Jeopardy-Game</span>
//           <Trophy className="h-6 w-6" />
//         </Link>

//         {role === "USER" && (
//             <>
//               <Link href="/users/game" className="hover:text-blue-600 transition">
//                 Play Quiz
//               </Link>
//               <Link href="/users/leaderboard" className="hover:text-blue-600 transition">
//                 Leaderboard
//               </Link>
         
//             </>
//           )}



//         <div className="flex items-center font-bold gap-5 text-gray-700">
//           <Link href="/blogs" className="hover:text-blue-600 transition">
//             Blogs
//           </Link>
//           <Link href="/contact" className="hover:text-blue-600 transition">
//                 Contact
//               </Link>

//           {role === "ADMIN" && (
//             <Link href="/admin" className="hover:text-blue-600 transition">
//               Admin
//             </Link>
//           )}

       
//           {role ? (
//             <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
//               Logout
//             </button>
//           ) : (
//             <Link href="/sign-in" className={buttonVariants()}>
//               Sign In
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext } from "react";
import { AirVent, Trophy } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { UserContext } from "@/context/UserContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  return (
    <div className="border-b shadow-md px-6 bg-white">
      <div className="flex items-center justify-between mx-auto max-w-5xl h-16">
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
          <AirVent className="h-6 w-6" />
          <span className="text-lg font-semibold">Jeopardy-Game</span>
          <Trophy className="h-6 w-6" />
        </Link>


        <div className="flex items-center font-bold gap-5 text-gray-700">
          
        {user?.role === "USER" && (
          <>
            <Link href="/users/game" className="hover:text-blue-600 transition">
              Play Quiz
            </Link>
            <Link href="/users/leaderboard" className="hover:text-blue-600 transition">
              Leaderboard
            </Link>
          </>
        )}

          <Link href="/blogs" className="hover:text-blue-600 transition">
            Blogs
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>

          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-blue-600 transition">
              Admin
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
