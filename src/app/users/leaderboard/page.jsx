


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        if (response.status === 200) {
          const sortedUsers = [...response.data].sort((a, b) => Number(b.score) - Number(a.score)); 
          setUsers(sortedUsers);
          toast.success("Leaderboard Loaded Successfully!");
        } else {
          toast.error("Something went wrong!");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load Leaderboard!");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);


  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-300 to-purple-600 p-6">
      <h1 className="text-4xl font-bold text-white mb-6"> Leaderboard </h1>

      {loading ? (
        <p className="text-lg text-white animate-pulse">Loading...</p>
      ) : users.length > 0 ? (
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-lg">
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.email}
                  className={`text-gray-800 text-lg border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-all`}
                >
                  <td className="p-4 font-bold">{index + 1}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 font-semibold text-blue-600">${user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-lg text-white">No users found!</p>
      )}
    </div>
  );
};

export default Dashboard;
