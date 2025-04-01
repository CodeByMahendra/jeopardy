

'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/manage-order');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/update-order`, { orderId, status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div className="text-center text-lg font-semibold">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Admin Order Management</h2>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Products</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center border-b">
                <td className="border p-2">{order.user.name} ({order.user.email})</td>
                <td className="border p-2">
                  {order.items.map((item) => (
                    <div key={item.id}>{item.product.name}</div>
                  ))}
                </td>
                <td className="border p-2">${order.total}</td>
                <td className="border p-2 text-blue-600">{order.status}</td>
                <td className="border p-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => updateOrderStatus(order.id, 'Approved')}>
                    Approve
                  </button>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                    Deliver
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => updateOrderStatus(order.id, 'Cancelled')}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
