import React, { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:1226/api/orders/user/${user._id}`);
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:1226/api/users/${user._id}`, formData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2 px-4 rounded-md bg-white text-gray-700 border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.phone}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* Orders Section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Previous Rentals / Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order._id} className="bg-gray-50 p-4 rounded-md shadow-sm border">
                      <p><strong>Product:</strong> {order.product?.name}</p>
                      <p><strong>Rental Date:</strong> {new Date(order.rentedAt).toLocaleDateString()}</p>
                      <p><strong>Duration:</strong> {order.duration} days</p>
                      <p><strong>Status:</strong> {order.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
