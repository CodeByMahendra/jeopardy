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
        const { data } = await axios.get("/api/categories");
        console.log(data.data)
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Blog Categories</h1>
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <ul className="space-y-3">
        {categories.map((category) => (
          <li key={category.id} className="p-3 border rounded-lg hover:bg-gray-100">
           

            
            <Link href={`/blogs/${category.name.toLowerCase()}`} className="text-blue-600 hover:underline">
  {category.name}
</Link>

          </li>
        ))}
      </ul>
    </div>
  );
}