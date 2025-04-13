import React from "react";
import BanUser from "./BanUser";
import RemovePost from "./RemovePost";
import UnbanUser from "./UnbanUser";

const AdminDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <BanUser />
      <RemovePost />
      <UnbanUser />
    </div>
  );
};

export default AdminDashboard;

