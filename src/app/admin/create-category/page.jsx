"use client";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function Admin() {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/create-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage({ type: "success", text: "Category created successfully!" });
      setCategoryName("");
    } else {
      setMessage({ type: "error", text: "Failed to create category." });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Create New Category
          </h1>

          {message && (
            <p
              className={`text-sm p-2 text-center rounded ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category Name:
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
