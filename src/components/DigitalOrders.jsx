






"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const DigitalOrders = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchDigitalOrders = async () => {
      try {
        const { data } = await axios.get(`/api/digital`, {
          params: { userId: session.user.id },
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching digital orders:", error);
      } finally {
        setLoading(false);
      }
    };



    

    fetchDigitalOrders();
  }, [session]);

  const handleDownload = async (orderId) => {
    if (!session?.user?.id) return;

    setSending(orderId);

    try {
      const { data } = await axios.post(`/api/digital-orders/sendEmail`, {
        userId: session.user.id,
       orderId,
      });

      alert(data.message || "Email Sent!");
    } catch (error) {
      console.error("Error sending download email:", error);
      alert("Failed to send email");
    } finally {
      setSending(null);
    }
  };



  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">My Digital Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No digital orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold">{order?.product?.name}</h3>
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>

              <button
                onClick={() => handleDownload(order.id)}
                disabled={sending === order.id}
                className={`mt-2 px-4 py-2 rounded-md text-white ${
                  sending === order.id ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {sending === order.id ? "Sending..." : "📩 Send to Email"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DigitalOrders;
