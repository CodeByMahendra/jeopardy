"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/AdminSidebar";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        if (response.status === 200) {
          setUsers(response.data);
          toast.success("Users Loaded Successfully!");
        } else {
          toast.error("Something went wrong!");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete("/api/admin/manage-user", {
        headers: { "Content-Type": "application/json" },
        data: { id: userId },  // ✅ Ensure "data" is explicitly in a separate object
      });
  
      if (response.status === 200) {
        toast.success("User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        toast.error(response.data.error || "Failed to delete user!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      
      if (error.response) {
        toast.error(error.response.data.error || "Failed to delete user!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  
  return (
    <div className=" flex ">
      <AdminSidebar />
      <div className="p-6 w-full">
  
      <h1 className="text-3xl font-bold text-white mb-6">Manage Users</h1>

{loading ? (
  <p className="text-lg text-gray-200">Loading...</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
    {users.length > 0 ? (
      users.map((user, index) => (
        <div
          key={user._id || index}
          className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Name: {user.name}
          </h2>
          <p className="text-gray-600">Score: {user.score}</p>
          <button
  onClick={() => handleDeleteUser(user.id.toString())}
  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
>
  Delete
</button>

        </div>
      ))
    ) : (
      <p className="text-lg text-white">No users found!</p>
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default Dashboard;
