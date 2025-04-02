'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import axios from 'axios';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user || !session.user.id) {
      console.error("User ID is missing");
      router.push("/sign-in");
      return;
    }

    const userId = session.user.id;
    console.log("User Id:", userId);

    axios.get(`/api/cart/whishlist`, { params: { userId } })
      .then((res) => setWishlist(res.data))
      .catch((error) => console.error("Error fetching wishlist:", error));
  }, []);

  const removeFromWishlist = async (productId) => {
    const userId = session.user.id;
    console.log("User Id:", userId);
    try {
      const response = await axios.delete(`/api/cart/whishlist`, {
        data: { userId, productId },
      });

      if (response.status === 200) {
        setWishlist(wishlist.filter(item => item.product.id !== productId));
        toast.success("Item removed from wishlist");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            <li key={item.product.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                {/* <p className="text-gray-600">{item.product.price} ₹</p> */}
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => removeFromWishlist(item.product.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

