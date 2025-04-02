

"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from 'react-toastify';


const Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
    const { data: session, status } = useSession();
  

  useEffect(() => {
    const fetchCategories = async () => {



      try {
        const { data } = await axios.get("/api/admin/storeCategory");
        setCategories(data);
        // toast.success("Categories fetched successfully!");
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
    // <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-300 to-purple-600 p-6">

      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
      Shop By Category
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Category Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => router.push(`/store/${category.name.toLowerCase()}`)}
            >
              <CardContent className="p-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <CardTitle className="text-lg font-semibold text-gray-800 mt-4 p-4">
                  <Link
                    href={`/blogs/${category.name.toLowerCase()}`}
                    className="text-blue-600 hover:underline"
                  >
                    {category.name}
                  </Link>
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
