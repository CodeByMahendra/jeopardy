

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from "@/components/AdminSidebar";

import { toast } from 'react-toastify';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/create-store');
      setProducts(response.data);
    } catch (error) {
      toast.error('Error fetching products');
    }
  };

  const handleUpdate = async () => {
    if (!editProduct?.id) return;

    try {
      await axios.put('/api/admin/create-store', editProduct);
      toast.success('Product updated successfully');
      fetchProducts();
      setEditProduct(null);
    } catch (error) {
      toast.error('Error updating product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/admin/create-store', {
        headers: { 'Content-Type': 'application/json' },
        data: { id },
      });
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
  };



  return (
    <div className="flex bg-gray-100 min-h-screen">
                  <AdminSidebar />
       <div className='p-6 w-full'>

       <h1 className='text-2xl font-bold mb-4'>Product List</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {products.map((product) => (
          <div key={product.id} className='border p-4 rounded shadow'>
            <img src={product.image} alt={product.name} className='w-full h-40 object-cover rounded' />

            {editProduct?.id === product.id ? (
              <div>
                <input
                  type='text'
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className='border p-2 w-full'
                  placeholder='Product Name'
                />
                <input
                  type='text'
                  value={editProduct.image}
                  onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                  className='border p-2 w-full mt-2'
                  placeholder='Image URL'
                />
                <input
                  type='text'
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className='border p-2 w-full mt-2'
                  placeholder='Description'
                />
                <input
                  type='number'
                  value={editProduct.basePrice}
                  onChange={(e) => setEditProduct({ ...editProduct, basePrice: e.target.value })}
                  className='border p-2 w-full mt-2'
                  placeholder='Base Price'
                />
                <input
                  type='number'
                  value={editProduct.priceOneMonth}
                  onChange={(e) => setEditProduct({ ...editProduct, priceOneMonth: e.target.value })}
                  className='border p-2 w-full mt-2'
                  placeholder='1 Month Price'
                />
                <input
                  type='number'
                  value={editProduct.priceOneYear}
                  onChange={(e) => setEditProduct({ ...editProduct, priceOneYear: e.target.value })}
                  className='border p-2 w-full mt-2'
                  placeholder='1 Year Price'
                />
                <input
                  type='number'
                  value={editProduct.priceLifetime}
                  onChange={(e) => setEditProduct({ ...editProduct, priceLifetime: e.target.value })}
                  className='border p-2 w-full mt-2'
                  placeholder='Lifetime Price'
                />
                <button onClick={() => handleUpdate(product.id)} className='bg-green-500 text-white px-4 py-2 rounded mt-2 w-full'>
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h2 className='text-lg font-semibold'>{product.name}</h2>
                <p>{product.description}</p>
                <p className='text-sm text-gray-500'>Base Price: ${product.basePrice}</p>
                <p className='text-sm text-gray-500'>1 Month Price: ${product.priceOneMonth}</p>
                <p className='text-sm text-gray-500'>1 Year Price: ${product.priceOneYear}</p>
                <p className='text-sm text-gray-500'>Lifetime Price: ${product.priceLifetime}</p>

                <button onClick={() => setEditProduct(product.id)} className='bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full'>
                  Edit
                </button>
                <button onClick={() => handleDelete(product.id)} className='bg-red-500 text-white px-4 py-2 rounded mt-2 w-full'>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

       </div>
    
    </div>
  );


}












