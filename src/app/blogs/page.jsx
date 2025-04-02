
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/admin/categories");
        console.log(data.data);
        setCategories(data);
      } catch (error) {
        setError("Failed to fetch categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    // <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-300 to-purple-600 p-6">

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Blog Categories</h1>
      
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/blogs/${category.name.toLowerCase()}`}
            className="p-4 border rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition transform hover:scale-105 active:scale-95"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-60 object-cover rounded-md cursor-pointer hover:opacity-90 transition"
            />

            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
