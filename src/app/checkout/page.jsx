"use client"

import { useCartStore } from "@/app/store/cartStore/page";
import { useState } from "react";

export default function Checkout() {
  const { cart, clearCart } = useCartStore();
  const [message, setMessage] = useState("");

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user?.id;
  console.log("UserId==",userId)
 
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, totalAmount }),
    });

    const data = await res.json();
    if (res.ok) {
      clearCart(); 
      setMessage(`Order Placed! Remaining Score: ${data.remainingScore}`);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p>Total Amount: ₹{totalAmount}</p>
      <button className="bg-green-500 px-4 py-2 text-white mt-3" onClick={handleCheckout}>
        Pay with Score
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
