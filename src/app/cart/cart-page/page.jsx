

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Checkout from "@/components/CheckOut";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);  
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [status, session]);

  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      setLoading(true);  
      try {
        const response = await axios.get(`/api/cart?userId=${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  if (status !== "authenticated" || !userId) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <p className="text-center text-gray-600">Loading Cart...</p>;
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put("/api/cart", { cartItemId, quantity });
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        ),
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };



  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete("/api/cart", { data: { cartItemId } });
  
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== cartItemId),
      }));
  
      //  Cart Count ko Decrease Karenga
      setCartCount((prevCount) => Math.max(prevCount - 1, 0));
  
      //  Notify Navbar
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  
  const totalPrice = cart?.items?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (

    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>
      {cart?.items?.length ? (
        <>
          {cart.items.map((item) => (
            <div key={item.id} className="border p-4 rounded mb-2 flex justify-between">
              <div>
                <h2 className="text-lg">{item.product.name}</h2>
                <p>Price: ${item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 bg-gray-300 rounded"
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 bg-gray-300 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3 py-1 bg-red-500 text-white ml-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h2 className="text-lg font-bold mt-4">Total Price: ${totalPrice}</h2>
          <Checkout totalPrice={totalPrice} />
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}


