"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        if (response.status === 200) {
          setUsers(response.data);
          toast.success("Dashboard Loaded Successfully!");
        } else {
          toast.error("Something went wrong!");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen  flex flex-col items-center bg-gradient-to-br from-blue-300 to-purple-600 p-6 ">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.name} className="bg-white shadow-lg p-4 rounded-lg">
                <h2 className="text-xl font-semibold">Name: {user.name}</h2>
                <p className="text-gray-700">Score: {user.score}</p>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500">No users found!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
