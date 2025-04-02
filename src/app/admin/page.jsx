

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useSession } from "next-auth/react";

import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {

      const { data: session, status } = useSession();
    
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {

        const checkAuth = async () => {

            if (status === "loading") return;
       
      
            const token = session.accessToken;

            console.log("token", token);


                     

            if (!token) {
                router.push("/sign-in");
                return;
            }

            // try {
            //     const decoded = jwt.decode(token); 
            //     if (!decoded || decoded.role !== "admin") {
            //         router.push("/admin");
            //         return;
            //     }
            // } catch (error) {
            //     router.push("/sign-in");
            // } 
            
            
            try {
                const decoded = jwt.decode(token);
                console.log("Decoded Token:", decoded); // Debugging
                
                if (!decoded || decoded.role === "admin") {
                    router.push("/admin");
                    return;
                }
            } catch (error) {
                console.error("JWT Decode Error:", error);
                router.push("/sign-in");
            }

            
            finally {
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
