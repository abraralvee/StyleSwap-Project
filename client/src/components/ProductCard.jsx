import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MoreVertical, Trash2, Ban } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';  // This import should be correct if alias is set in vite.config.js
import { Button } from '@/components/ui/button';  // This should also work with the alias

export function ProductCard({ product, isAdmin }) {
  const navigate = useNavigate();

  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banDuration, setBanDuration] = useState('1d');
  const [userId, setUserId] = useState(null);

  // Open ban modal
  const openBanModal = (userId) => {
    setUserId(userId);
    setIsBanModalOpen(true);
  };

  // Handle ban
  const handleBanUser = () => {
    axios
      .post('/api/admin/banUser', { userId, duration: banDuration })
      .then(() => {
        alert('User banned successfully!');
        setIsBanModalOpen(false);
      })
      .catch((err) => {
        console.error(err);
        alert('Error banning user.');
      });
  };

  // Handle remove post
  const handleRemovePost = () => {
    axios
      .delete('/api/admin/removePost', { data: { productId: product._id } })
      .then(() => {
        alert('Product removed successfully!');
      })
      .catch((err) => {
        console.error(err);
        alert('Error removing product.');
      });
  };

  // Admin menu dropdown
  const AdminMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          handleRemovePost();
        }}>
          <Trash2 className="mr-2 h-4 w-4" />
          Remove Post
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          openBanModal(product.userId);
        }}>
          <Ban className="mr-2 h-4 w-4" />
          Ban User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-700">
          {product.condition}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Size:</span>
            <span className="font-medium">{product.size}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Color:</span>
            <span className="font-medium">{product.color}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Gender:</span>
            <span className="font-medium">{product.gender}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Duration:</span>
            <span className="font-medium">{product.duration}</span>
          </div>
          <div className="pt-2 mt-2 border-t">
            <p className="text-xl font-bold text-indigo-600">৳{product.price}</p>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="absolute top-2 left-2 z-10">
          <AdminMenu />
        </div>
      )}

      {/* Ban Modal */}
      {isBanModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Select Ban Duration</h2>
            <select
              value={banDuration}
              onChange={(e) => setBanDuration(e.target.value)}
              className="mt-2 p-2 border rounded w-full"
            >
              <option value="1d">1 Day</option>
              <option value="3d">3 Days</option>
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="1y">1 Year</option>
              <option value="permanent">Permanent</option>
            </select>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleBanUser}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Ban User
              </button>
              <button
                onClick={() => setIsBanModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
