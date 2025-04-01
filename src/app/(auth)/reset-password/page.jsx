
// "use client";
// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { toast } from "react-toastify";

// function ResetPasswordForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams(); 
//   const [password, setPassword] = useState("");
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     const urlToken = searchParams.get("token"); 
//     if (!urlToken) {
//       toast.error("Invalid or missing token!");
//       router.push("/forgot-password"); 
//     } else {
//       setToken(urlToken);
//     }
//   }, [searchParams, router]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token) {
//       toast.error("Invalid or expired reset link!");
//       return;
//     }

//     try {
//       await axios.post("/api/auth/reset-password", { password, token });
//       toast.success("Password reset successful!");
//       router.push("/sign-in");
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Error resetting password!");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="New Password"
//           required
//           className="w-full p-2 mb-3 border rounded"
//         />
//         <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ResetPasswordForm;



import ResetPasswordForm from "@/components/ResetPasswordForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
<ResetPasswordForm/>
    </Suspense>
  );
}
