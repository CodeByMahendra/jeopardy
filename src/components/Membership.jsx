
"use client";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const membershipOptions = [
  { type: "ONE_MONTH", label: "One Month", price: "$50" },
  { type: "ONE_YEAR", label: "One Year", price: "$150" },
  { type: "LIFETIME", label: "Lifetime", price: "$400" },
];

export default function MembershipUpdateForm({ currentMembership }) {
  const [membership, setMembership] = useState(currentMembership || "");
  const { data: session } = useSession();

  const handleMembershipChange = async (newMembership) => {
    if (!session?.user?.id) {
      console.error("User is not logged in");
      return;
    }

    try {
      await axios.put("/api/membership", {
        userId: session.user.id,
        membership: newMembership,
      });
      setMembership(newMembership);
      toast.success("Membership updated successfully!");
    } catch (error) {
      console.error("Error updating membership:", error);
      toast.error("Failed to update membership!");
    }
  };

  // Disable logic
  const isDisabled = (option) => {
    if (membership === "LIFETIME") return true;
    if (membership === "ONE_YEAR" && option !== "LIFETIME") return true;
    if (membership === "ONE_MONTH" && option === "ONE_MONTH") return true;
    return false;
  };

  return (
    <div className="p-6 border rounded-lg shadow-md w-full max-w-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Select Your Membership</h2>
      <div className="grid grid-cols-1 gap-4">
        {membershipOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleMembershipChange(option.type)}
            disabled={isDisabled(option.type)}
            className={`w-full flex items-center justify-between p-4 rounded-lg border 
              ${isDisabled(option.type) ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}
            `}
          >
            <span className="text-lg font-medium">{option.label}</span>
            <span className="text-md">{option.price}</span>
            {membership === option.type && (
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}


