
// import React from "react";
// import "./globals.css";
// import { ToastContainer } from "react-toastify";
//  import "react-toastify/dist/ReactToastify.css";
// import Navbar from "@/components/navbar";
// import { UserProvider } from "@/context/UserContext";


// const RootLayout = ({ children }) => {
//   return (
//     <html lang="en">
//       <body suppressHydrationWarning>
//          <UserProvider>          <Navbar/>

//          {children}</UserProvider>

//           <ToastContainer position="top-right" autoClose={3000} />

        
//       </body>
//     </html>
//   );
// };

// export default RootLayout;


"use client";

import React from "react";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/navbar";
import UserProvider from "@/context/UserContext"; // ✅ Corrected import

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Navbar />
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
