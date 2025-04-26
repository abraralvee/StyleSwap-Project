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
  const [ownerOrders, setOwnerOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:1226/api/orders/user/${user._id}`);
      setOrders(response.data);
      console.log('Fetched Orders:', response.data);
    } catch (error) {
      //toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOwnerOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:1226/api/orders/owner/${user._id}`);
      setOwnerOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders for your products');
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
      fetchOwnerOrders();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:1226/api/user/${user._id}`, formData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:1226/api/orders/update-status`, {
        orderId,
        newStatus
      });
      
      toast.success('Order status updated!');
      fetchOwnerOrders(); 
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>

            {/* Profile Editing */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <button type="submit" className="py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-700">
                  Save Changes
                </button>
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
                      <p><strong>Product:</strong> {order.product?.name || 'Unknown'}</p>
                      <p><strong>Product Owner:</strong> {order.product?.owner?.name || 'Unknown'}</p>
                      <p><strong>Rental Date:</strong> {new Date(order.rentedAt).toLocaleDateString()}</p>
                      <p><strong>Duration:</strong> {order.duration} days</p>
                      <p><strong>Status:</strong> {order.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

           {/* Orders for Products Owned by User */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Orders for My Products</h3>
              {ownerOrders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                <ul className="space-y-4">
                  {ownerOrders.map((order) => (
                    <li key={order._id} className="bg-gray-50 p-4 rounded-md shadow-sm border">
                      <p><strong>Product:</strong> {order.product?.name}</p>
                      <p><strong>Ordered by:</strong> {order.user?.name}</p>
                      <p><strong>Status:</strong> {order.status}</p>

                      {/* Status Dropdown */}
                      <select
                        className="mt-2 p-2 border rounded"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Returned">Returned</option>
                      </select>
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
