import { useEffect, useState } from "react";

export default function BlogCategory() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

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
      setMessage({ type: "success", text: "✅ Category created successfully!" });
      setCategoryName("");

      // Update categories list
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
    } else {
      setMessage({ type: "error", text: "❌ Failed to create category." });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-3 flex justify-between">
        📂 Blog Categories
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
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button className="text-red-600 hover:text-red-800 font-medium">
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
  );
}
