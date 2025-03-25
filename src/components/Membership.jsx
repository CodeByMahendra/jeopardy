"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function MembershipUpdateForm() {

  const [membership, setMembership] = useState("NONE");
  
 

    
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);
    const userId = user?.id;
    console.log("UserId==",userId)
   


 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/membership", { userId, membership });
      console.log("Membership updated:", response.data);
      alert("Membership updated successfully!");
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Failed to update membership!");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96">
      <h2 className="text-lg font-bold mb-4">Update Membership</h2>
      <form onSubmit={handleSubmit}>
       

        <label className="block mb-2">Membership Type:</label>
        <select
          value={membership}
          onChange={(e) => setMembership(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="NONE">None</option>
          <option value="ONE_MONTH">One Month</option>
          <option value="ONE_YEAR">One Year</option>
          <option value="LIFETIME">Lifetime</option>
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Update Membership
        </button>
      </form>
    </div>
  );
}