


"use client";

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AirVent, Trophy } from "lucide-react";
import { buttonVariants } from "./ui/button";

export default function Navbar() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(null)
  // const [users, setUsers] = useState(null)
  const router = useRouter();




  // useEffect(()=>{
  //   const storedUser = localStorage.getItem('user')
  //   if(storedUser){
  //     setUsers(JSON.parse(storedUser))
  //   }
  // },[])


  // useEffect(()=>{
  //   const token = localStorage.getItem("token");
  //   if(token){
  //   const userData = JSON.parse(atob(token.split(".")[1]));
  //   setUser(userData)
  //   }
  // },[])





  // useEffect(() => {
  //   // Function to check authentication status
  //   const checkAuthStatus = () => {
  //     const token = localStorage.getItem("token");
  //     setIsAuthenticated(!!token);
  //   };

  //   checkAuthStatus(); 

  //   // Listen for changes in localStorage (for login/logout)
  //   window.addEventListener("storage", checkAuthStatus);

  //   return () => {
  //     window.removeEventListener("storage", checkAuthStatus);
  //   };
  // }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("score");
  //   localStorage.removeItem("attemptedQuestions");
  //   setIsAuthenticated(false);
  //   router.push("/sign-in");

  //   // Manually trigger localStorage event
  //   window.dispatchEvent(new Event("storage"));
  // };

  return (
    <div className="border-b shadow-md px-6 bg-white">
      <div className="flex items-center justify-between mx-auto max-w-5xl h-16">
        {/* Logo Section */}
        {/* {user && user.role === 'admin' && <Link href="/admin" className="hover:text-blue-600 transition">Admin Panel</Link>} */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
          <AirVent className="h-6 w-6" />
          <span className="text-lg font-semibold">Jeopardy-Game</span>
          <Trophy className="h-6 w-6" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center font-bold gap-5 text-gray-700">
          <Link href="/users/game" className="hover:text-blue-600 transition">Play Quiz</Link>
          <Link href="/users/leaderboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/blogs" className="hover:text-blue-600 transition">Blog</Link>

          <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
          

          {/* Conditionally Show Sign In or Logout */}
          {/* {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          ) : ( */}
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          {/* )}  */}
        </div>
      </div>
    </div>
  );
}
