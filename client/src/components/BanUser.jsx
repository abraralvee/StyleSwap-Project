import React, { useState } from "react";
import adminApi from "../api/adminApi";
import toast from "react-hot-toast";

const BanUser = () => {
  const [userId, setUserId] = useState("");
  const [duration, setDuration] = useState("");

  const handleBan = async () => {
    try {
      await adminApi.post(
        "/ban",
        { userId, duration },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      toast.success("User banned!");
      setUserId("");
      setDuration("");
    } catch {
      toast.error("Failed to ban user");
    }
  };

  return (
    <div className="border p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">Ban User</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <input
        type="text"
        placeholder="Ban Duration (e.g. 7d)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button onClick={handleBan} className="bg-red-500 text-white px-4 py-2 rounded">
        Ban
      </button>
    </div>
  );
};

export default BanUser;
