import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, orderId } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    pin: '',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  const paymentMethods = [
    {
      id: 'bkash',
      name: 'bKash',
      logo: 'https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo.svg'
    },
    {
      id: 'nagad',
      name: 'Nagad',
      logo: 'https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg'
    },
    {
      id: 'card',
      name: 'Card',
      logo: 'https://www.logo.wine/a/logo/Visa_Inc./Visa_Inc.-Logo.wine.svg'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate payment processing
      const paymentResponse = await axios.post('http://localhost:1226/api/payments/process', {
        userId: user._id,
        orderId,
        amount: total,
        paymentMethod,
        transactionDetails: {
          phoneNumber: formData.phoneNumber,
          cardNumber: formData.cardNumber,
          cardHolderName: formData.cardHolderName,
          expiryDate: formData.expiryDate
        }
      });

      if (paymentResponse.data.success) {
        toast.success('Payment successful!');
        navigate('/profile');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'bkash':
      case 'nagad':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">PIN</label>
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter PIN"
                required
              />
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
              <input
                type="text"
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter card holder name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter card number"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="CVV"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
            
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-900">Total Amount: ৳{total}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                      paymentMethod === method.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-500'
                    }`}
                  >
                    <img 
                      src={method.logo} 
                      alt={method.name} 
                      className="h-8 object-contain"
                    />
                    <span className="text-sm font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderPaymentForm()}
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Confirm Payment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;