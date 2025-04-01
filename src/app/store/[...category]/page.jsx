

"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function StorePage({ params }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const resolvedParams = use(params); 
  const category = resolvedParams?.category?.[0] || "general";

  useEffect(() => {
    async function fetchProducts() {
      if (status !== "authenticated") return;

      const userId = session?.user?.id;
      if (!userId) return;

      try {
        setLoading(true);

        const res = await axios.post(`/api/store/${category}`, { userId });
        if (Array.isArray(res.data)) setProducts(res.data);

        const cartRes = await axios.get(`/api/cart?userId=${userId}`);
        setCartItems(cartRes.data?.items || []);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    }

    if (session && status === "authenticated") fetchProducts();
  }, [category, session, status]);

 

  const addToCart = async (product) => {
    if (status !== "authenticated") {
      alert("Login required!");
      return;
    }
  
    try {
      await axios.post("/api/cart", {
        userId: session?.user?.id,
        productId: product.id,
        quantity: 1,
        price: product.price,
      });
  
      alert("Added to cart!");
  
      // ✅ Cart count update karein
      setCartCount(prevCount => prevCount + 1);
  
      // ✅ Cart items ko turant update karein taaki Remove button dikh sake
      setCartItems(prevItems => [...prevItems, { productId: product.id }]);
  
      // ✅ Navbar ko update karne ke liye event fire karein
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  };
  
  
  // const removeFromCart = async (product) => {
  //   if (status !== "authenticated") return alert("Login required!");

  //   try {
  //     await axios.delete(`/api/cart/remove-cart?userId=${session?.user?.id}&productId=${product.id}`);
  //     alert("Removed from cart!");
  //     setCartItems(cartItems.filter((item) => item.productId !== product.id));
  //   } catch (error) {
  //     console.error("Error removing from cart:", error.response?.data || error.message);
  //   }
  // };


  const removeFromCart = async (product) => {
    if (status !== "authenticated") return alert("Login required!");
  
    try {
      await axios.delete(`/api/cart/remove-cart?userId=${session?.user?.id}&productId=${product.id}`);
      alert("Removed from cart!");
  
      //  Cart count update karenga
      setCartCount(prevCount => Math.max(0, prevCount - 1));
  
      //  Cart items ko update karein taaki Add button dikh sake
      setCartItems(prevItems => prevItems.filter(item => item.productId !== product.id));
  
      //  Navbar ko update karne ke liye event fire karega
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data || error.message);
    }
  };
  
  
  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Continue shopping deals
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const inCart = cartItems.some((item) => item.productId === product.id);

            return (
              <div key={product.id} className="border p-4 rounded-lg shadow-lg bg-white hover:shadow-2xl transition">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
                <p className="text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mt-4">
                  {session?.user?.membership !== "NONE" && (
                    <p className="text-lg font-bold text-gray-500 line-through">${product.basePrice}</p>
                  )}
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                </div>

                {inCart ? (
                  <button onClick={() => removeFromCart(product)} className="bg-red-500 text-white px-3 py-1 mt-2 rounded">
                    Remove from Cart
                  </button>
                ) : (
                  <button onClick={() => addToCart(product)} className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
