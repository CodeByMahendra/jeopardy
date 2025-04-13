



"use client";

import { useEffect, useState ,use} from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';

import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function StorePage({ params }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const unwrappedParams = use(params); 
  const category = unwrappedParams.category?.[0] || "general";

  useEffect(() => {

    async function fetchProducts() {
      if (status !== "authenticated") return;

      const userId = session?.user?.id;
      if (!userId) return;

      try {
        setLoading(true);

        // Fetch products based on category
        const res = await axios.post(`/api/store/${category}`, { userId });
        if (Array.isArray(res.data)) setProducts(res.data);

        // Fetch cart items
        const cartRes = await axios.get(`/api/cart?userId=${userId}`);
        setCartItems(cartRes.data?.items || []);

        // Fetch wishlist items
        const wishlistRes = await axios.get(`/api/cart/whishlist?userId=${userId}`);
        setWishlistItems(wishlistRes.data.map((item) => item.productId));
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    }

    if (session && status === "authenticated") fetchProducts();
  }, [category, session, status]);

  const toggleWishlist = async (product) => {
    const isInWishlist = wishlistItems.includes(product.id);

    try {
      if (isInWishlist) {
        await removeWishlist(product);
      } else {
        await addWishlist(product);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error.response?.data || error.message);
    }
  };

  const addWishlist = async (product) => {
    try {
      await axios.post("/api/cart/whishlist", {
        userId: session?.user?.id,
        productId: product.id,
      });
      setWishlistItems((prev) => [...prev, product.id]);
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error.message);
    }
  };

  const removeWishlist = async (product) => {
    try {
      await axios.delete("/api/cart/whishlist", {
        data: { userId: session?.user?.id, productId: product.id },
      });
      setWishlistItems((prev) => prev.filter((id) => id !== product.id));
      toast.success("Removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error.response?.data || error.message);
    }
  };

  const toggleCart = async (product) => {
    const inCart = cartItems.some((item) => item.productId === product.id);

    try {
      if (inCart) {
        await removeFromCart(product);
      } else {
        await addToCart(product);
      }
    } catch (error) {
      console.error("Error toggling cart:", error.response?.data || error.message);
    }
  };

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
      setCartItems((prevItems) => [...prevItems, { productId: product.id }]);
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  };

  const removeFromCart = async (product) => {
    if (status !== "authenticated") return alert("Login required!");

    try {
      await axios.delete(`/api/cart/remove-cart?userId=${session?.user?.id}&productId=${product.id}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.productId !== product.id));
      toast.success("Removed from cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">

      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Continue shopping deals</h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const inCart = cartItems.some((item) => item.productId === product.id);
            const inWishlist = wishlistItems.includes(product.id);

            return (
              <div key={product.id} className="border p-4 rounded-lg shadow-lg bg-white hover:shadow-2xl transition">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
                <p className="text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  {/* <p className="text-lg font-bold text-green-600">${product.price}</p> */}
                  <div className="mt-2">
  {product.basePrice !== product.price ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 line-through">${product.basePrice}</span>
      <span className="text-lg font-bold text-green-600">${product.price}</span>
    </div>
  ) : (
    <span className="text-lg font-bold text-green-600">${product.basePrice}</span>
  )}
</div>

                </div>
                <button onClick={() => toggleCart(product)} className={`w-full py-2 mt-2 rounded text-white ${inCart ? 'bg-red-500' : 'bg-blue-500'}`}>
                  {inCart ? "Remove from Cart" : "Add to Cart"}
                </button>
                <button onClick={() => toggleWishlist(product)} className="mt-2">
                  {inWishlist ? <FaHeart className="text-red-500 text-2xl" /> : <FaRegHeart className="text-gray-500 text-2xl" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
