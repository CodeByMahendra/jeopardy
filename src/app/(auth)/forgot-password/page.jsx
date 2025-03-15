"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const data =   await axios.post("/api/auth/forgot-password", { email });
    console.log("Data=",data)
      toast.success("Password reset link sent to email!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending reset link!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Forgot Password?</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full p-2 mb-3 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Send Reset Link</button>
      </form>
    </div>
  );
}
