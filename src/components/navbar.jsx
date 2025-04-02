
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AirVent, Trophy } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import { UserCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
 
  useEffect(() => {
    if (!user?.id) return; 
  
    const fetchCartCount = async () => {
      try {
        const { data } = await axios.get(`/api/cart/cart-count`, {
          params: { userId: user.id },
        });
        setCartCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };
  
    fetchCartCount();
  
    const updateCartCount = () => fetchCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
  
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [user]); // Only trigger when user updates
  
  

  const handleLogout = () => {
    logout();
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
              <Link href="/game" className="hover:text-blue-600 transition">Play Quiz</Link>
              <Link href="/leaderboard" className="hover:text-blue-600 transition">Leaderboard</Link>
              <Link href="/store" className="hover:text-blue-600 transition">Store</Link>
            </>
          )}

          <Link href="/blogs" className="hover:text-blue-600 transition">Blogs</Link>
          <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>

          {user?.role === "ADMIN" && (
<>


<Link href="/game" className="hover:text-blue-600 transition">Play Quiz</Link>

<Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>

</>
                         
            
           
          )}

          {user?.role === "USER" && (
            <Link href="/cart/cart-page" className="relative">
              <ShoppingCartIcon className="w-8 h-8 text-gray-600 hover:text-blue-500 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hover:text-blue-600 transition focus:outline-none"
              >
                <UserCircleIcon className="w-10 h-10 text-gray-500" />
              </button>

              {showDropdown && (


                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  {user.role === "USER" && (
                    <Link href="/order/my-order" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                      My Orders
                    </Link>
                  )}
                  {user.role === "USER" && (

                     <Link href="/my-wishlist" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                    My wishlist
                     </Link>
                  )}
                  <Link href="/user-profile" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                    My Profile
                  </Link>

                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}






          {!user && (
            <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
