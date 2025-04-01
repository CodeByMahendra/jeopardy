
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState("PHYSICAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [basePrice, setBasePrice] = useState("");
  const [priceOneMonth, setPriceOneMonth] = useState("");
  const [priceOneYear, setPriceOneYear] = useState("");
  const [priceLifetime, setPriceLifetime] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/admin/storeCategory");
        setCategories(data);
      } catch (error) {
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const uploadFile = async (file, bucket) => {
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicData.publicUrl;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
      return;
    }
    setLoading(true);
    const url = await uploadFile(file, "jeopardy");
    if (url) setImageUrl(url);
    setLoading(false);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type. Only PDF files are allowed.");
      return;
    }
    setLoading(true);
    const url = await uploadFile(file, "jeopardy");
    if (url) setPdfUrl(url);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !imageUrl || !category || !basePrice || !priceOneYear || !priceOneMonth || !priceLifetime) {
      toast.error("All fields are required!");
      return;
    }
    if (productType === "DIGITAL" && !pdfUrl) {
      toast.error("PDF is required for digital products!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/admin/create-store", {
        name,
        description,
        category,
        basePrice: parseFloat(basePrice),
        priceOneMonth: parseFloat(priceOneMonth),
        priceOneYear: parseFloat(priceOneYear),
        priceLifetime: parseFloat(priceLifetime),
        image: imageUrl,
        fileUrl: pdfUrl || null,
        type: productType,
      });
      toast.success("Product added successfully!");
      setName("");
      setDescription("");
      setImageUrl("");
      setPdfUrl("");
      setCategory("");
      setBasePrice("");
      setPriceOneMonth("");
      setPriceOneYear("");
      setPriceLifetime("");
    } catch (error) {
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col w-full p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Product</h1>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required className="w-full p-3 border border-gray-300 rounded-lg" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className="w-full p-3 border border-gray-300 rounded-lg" rows="4" />

          <div>
            <label className="block font-semibold text-gray-700">Base Price:</label>
            <input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">1 Month Membership Price:</label>
            <input type="number" step="0.01" value={priceOneMonth} onChange={(e) => setPriceOneMonth(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">1 Year Membership Price:</label>
            <input type="number" step="0.01" value={priceOneYear} onChange={(e) => setPriceOneYear(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Lifetime Membership Price:</label>
            <input type="number" step="0.01" value={priceLifetime} onChange={(e) => setPriceLifetime(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <input type="file" onChange={handleImageUpload} required className="w-full p-3 border border-gray-300 rounded-lg" />
          {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-2 h-32 w-auto rounded-lg" />}
          <select value={productType} onChange={(e) => setProductType(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
          </select>
          {productType === "DIGITAL" && (
            <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="w-full p-3 border border-gray-300 rounded-lg" />
          )}
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
