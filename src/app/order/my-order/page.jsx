


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import DigitalOrders from "@/components/DigitalOrders";
// import AddressForm from "@/components/UserAddress";


// export default function ProfilePage() {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();
//     const { data: session, status } = useSession();

//     useEffect(() => {
//         if (status === "loading") return; 

//         if (status === "unauthenticated") {
//             console.error("user not authenticated");
//             setLoading(false);
//             return;
//         }

//         const userId = session?.user?.id;
//         if (!userId) {
//             console.error("User Id not found");
//             setLoading(false);
//             return;
//         }

//         async function fetchOrders() {
//             try {
//                 const res = await axios.get(`/api/user?userId=${userId}`);
//                 if (res.status !== 200) throw new Error("Failed to fetch orders");
//                 setOrders(res.data);
//             } catch (error) {
//                 console.error("failed to get data", error);
//             }
//             setLoading(false);
//         }


      
        


//         fetchOrders();
//     }, [status, session]);

//     if (loading) return <p>Loading...</p>;
//     if (orders.length === 0) return <p>No orders</p>;

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
//                         <h3 className="text-xl font-semibold mt-10">Order History</h3>

//             <DigitalOrders/>
//             <h3 className="text-xl font-semibold mt-10">Order History</h3>

//             <ul className="mt-4">
//                 {orders.map((order) => (
//                     <li key={order.id} className="border p-3 rounded-md mt-2">
//                         <p>Order ID: {order.id}</p>
//                         <p>Total Price: <span className="font-bold">${order.total}</span></p>
//                         <p>Status: <span className="font-bold">{order.status}</span></p>
//                         <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                         <h4 className="font-semibold mt-2">Items:</h4>
//                         <ul className="list-disc list-inside">
//     {order.items?.map((item) => (
//         <li key={item.id}>
//             {item.product?.name || "Unknown Product"} - Quantity: {item.quantity}, Price: ${item.price}
//         </li>
//     ))}
// </ul>

//                     </li>
//                 ))}
//             </ul>


//             <div className="mt-6 flex justify-center">

//                 <AddressForm userId={session?.user?.id} />
//                </div>

//         </div>
//     );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import AddressForm from "@/components/UserAddress";
import DigitalOrders from "@/components/DigitalOrders";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const userId = session?.user?.id;
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/user?userId=${userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">My Orders</h2>

      <div className="mt-10">
    <DigitalOrders/>
</div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Order ID: <span className="text-gray-700">{order.id}</span></p>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.status}
                </span>
              </div>
              <p>Total: <span className="font-bold">${order.total}</span></p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <h4 className="mt-3 font-semibold">Items:</h4>
              <ul className="list-disc ml-6 text-gray-700">
                {order.items?.map((item) => (
                  <li key={item.id}>
                    {item.product?.name || "Unknown Product"} × {item.quantity} — ${item.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}


      <div className="mt-10">
        <AddressForm userId={session?.user?.id} />
      </div>
    </div>
  );
}
