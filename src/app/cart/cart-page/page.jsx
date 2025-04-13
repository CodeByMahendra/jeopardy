

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import Checkout from "@/components/CheckOut";
// import AddressForm from "@/components/UserAddress";


// export default function Cart() {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);  
//   const { data: session, status } = useSession();
//   const [userId, setUserId] = useState(null);
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.id) {
//       setUserId(session.user.id);
//     }
//   }, [status, session]);

//   useEffect(() => {
//     if (!userId) return;

//     const fetchCart = async () => {
//       setLoading(true);  
//       try {
//         const response = await axios.get(`/api/cart?userId=${userId}`);
//         setCart(response.data);
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, [userId]);

//   if (status !== "authenticated" || !userId) {
//     return <p>Loading...</p>;
//   }

//   if (loading) {
//     return <p className="text-center text-gray-600">Loading Cart...</p>;
//   }

//   const updateQuantity = async (cartItemId, quantity) => {
//     if (quantity < 1) return;

//     try {
//       await axios.put("/api/cart", { cartItemId, quantity });
//       setCart((prev) => ({
//         ...prev,
//         items: prev.items.map((item) =>
//           item.id === cartItemId ? { ...item, quantity } : item
//         ),
//       }));
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//     }
//   };



//   const removeFromCart = async (cartItemId) => {
//     try {
//       await axios.delete("/api/cart", { data: { cartItemId } });
  
//       setCart((prev) => ({
//         ...prev,
//         items: prev.items.filter((item) => item.id !== cartItemId),
//       }));
  
//       //  Cart Count ko Decrease Karenga
//       setCartCount((prevCount) => Math.max(prevCount - 1, 0));
  
//       //  Notify Navbar
//       window.dispatchEvent(new Event("cartUpdated"));
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//     }
//   };
  
//   const totalPrice = cart?.items?.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   return (

//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Your Cart</h1>
//       {cart?.items?.length ? (
//         <>
//           {cart.items.map((item) => (
//             <div key={item.id} className="border p-4 rounded mb-2 flex justify-between">
//               <div>
//                 <h2 className="text-lg">{item.product.name}</h2>
//                 <p>Price: ${item.price} x {item.quantity}</p>
//               </div>
//               <div className="flex items-center">
//                 <button
//                   onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                   className="px-2 bg-gray-300 rounded"
//                 >
//                   -
//                 </button>
//                 <span className="px-4">{item.quantity}</span>
//                 <button
//                   onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                   className="px-2 bg-gray-300 rounded"
//                 >
//                   +
//                 </button>
//                 <button
//                   onClick={() => removeFromCart(item.id)}
//                   className="px-3 py-1 bg-red-500 text-white ml-2 rounded"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           <h2 className="text-lg font-bold mt-4">Total Price: ${totalPrice}</h2>

//           <div className="flex justify-between mt-4">
//                     <AddressForm userId={userId} />
            
//           </div>
//           <Checkout totalPrice={totalPrice} />
//         </>
//       ) : (
//         <p>Your cart is empty.</p>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Checkout from "@/components/CheckOut";
import AddressForm from "@/components/UserAddress";

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
    return <p className="text-center py-10 text-gray-600">Loading...</p>;
  }

  if (loading) {
    return <p className="text-center py-10 text-gray-600">Loading Cart...</p>;
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

      setCartCount((prevCount) => Math.max(prevCount - 1, 0));
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>

      {cart?.items?.length ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.quantity} = ₹
                    {item.price * item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-3 text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Address & Checkout */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <AddressForm userId={userId} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <Checkout totalPrice={totalPrice} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
}

