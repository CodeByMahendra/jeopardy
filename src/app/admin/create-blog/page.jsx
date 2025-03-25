

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/admin/create-category");
        setCategories(data);
      } catch (error) {
        setError("Failed to fetch categories");
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
      return;
    }

    setLoading(true);
    const fileName = `${Date.now()}-${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("jeopardy")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        console.error("Error uploading image:", error.message || error);
        alert(`Upload failed: ${error.message || "Unknown error"}`);
        return;
      }

      const { data: publicData, error: urlError } = supabase.storage
        .from("jeopardy")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error fetching public URL:", urlError.message || urlError);
        alert("Failed to fetch image URL.");
        return;
      }

      console.log("Image uploaded successfully:", publicData);
      setImageUrl(publicData.publicUrl);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !imageUrl || !categoryId) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/blog", {
        title,
        content,
        image: imageUrl,
        categoryId: Number(categoryId),
      });
      toast.success("Blog added successfully");
      setTitle("");
      setContent("");
      setImageUrl("");
      setCategoryId("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col w-full p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Blog</h1>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Upload Image:</label>
            <input
              type="file"
              onChange={handleImageUpload}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-2 h-32 w-auto rounded-lg" />}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Category:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

