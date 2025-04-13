// import { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// export default function AddressForm({ userId }) {
//   const [address, setAddress] = useState(null);
//   const [formData, setFormData] = useState({
//     street: "",
//     city: "",
//     state: "",
//     country: "",
//     zip: ""
//   });

//   // Fetch existing address if available
//   useEffect(() => {

//     const fetchAddress = async () => {
//       try {
//         const res = await fetch(`/api/address?userId=${userId}`);
//         const data = await res.json();
//         if (data && data.length > 0) {
//           setAddress(data[0]);
//           setFormData(data[0]);
//         }
//       } catch (error) {
//         toast.error("Failed to fetch address.");
//       }
//     };

//     if (userId) fetchAddress();
//   }, [userId]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const method = address ? "PUT" : "POST";
//     const payload = address
//       ? { ...formData, addressId: address.id }
//       : { ...formData, userId };

//     try {
//       const res = await fetch("/api/address", {
//         method,
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const result = await res.json();

//       if (res.ok) {
//         setAddress(result);
//         toast.success(`Address ${method === "POST" ? "created" : "updated"} successfully!`);
//       } else {
//         toast.error(result.error || "Something went wrong!");
//       }
//     } catch (error) {
//       toast.error("Failed to submit address.");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const res = await fetch("/api/address", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ addressId: address.id })
//       });

//       if (res.ok) {
//         setAddress(null);
//         setFormData({ street: "", city: "", state: "", country: "", zip: "" });
//         toast.success("Address deleted successfully!");
//       } else {
//         toast.error("Failed to delete address.");
//       }
//     } catch (error) {
//       toast.error("Error while deleting address.");
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md mt-6">
//       <h2 className="text-2xl font-bold mb-4">{address ? "Update" : "Add"} Your Address</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="street"
//           placeholder="Street"
//           value={formData.street}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           value={formData.city}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="state"
//           placeholder="State"
//           value={formData.state}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="country"
//           placeholder="Country"
//           value={formData.country}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="zip"
//           placeholder="ZIP Code"
//           value={formData.zip}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           {address ? "Update Address" : "Add Address"}
//         </button>
//       </form>

//       {address && (
//         <button
//           onClick={handleDelete}
//           className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
//         >
//           Delete Address
//         </button>
//       )}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// }

'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AddressManager({ userId }) {
  const [address, setAddress] = useState(null);
  const [formData, setFormData] = useState({
    street: '', city: '', state: '', country: '', zip: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🟦 Fetch user address
  useEffect(() => {
    if (!userId) return;

    const fetchAddress = async () => {
      try {
        const res = await axios.get(`/api/address?userId=${userId}`);
        if (res.data.length > 0) {
          setAddress(res.data[0]);
          setFormData(res.data[0]);
        }
      } catch (error) {
        toast.error('Failed to fetch address');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [userId]);

  // 🟩 Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🟨 Create or Update Address
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (address) {
        // Update
        const res = await axios.put('/api/address', {
          ...formData,
          addressId: address.id,
        });
        setAddress(res.data);
        toast.success('Address updated successfully');
      } else {
        // Create
        const res = await axios.post('/api/address', {
          ...formData,
          userId,
        });
        setAddress(res.data);
        toast.success('Address created successfully');
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Error saving address');
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading address...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>

      {address ? (
        <div className="text-gray-700 space-y-2">
          <p>{address.street}, {address.city}</p>
          <p>{address.state} - {address.zip}</p>
          <p>{address.country}</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            ✏️ Edit Address
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-2">No address found</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Address
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {address ? 'Edit Address' : 'Add Address'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {["street", "city", "state", "country", "zip"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              ))}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {address ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
