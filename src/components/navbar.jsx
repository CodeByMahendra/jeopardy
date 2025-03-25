
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext } from "react";
import { AirVent, Trophy } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import { UserCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useContext(UserContext);

  const cartCount = 3;

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
              <Link href="/store" className="hover:text-blue-600 transition">
                Store
              </Link>
            </>
          )}

          <Link href="/blogs" className="hover:text-blue-600 transition">
            Blogs
          </Link>

          <Link href="/contact" className="hover:text-blue-600 transition ">
            Contact
          </Link>

          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-blue-600 transition">
              Admin
            </Link>
          )}


{user?.role === "USER" &&(
        <>
          <Link href="/cart-page" className="relative">
            <ShoppingCartIcon className="w-8 h-8 text-gray-600 hover:text-blue-500 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/user-profile" className="hover:text-blue-600 transition">
            <UserCircleIcon className="w-10 h-10 text-gray-500" />
          </Link>
        </>

)}

          {user ? (
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          ) : (
            <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
