
"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import ProductCard from "./ProductCard";

import { AddProductForm } from "./AddProductForm";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import OccasionList from "./OccasionList";
import FilterSidebar from "./FilterSidebar";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    occasion: [],
    subEvents: [],
    gender: "",
    size: [],
    color: [],
    duration: [],
    priceRange: [500, 5000],
  });

  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:1226/api/products/all-products"
        );
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProducts();
  }, []);

  const handleApplyFilters = (filters) => {
    console.log("Applied filters:", filters);
    setActiveFilters(filters);
    setShowFilters(false); // Close sidebar on mobile
  };

  const handleClearFilters = () => {
    console.log("Cleared all filters");
    setActiveFilters({
      occasion: [],
      subEvents: [],
      gender: "",
      size: [],
      color: [],
      duration: [],
      priceRange: [500, 5000],
    });
  };

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // First apply search term filter
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.condition.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Then apply all other filters

    // Gender filter
    if (
      activeFilters.gender &&
      product.gender &&
      activeFilters.gender !== "" &&
      product.gender.toLowerCase() !== activeFilters.gender.toLowerCase()
    ) {
      return false;
    }

    // Size filter
    if (
      activeFilters.size.length > 0 &&
      !activeFilters.size.includes(product.size)
    ) {
      return false;
    }

    // Color filter
    if (
      activeFilters.color.length > 0 &&
      !activeFilters.color.some((color) =>
        product.color.toLowerCase().includes(color.toLowerCase())
      )
    ) {
      return false;
    }

    // Price range filter
    if (
      product.price &&
      (Number.parseInt(product.price) < activeFilters.priceRange[0] ||
        Number.parseInt(product.price) > activeFilters.priceRange[1])
    ) {
      return false;
    }

    // Duration filter (if applicable)
    if (activeFilters.duration.length > 0 && product.duration) {
      // Convert duration to a comparable format
      let matches = false;
      activeFilters.duration.forEach((durationRange) => {
        if (
          durationRange === "7 Days" &&
          Number.parseInt(product.duration.split(" ")[0]) <= 7
        ) {
          matches = true;
        } else if (
          durationRange === "15 Days" &&
          Number.parseInt(product.duration) >= 8 &&
          Number.parseInt(product.duration) <= 15
        ) {
          matches = true;
        } else if (
          durationRange === "1 month" &&
          Number.parseInt(product.duration) >= 16 &&
          Number.parseInt(product.duration) <= 30
        ) {
          matches = true;
        } else if (
          durationRange === "1 & 1/2 month" &&
          Number.parseInt(product.duration) >= 31 &&
          Number.parseInt(product.duration) <= 45
        ) {
          matches = true;
        } else if (
          durationRange === "2 month" &&
          Number.parseInt(product.duration) >= 46 &&
          Number.parseInt(product.duration) <= 60
        ) {
          matches = true;
        }
      });
      if (!matches) return false;
    }

    // If we've passed all filters, include this product
    return true;
  });

  // Count active filters for badge display
  const activeFilterCount = Object.entries(activeFilters).reduce(
    (count, [key, value]) => {
      if (key === "priceRange") {
        // Only count price range if it's different from default
        if (value[0] !== 500 || value[1] !== 5000) {
          return count + 1;
        }
        return count;
      }
      if (Array.isArray(value)) {
        return count + value.length;
      }
      if (value && value !== "") {
        return count + 1;
      }
      return count;
    },
    0
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
          <div className="flex gap-6">
            {/* Filter Sidebar (visible on md+ screens) */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <FilterSidebar
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                initialFilters={activeFilters}
              />
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  className="md:hidden flex items-center gap-1 bg-gray-200 px-3 py-2 rounded text-sm"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center my-20">
                  <PacmanLoader />
                </div>
              ) : (
                <>
                  <OccasionList />

                  {/* Active filters display */}
                  {activeFilterCount > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Active filters:
                      </span>
                      {activeFilters.gender && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                          {activeFilters.gender}
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setActiveFilters({ ...activeFilters, gender: "" })
                            }
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {activeFilters.size.map((size) => (
                        <span
                          key={size}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          Size: {size}
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setActiveFilters({
                                ...activeFilters,
                                size: activeFilters.size.filter(
                                  (s) => s !== size
                                ),
                              })
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {activeFilters.color.map((color) => (
                        <span
                          key={color}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          Color: {color}
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setActiveFilters({
                                ...activeFilters,
                                color: activeFilters.color.filter(
                                  (c) => c !== color
                                ),
                              })
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(activeFilters.priceRange[0] !== 500 ||
                        activeFilters.priceRange[1] !== 5000) && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                          Price: ৳{activeFilters.priceRange[0]} - ৳
                          {activeFilters.priceRange[1]}
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setActiveFilters({
                                ...activeFilters,
                                priceRange: [500, 5000],
                              })
                            }
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {activeFilterCount > 0 && (
                        <button
                          className="text-indigo-600 text-xs hover:text-indigo-800 font-medium"
                          onClick={handleClearFilters}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  )}

                  <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Our Products
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">
                      No products found matching your filters
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Mobile Sidebar Overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 bg-white p-4 overflow-auto shadow-lg md:hidden">
                <FilterSidebar
                  onClose={() => setShowFilters(false)}
                  onApplyFilters={handleApplyFilters}
                  onClearFilters={handleClearFilters}
                  initialFilters={activeFilters}
                />
              </div>
            )}
          </div>
        ) : (
          <AddProductForm />
        )}
      </div>
    </div>
  );
}
