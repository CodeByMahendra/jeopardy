


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import DigitalOrders from "@/components/DigitalOrders";

export default function ProfilePage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return; 

        if (status === "unauthenticated") {
            console.error("user not authenticated");
            setLoading(false);
            return;
        }

        const userId = session?.user?.id;
        if (!userId) {
            console.error("User Id not found");
            setLoading(false);
            return;
        }

        async function fetchOrders() {
            try {
                const res = await axios.get(`/api/user?userId=${userId}`);
                if (res.status !== 200) throw new Error("Failed to fetch orders");
                setOrders(res.data);
            } catch (error) {
                console.error("failed to get data", error);
            }
            setLoading(false);
        }


      
        


        fetchOrders();
    }, [status, session]);

    if (loading) return <p>Loading...</p>;
    if (orders.length === 0) return <p>No orders</p>;

    return (
        // <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-300 to-purple-600 p-6">
                        <h3 className="text-xl font-semibold mt-10">Order History</h3>

            <DigitalOrders/>
            <h3 className="text-xl font-semibold mt-10">Order History</h3>

            <ul className="mt-4">
                {orders.map((order) => (
                    <li key={order.id} className="border p-3 rounded-md mt-2">
                        <p>Order ID: {order.id}</p>
                        <p>Total Price: <span className="font-bold">${order.total}</span></p>
                        <p>Status: <span className="font-bold">{order.status}</span></p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <h4 className="font-semibold mt-2">Items:</h4>
                        <ul className="list-disc list-inside">
    {order.items?.map((item) => (
        <li key={item.id}>
            {item.product?.name || "Unknown Product"} - Quantity: {item.quantity}, Price: ${item.price}
        </li>
    ))}
</ul>

                    </li>
                ))}
            </ul>
        </div>
    );
}
