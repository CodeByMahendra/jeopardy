"use client"
import Navbar from "@/components/navbar"
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Provider } from "react-redux";
import { store } from "@/app/redux/store";






export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Navbar />
        <Provider store={store}>{children}</Provider>
        <ToastContainer position="top-right" autoClose={3000} />

      </body>
    </html>
  );
}
