
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import MembershipUpdateForm from "@/components/Membership";
import axios from "axios"; // ✅ Import Axios

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchUserProfile() {
      if (status === "loading") return;
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/api/user/${session.user.id}`); // ✅ Using Axios
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
      setLoading(false);
    }

    fetchUserProfile();
  }, [session, status]);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not logged in</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex flex-col md:flex-row items-center space-x-4 p-6 bg-blue-50 rounded-lg shadow">
        <UserCircleIcon className="w-20 h-20 text-blue-500" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-700 font-semibold">Score: {user?.score}</p> {/* 🟢 Updates instantly */}
          <p className="text-gray-700 font-semibold">
            Membership: <span className="text-blue-600">{user?.membership || "None"}</span>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <MembershipUpdateForm currentMembership={user?.membership} userId={user?.id} updateUser={updateUser} />
      </div>
    </div>
  );
}
