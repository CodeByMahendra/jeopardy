
"use client";

import React from "react";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/navbar";
import UserProvider from "@/context/UserContext"; 
import { SessionProvider } from "next-auth/react";


const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
      <SessionProvider>
  <UserProvider>
    <Navbar />
    {children}
    <ToastContainer position="top-right" autoClose={3000} />
  </UserProvider>
</SessionProvider>

       
      </body>
    </html>
  );
};

export default RootLayout;
