


"use client"
import AdminSidebar from "@/components/AdminSidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function BlogCategory() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/admin/storeCategory");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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

      setImageUrl(publicData.publicUrl);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data } = await axios.post("/api/admin/storeCategory", {
        name: categoryName,
        image: imageUrl,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage({ type: "success", text: "✅ Category created successfully!" });
      setCategoryName("");
      setCategories([...categories, data]);
    } catch (error) {
      setMessage({ type: "error", text: "❌ Failed to create category." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete("/api/admin/storeCategory", {
        headers: { "Content-Type": "application/json" },
        data: { id: categoryId },
      });
      
      if (response.status === 200) {
        toast.success("Category deleted successfully!");
        setCategories(categories.filter(category => category.id !== categoryId));
      } else {
        toast.error(response.data.error || "Failed to delete category!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex justify-between">
           Blog Categories
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
          >
            ➕ Add Category
          </button>
        </h2>

        {showForm && (
          <form onSubmit={handleCategorySubmit} className="bg-gray-100 p-4 rounded-md mb-4">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              placeholder="Enter category name"
            />
            <div>
              <label className="block font-semibold text-gray-700">Upload Image:</label>
              <input type="file" onChange={handleImageUpload} required className="w-full p-3 border border-gray-300 rounded-lg" />
              {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-2 h-32 w-auto rounded-lg" />}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </form>
        )}

        {message && (
          <p className={`text-sm p-2 text-center rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category Name</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>


            {/* <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-800 font-medium">
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">No categories found.</td>
                </tr>
              )}
            </tbody> */}

<tbody>
  {categories.length > 0 ? (
    categories.map((category, index) => (
      <tr key={category._id || index} className="hover:bg-gray-50">
        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
        <td className="border border-gray-300 px-4 py-2">{category.name}</td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-800 font-medium">
            ❌ Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="text-center text-gray-500 py-4">No categories found.</td>
    </tr>
  )}
</tbody>


          </table>
        </div>
      </div>
    </div>
  );
}
