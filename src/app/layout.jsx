
import React from "react";
import "./globals.css";
import { ToastContainer } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/navbar";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Navbar/>
          {children}

          <ToastContainer position="top-right" autoClose={3000} />

        
      </body>
    </html>
  );
};

export default RootLayout;


// "use client";

// import Navbar from "@/components/navbar";
// import "./globals.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Provider } from "react-redux";
// import { store } from "@/app/redux/store";
// import { SessionProvider } from "next-auth/react"; // Import SessionProvider

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         {/* Wrap the entire application with SessionProvider */}
//         <SessionProvider>
//           <Navbar />
//           <Provider store={store}>{children}</Provider>
//           <ToastContainer position="top-right" autoClose={3000} />
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }