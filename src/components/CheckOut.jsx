



"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Checkout({ totalPrice }) {
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  // const handleCheckout = async () => {
  //   const userId = session?.user?.id;
  //   try {
  //     const { data } = await axios.post("/api/order/checkout", {
  //       userId,
  //       totalAmount: totalPrice,
  //     });

  //     setMessage(`Order Placed! Remaining Score: ${data.newScore}`);
  //   } catch (error) {
  //     setMessage(error.response?.data?.error || "Failed to place order.");
  //     console.error("Checkout error:", error);
  //   }
  // };


  const handleCheckout = async () => {
    const userId = session?.user?.id;
    try {
      const { data } = await axios.post("/api/order/checkout", {
        userId,
        totalAmount: totalPrice,
      });
  
      setMessage(`Order Placed! Remaining Score: ${data.newScore}`);
  
      window.dispatchEvent(new Event("cartUpdated"));
  
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to place order.");
      console.error("Checkout error:", error);
    }
  };

  
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p>Total Amount: ₹{totalPrice}</p>
      <button className="bg-green-500 px-4 py-2 text-white mt-3" onClick={handleCheckout}>
        Pay with Score
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

