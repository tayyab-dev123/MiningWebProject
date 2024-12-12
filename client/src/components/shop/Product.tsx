"use client"
import React, { useState } from 'react';
import { Shuffle, Search, Heart, ChevronDown } from 'lucide-react';
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import { toast } from 'react-toastify';

const Shop = () => {
  const [sortOption, setSortOption] = useState('featured');
  const { data: products, isLoading, isError } = useGetAllMiningMachinesQuery();
  
  // Filter top products (for example, by rating or newest)
  const topProducts = products?.data?.slice(0, 3) || [];

  const TopProductCard = ({ product }) => (
    <div className='flex flex-col'>
      <div className="flex items-center gap-4 py-3 rounded-lg mb-4">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.machineName}
          className="w-20 h-20 object-contain"
        />
        <div>
          <h3 className="text-white text-sm font-medium mb-1">{product.machineName}</h3>
          <p className="text-green-500 font-bold">${product.priceRange}</p>
          <p className="text-gray-400 text-sm">{product.hashrate} TH/s</p>
        </div>
      </div>
      <span className='w-full h-[1px] bg-gray-200'></span>
    </div>
  );

  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div
        className="relative bg-white rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {isHovered && (
            <div className="absolute top-0 right-0 z-10 w-12 rounded-bl-lg bg-primary">
              <div className="flex flex-col items-center gap-4 p-4">
                <button className="text-white hover:text-green-500 transition-colors">
                  <Shuffle className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-green-500 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-green-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          <div className="relative aspect-square p-4">
            <img
              src={product.images?.[0] || '/placeholder.jpg'}
              alt={product.machineName}
              className="w-full h-full object-contain"
            />
          </div>
          {isHovered && (
            <div className="absolute bottom-0 left-0 right-0 bg-green-500 transition-transform duration-300">
              <button className="w-full text-white py-4 font-semibold hover:bg-green-600 transition-colors">
                ADD TO CART
              </button>
            </div>
          )}
        </div>
        <div className="p-4 pb-20 bg-primary">
          <h3 className="text-lg font-medium text-center mb-2 text-white">
            {product.machineName}
          </h3>
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-gray-300 text-sm">{product.hashrate} TH/s</span>
          </div>
          <p className="text-secondary font-bold text-xl text-center">
            ${product.priceRange}
          </p>
        </div>
      </div>
    );
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    toast.error("Failed to fetch products");
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white">Error loading products. Please try again later.</div>
      </div>
    );
  }

  // Sort products based on selected option
  const sortedProducts = [...(products?.data || [])].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return Number(a.priceRange) - Number(b.priceRange);
      case 'price-high':
        return Number(b.priceRange) - Number(a.priceRange);
      case 'hashrate':
        return Number(b.hashrate) - Number(a.hashrate);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-primary">
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Left Sidebar */}
          <div className="w-60 flex-shrink-0 hidden md:block">
            <h2 className="text-2xl font-bold text-white mb-6">TOP RATED PRODUCTS</h2>
            {topProducts.map((product, index) => (
              <TopProductCard key={product._id || index} product={product} />
            ))}
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Sorting Controls */}
            <div className="flex justify-end mb-6">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-gray-800 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="hashrate">Hashrate</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;