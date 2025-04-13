import React, { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import toast from "react-hot-toast";

const UnbanUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchBanned();
  }, []);

  const fetchBanned = async () => {
    try {
      const res = await adminApi.get("/banned-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to fetch banned users");
    }
  };

  const handleUnban = async (userId) => {
    try {
      await adminApi.post(
        "/unban",
        { userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      toast.success("User unbanned!");
      fetchBanned();
    } catch {
      toast.error("Failed to unban user");
    }
  };

  return (
    <div className="border p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">Unban Users</h2>
      {users.map((user) => (
        <div key={user._id} className="flex justify-between items-center border-b py-2">
          <span>{user.email}</span>
          <button
            onClick={() => handleUnban(user._id)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Unban
          </button>
        </div>
      ))}
    </div>
  );
};

export default UnbanUser;
