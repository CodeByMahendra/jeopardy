
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editBlog, setEditBlog] = useState(null);

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

    const deleteBlog = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            setLoading(true);
            await axios.delete("/api/admin/crud-blogs", { data: { id } });
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        } catch (err) {
            console.error("Error deleting blog:", err);
            setError("Failed to delete the blog.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setEditBlog(blog);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.put("/api/admin/crud-blogs", editBlog);
            setBlogs((prevBlogs) => prevBlogs.map((b) => (b.id === editBlog.id ? editBlog : b)));
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
                    {(Array.isArray(blogs) ? blogs : []).map((blog) => (
                        <div key={blog.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                            <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover rounded-md mb-3" />
                            <h2 className="font-semibold text-xl text-gray-800">{blog.title}</h2>
                            <p className="text-gray-600">{blog.category}</p>
                            
                            <div className="flex justify-between mt-4">
                                <button 
                                    onClick={() => deleteBlog(blog.id)}
                                    disabled={loading}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition"
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                                <button 
                                    onClick={() => handleEdit(blog)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Edit
                                </button>
                            </div>

                            {editBlog?.id === blog.id && (
                                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4">
                                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Blog</h2>
                                        
                                        <form onSubmit={handleUpdate}>
                                            <input 
                                                type="text" 
                                                value={editBlog.title} 
                                                onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })} 
                                                placeholder="Title" 
                                                className="w-full p-2 border rounded-md mb-3"
                                            />
                                            <input 
                                                type="text" 
                                                value={editBlog.category} 
                                                onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })} 
                                                placeholder="Category" 
                                                className="w-full p-2 border rounded-md mb-3"
                                            />
                                            <input 
                                                type="text" 
                                                value={editBlog.image} 
                                                onChange={(e) => setEditBlog({ ...editBlog, image: e.target.value })} 
                                                placeholder="Image URL" 
                                                className="w-full p-2 border rounded-md mb-3"
                                            />
                                            <textarea 
                                                value={editBlog.article} 
                                                onChange={(e) => setEditBlog({ ...editBlog, article: e.target.value })} 
                                                placeholder="Article" 
                                                className="w-full p-2 border rounded-md mb-3 h-24"
                                            ></textarea>

                                            <div className="flex justify-end gap-2">
                                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                                                    Save
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setEditBlog(null)}
                                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
