'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BlogPage({ params }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const category = params.category?.[0] || 'general'; 
        const response = await axios.get(`/api/blog/${category}`);
        setBlogs(response.data);
      } catch (err) {
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [params.category]);

  if (loading) return <p className='text-center mt-5'>Loading...</p>;
  if (error) return <p className='text-center text-red-500 mt-5'>{error}</p>;

  return (
    <div className='max-w-4xl mx-auto p-5'>
      <h1 className='text-2xl font-bold mb-5'>Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs found for this category</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className='border p-4 mb-4 rounded shadow'>
            <h2 className='text-xl font-semibold'>{blog.title}</h2>
            <img src={blog.image} alt={blog.title} className='w-full h-60 object-cover my-3 rounded' />
            <p>{blog.content}</p>
          </div>
        ))
      )}
    </div>
  );
}


