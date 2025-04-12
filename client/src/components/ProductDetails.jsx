import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

// Using the same mock data
// const mockProducts = [
//   {
//     _id: "1",
//     name: "Vintage Denim Jacket",
//     size: "M",
//     color: "Blue",
//     gender: "Unisex",
//     condition: "Good",
//     image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=800",
//     price: "2499",
//     duration: "30 days"
//   },
//   {
//     _id: "2",
//     name: "Summer Floral Dress",
//     size: "S",
//     color: "Pink",
//     gender: "Female",
//     condition: "Like New",
//     image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
//     price: "1899",
//     duration: "15 days"
//   },
//   {
//     _id: "3",
//     name: "Classic White Sneakers",
//     size: "42",
//     color: "White",
//     gender: "Unisex",
//     condition: "New",
//     image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&q=80&w=800",
//     price: "3499",
//     duration: "45 days"
//   }
// ];

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Connect with server
    async function getProduct() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:1226/api/products/view-product/${id}`
        );

        if (response.data.success) {
          const data = response.data.data;
          setProduct(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to products
        </button>

        {isLoading ? (
          <div className="flex justify-center my-20">
            <PacmanLoader />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {product.condition}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <span className="text-gray-600">Price</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ৳{product.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Size</span>
                      <p className="font-medium">{product.size}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Color</span>
                      <p className="font-medium">{product.color}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender</span>
                      <p className="font-medium">{product.gender}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration</span>
                      <p className="font-medium">{product.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
