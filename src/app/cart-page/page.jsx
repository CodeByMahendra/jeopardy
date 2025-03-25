"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   async function fetchCartAndUser() {
  //     const storedUser = localStorage.getItem("user");
  //     const user = storedUser ? JSON.parse(storedUser) : null;
  //     const userId = user?.id;

  //     if (!userId) return;

  //     try {
  //       const [cartRes, userRes] = await Promise.all([
  //         axios.get(`/api/cart?userId=${userId}`),
  //         axios.get(`/api/user?userId=${userId}`),
  //       ]);

  //       setCartItems(cartRes.data);

  //       const totalPrice = cartRes.data.reduce(
  //         (acc, item) => acc + item.product.price * item.quantity,
  //         0
  //       );
  //       setTotal(totalPrice);
  //       setUserScore(userRes.data.score);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }

  //   fetchCartAndUser();
  // }, []);


  useEffect(() => {
    async function fetchCartAndUser() {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.id;
  
      if (!userId) return;
  
      try {
        const [cartRes, userRes] = await Promise.all([
          axios.get(`/api/cart?userId=${userId}`),
          axios.get(`/api/user?userId=${userId}`),
        ]);
  
        setCartItems(cartRes.data);
  
        const totalPrice = cartRes.data.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        setTotal(totalPrice);
        setUserScore(userRes.data.score); // ✅ Fetching score from database
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    fetchCartAndUser();
  }, []);

  

  async function removeFromCart(productId) {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

    if (!userId) return;

    try {
       await axios.delete("/api/cart", { data: { userId, productId } });

      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      setTotal((prev) => prev - cartItems.find((item) => item.product.id === productId).product.price);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  }

 async function buyWithScore() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  if (!userId) return;

  if (userScore < total) {
    alert("Not enough score to complete the purchase.");
    return;
  }

  setLoading(true);
  try {
    const orderData = await axios.post("/api/checkout", { userId });

    console.log(orderData.data);

    setCartItems([]);
    setTotal(0);

    // ✅ Fetch updated score from API instead of manually decreasing
    const userRes = await axios.get(`/api/user?userId=${userId}`);
    setUserScore(userRes.data.score);

    alert("Order placed successfully using your score!");
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order.");
  }
  setLoading(false);
}


  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">🛒 My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-white shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                    <p className="text-gray-500">₹{item.product.price} x {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          <div className="text-right mt-6">
            <h2 className="text-2xl font-bold">Total: ₹{total}</h2>
            <h3 className="text-lg text-gray-600">Your Score: {userScore}</h3>

            <button
              onClick={buyWithScore}
              disabled={loading || userScore < total}
              className={`mt-4 px-5 py-2 text-white font-bold rounded-lg ${
                userScore < total ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : "Buy with Score 🛍️"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}


