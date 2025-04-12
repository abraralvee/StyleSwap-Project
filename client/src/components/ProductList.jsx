import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { AddProductForm } from "./AddProductForm";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";

// Mock data for demonstration
// const mockProducts = [
//   {
//     _id: "1",
//     name: "Vintage Denim Jacket",
//     size: "M",
//     color: "Blue",
//     gender: "Unisex",
//     condition: "Good",
//     image:
//       "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=800",
//     price: "2499",
//     duration: "30 days",
//   },
//   {
//     _id: "2",
//     name: "Summer Floral Dress",
//     size: "S",
//     color: "Pink",
//     gender: "Female",
//     condition: "Like New",
//     image:
//       "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
//     price: "1899",
//     duration: "15 days",
//   },
//   {
//     _id: "3",
//     name: "Classic White Sneakers",
//     size: "42",
//     color: "White",
//     gender: "Unisex",
//     condition: "New",
//     image:
//       "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&q=80&w=800",
//     price: "3499",
//     duration: "45 days",
//   },
// ];

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Connection with the server
    async function getProducts() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:1226/api/products/all-products"
        );

        if (response.data.success) {
          const data = response.data.data;
          setProducts(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Homepage/Rent</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {showAddForm ? "View Products" : "Add Product"}
          </button>
        </div>

        {!showAddForm ? (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {isLoading ? (
              <div className="flex justify-center my-20">
                <PacmanLoader />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <p className="text-center text-gray-500 mt-8">
                    No products found
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          <AddProductForm />
        )}
      </div>
    </div>
  );
}
