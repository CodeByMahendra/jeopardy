


"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import AdminSidebar from "@/components/AdminSidebar";




export default function AdminDashboard() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editBlog, setEditBlog] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

      useEffect(() => {
        const fetchCategories = async () => {
          try {
            const { data } = await axios.get("/api/admin/categories");
            setCategories(data);
          } catch (error) {
            setError("Failed to fetch categories");
            console.error(error);
          }
        };
        fetchCategories();
      }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/admin/crud-blogs");
                if (Array.isArray(res.data)) {
                    setBlogs(res.data);
                } else {
                    throw new Error("Invalid data format");
                }
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError("Failed to fetch blogs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const deleteBlog = async () => {
        if (!blogToDelete) return;
        try {
            setLoading(true);
            await axios.delete("/api/admin/crud-blogs", { data: { id: blogToDelete } });
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogToDelete));
        } catch (err) {
            console.error("Error deleting blog:", err);
            setError("Failed to delete the blog.");
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setBlogToDelete(null);
        }
    };

    const handleEdit = (blog) => {
        setEditBlog({ ...blog });
        setTitle(blog.title);
        setContent(blog.content);
        setCategoryId(blog.categoryId);
    };
    
    

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updatedBlog = { ...editBlog, title, content, categoryId };
         const response =   await axios.put("/api/admin/crud-blogs", updatedBlog);
            setBlogs((prevBlogs) =>
                prevBlogs.map((b) => (b.id === editBlog.id ? updatedBlog : b))
            );
            console.log(response.data)

           if (response.status === 200){
            toast.success("Update successfully")
           }
           else{
            toast.error("Error")
           }
            setEditBlog(null);
        } catch (err) {
            console.error("Error updating blog:", err);
            setError("Failed to update blog.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="p-6 w-full">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Blogs</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {loading && <p className="text-gray-500 mb-4">Loading...</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                            <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover rounded-md mb-3" />
                            <h2 className="font-semibold text-xl text-gray-800">{blog.title}</h2>
                            <p className="text-gray-600">{blog.category}</p>
                            
                            <div className="flex justify-between mt-4">
                                <button 
                                    onClick={() => { setShowDeleteModal(true); setBlogToDelete(blog.id); }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>

                                <button 
                                    onClick={() => handleEdit(blog)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editBlog && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Blog</h2>
                        
                       

<form onSubmit={handleUpdate} className="space-y-6">
    <div>
        <label className="block font-semibold text-gray-700">Title:</label>
        <input
            type="text"
            value={editBlog?.title || ""}
            onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
        />
    </div>
    <div>
        <label className="block font-semibold text-gray-700">Content:</label>
        <textarea
            value={editBlog?.content || ""}
            onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows="4"
        />
    </div>
    <div>
        <label className="block font-semibold text-gray-700">Category:</label>
        <select
            value={editBlog?.categoryId || ""}
            onChange={(e) => setEditBlog({ ...editBlog, categoryId: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
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
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-blue-700"
        disabled={loading}
    >
        {loading ? "Updating..." : "Update Blog"}
    </button>
</form>





                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this blog?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={deleteBlog} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
