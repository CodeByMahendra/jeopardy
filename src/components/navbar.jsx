


"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { AirVent } from "lucide-react";
import {
  UserCircleIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { UserContext } from "@/context/UserContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dropdownRef = useRef();
  const mobileMenuRef = useRef();

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
  }, [user]);

  // Close dropdown/mobileMenu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const handleLinkClick = () => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-2 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
          <AirVent className="h-6 w-6" />
          <span className="text-lg font-semibold">Jeopardy-Game</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden text-gray-600"
        >
          {showMobileMenu ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>

        {/* Menu Items */}
        <div
          ref={mobileMenuRef}
          className={`flex-col md:flex md:flex-row md:items-center gap-4 md:gap-6 text-gray-700 font-medium absolute md:static left-0 top-16 w-full md:w-auto bg-white md:bg-transparent z-50 p-4 md:p-0 shadow-md md:shadow-none transition-all ${
            showMobileMenu ? "flex" : "hidden"
          }`}
        >
          {user?.role === "USER" && (
            <>
              <Link href="/game" onClick={handleLinkClick} className="hover:text-blue-600 transition">Play Quiz</Link>
              <Link href="/leaderboard" onClick={handleLinkClick} className="hover:text-blue-600 transition">Leaderboard</Link>
              <Link href="/store" onClick={handleLinkClick} className="hover:text-blue-600 transition">Store</Link>
            </>
          )}

          <Link href="/blogs" onClick={handleLinkClick} className="hover:text-blue-600 transition">Blogs</Link>
          <Link href="/contact" onClick={handleLinkClick} className="hover:text-blue-600 transition">Contact</Link>

          {user?.role === "ADMIN" && (
            <>
              <Link href="/game" onClick={handleLinkClick} className="hover:text-blue-600 transition">Play Quiz</Link>
              <Link href="/admin" onClick={handleLinkClick} className="hover:text-blue-600 transition">Admin</Link>
            </>
          )}

          {/* Cart Icon */}
          {user?.role === "USER" && (
            <Link
              href="/cart/cart-page"
              onClick={handleLinkClick}
              className="relative flex items-center hover:text-blue-500 transition"
            >
              <div className="relative">
                <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          )}

          {/* User Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center hover:text-blue-600 transition focus:outline-none"
              >
                <UserCircleIcon className="w-8 h-8 text-gray-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  {user.role === "USER" && (
                    <>
                      <Link href="/order/my-order" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                        My Orders
                      </Link>
                      <Link href="/my-wishlist" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                        My Wishlist
                      </Link>
                    </>
                  )}
                  <Link href="/user-profile" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              onClick={handleLinkClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
