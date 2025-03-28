

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const router = useRouter();

    const fetchToken = async () => {
        try {
            const res = await fetch("/api/auth/token", { credentials: "include" });
            const data = await res.json();
            if (data.token) {
                setToken(data.token);
                return data.token;
            }
        } catch (error) {
            console.error("Error fetching token:", error);
        }
        return null;
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = await fetchToken(); 

            if (!token) {
                router.push("/sign-in");
                return;
            }

            try {
                const decoded = jwt.decode(token); 
                if (!decoded || decoded.role !== "admin") {
                    router.push("/admin");
                    return;
                }
            } catch (error) {
                router.push("/sign-in");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

    return (
        <div className="flex h-screen">
            <AdminSidebar />

            <div className="flex-1 bg-gray-100 p-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="mt-4 text-gray-700">Welcome to the admin panel!</p>
            </div>
        </div>
    );
}
