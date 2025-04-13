import React, { useState, useEffect } from "react";
import adminApi from "../api/adminApi";
import toast from "react-hot-toast";

const RemovePost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await adminApi.get("/all-posts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setPosts(res.data.posts);
    } catch {
      toast.error("Failed to fetch posts");
    }
  };

  const handleRemove = async (postId) => {
    try {
      await adminApi.delete(`/remove-post/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      toast.success("Post removed!");
      fetchPosts();
    } catch {
      toast.error("Failed to remove post");
    }
  };

  return (
    <div className="border p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">Remove Posts</h2>
      {posts.map((post) => (
        <div key={post._id} className="flex justify-between items-center border-b py-2">
          <span>{post.title}</span>
          <button
            onClick={() => handleRemove(post._id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default RemovePost;
