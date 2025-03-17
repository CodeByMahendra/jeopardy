"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(searchParams.get("token") || "");
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/reset-password", { password, token });
      toast.success("Password reset successful!");
      router.push("/sign-in");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error resetting password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required className="w-full p-2 mb-3 border rounded" />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Reset Password</button>
      </form>
    </div>
  );
}
