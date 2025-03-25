"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import MembershipUpdateForm from "@/components/Membership";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUserProfile() {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                console.error("No user found in localStorage");
                setLoading(false);
                return;
            }

            const users = JSON.parse(storedUser);
            const userId = users?.id;
            console.log("UserId==", userId);

            if (!userId) {
                console.error("User ID is missing");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${window.location.origin}/api/user/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch user data");

                const data = await res.json(); // FIXED: JSON extract karna
                setUser(data.user);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <div className="flex items-center space-x-4">
                <UserCircleIcon className="w-16 h-16 text-gray-500" />
                <div>
                    <h2 className="text-2xl font-semibold">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-gray-700">Score: {user?.score}</p>
                    <p className="text-gray-700">Membership: {user?.membership || "None"}</p>
                </div>
            </div>

            <div className="mt-6">
                <MembershipUpdateForm />
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold">Order History</h3>
                {user?.orders?.length > 0 ? (
                    <ul className="mt-4">
                        {user.orders.map((order) => (
                            <li key={order.id} className="border p-3 rounded-md mt-2">
                                <p>Order ID: {order.id}</p>
                                <p>Total: <span className="font-bold">{order.total}</span></p>

                                <p>Status: <span className="font-bold">{order.status}</span></p>
                                <p>Placed On: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No orders found.</p>
                )}
            </div>
        </div>
    );
}
