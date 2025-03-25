"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function StorePage({ params }) {
  const [products, setProducts] = useState([]);
  
  const category = params?.category?.[0] || "general";

  useEffect(() => {
    async function fetchProducts() {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.id;
      
      try {
        const res = await axios.post(`/api/store/${category}`, { userId });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [category]);

  async function addToCart(productId) {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;
    
    if (!userId) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await axios.post("/api/cart", { userId, productId, quantity: 1 });
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8"> Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-lg bg-white hover:shadow-2xl transition">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
            <p className="text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-bold text-green-600">₹{product.price}</p>
              <button
                onClick={() => addToCart(product.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



