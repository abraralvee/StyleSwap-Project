import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Size:</span>
            <span className="font-medium">{product.size}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Color:</span>
            <span className="font-medium">{product.color}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gender:</span>
            <span className="font-medium">{product.gender}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{product.duration}</span>
          </div>
          <div className="pt-2 mt-2 border-t">
            <p className="text-xl font-bold text-indigo-600">৳{product.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}