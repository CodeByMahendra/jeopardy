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
        data: { id: userId },  
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
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
            {users.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-gray-300 px-4 py-2">#</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                    <th className="border border-gray-300 px-4 py-2">Score</th>
                    <th className="border border-gray-300 px-4 py-2">Membership</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id || index} className="text-center hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.score}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.membership}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleDeleteUser(user.id.toString())}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-lg text-gray-800 text-center">No users found!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
















