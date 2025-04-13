"use client";

import { useState, useEffect } from 'react';
import { MoreVertical, Ban, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchBannedUsers();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/products/all-products');
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      toast.error("Failed to fetch posts");
    }
  };

  const fetchBannedUsers = async () => {
    try {
      const response = await fetch('/api/admin/banned-users');
      const data = await response.json();
      setBannedUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch banned users");
    }
  };

  const handleRemovePost = async (postId) => {
    try {
      await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success("Post removed successfully");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to remove post");
    }
  };

  const handleBanUser = async (userId, duration) => {
    try {
      await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ duration })
      });
      toast.success("User banned successfully");
      setShowBanDialog(false);
      fetchBannedUsers();
    } catch (error) {
      toast.error("Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await fetch(`/api/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success("User unbanned successfully");
      fetchBannedUsers();
    } catch (error) {
      toast.error("Failed to unban user");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Posts Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{post.name}</h3>
                  <p className="text-sm text-gray-500">{post.userName}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleRemovePost(post._id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedUser(post.userId);
                        setShowBanDialog(true);
                      }}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Ban User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <img 
                src={post.image} 
                alt={post.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="text-sm text-gray-600">
                <p>Price: ${post.price}</p>
                <p>Duration: {post.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banned Users Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Banned Users</h2>
        <div className="bg-white rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Ban Duration</th>
                <th className="p-4 text-left">Expires</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bannedUsers.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.banDuration}</td>
                  <td className="p-4">
                    {new Date(user.banExpiry).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnbanUser(user._id)}
                    >
                      Unban
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban Duration Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Select the duration for which you want to ban this user
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button onClick={() => handleBanUser(selectedUser, '3d')}>
              3 Days
            </Button>
            <Button onClick={() => handleBanUser(selectedUser, '1w')}>
              1 Week
            </Button>
            <Button onClick={() => handleBanUser(selectedUser, '1m')}>
              1 Month
            </Button>
            <Button onClick={() => handleBanUser(selectedUser, '1y')}>
              1 Year
            </Button>
            <Button 
              variant="destructive"
              className="col-span-2"
              onClick={() => handleBanUser(selectedUser, 'permanent')}
            >
              Permanent Ban
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}