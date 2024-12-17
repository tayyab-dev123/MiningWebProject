"use client"
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Heart, 
  Bolt, 
  Zap, 
  CreditCard, 
  CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import LandingLayout from '@/components/Layouts/LandingLayout';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const { data: products, isLoading, isError } = useGetAllMiningMachinesQuery();

  // Find the specific product based on the URL parameter
  const product = products?.data?.find(
    (p) => p.machineName.toLowerCase().replace(/\s+/g, '-') === params.id
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white">Loading product details...</div>
      </div>
    );
  }

  // Handle error or product not found
  if (isError || !product) {
    toast.error("Product not found");
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white">
          Error loading product details. Please try again later.
        </div>
      </div>
    );
  }

  // Function to handle add to cart
  const handleAddToCart = () => {
    toast.success(`${quantity} x ${product.machineName} added to cart`);
  };

  // Function to handle buy now
  const handleBuyNow = () => {
    toast.info(`Proceeding to checkout for ${quantity} x ${product.machineName}`);
    // Implement checkout logic here
  };

  return (
    <LandingLayout>
    <div className="min-h-screen bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            href="/shop" 
            className="flex items-center text-white hover:text-green-500 transition-colors"
          >
            <ChevronLeft className="mr-2" /> Back to Shop
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white/10 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 blur-2xl -z-10"></div>
            <img 
              src={product.images?.[0] || '/placeholder.jpg'} 
              alt={product.machineName} 
              className="max-w-full h-auto object-contain z-10 transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              {product.machineName}
            </h1>

            {/* Price and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-3xl font-bold text-green-500 mb-2">
                  ${product.priceRange}
                </p>
                <p className="text-sm text-gray-400">Per Unit</p>
              </div>
              
              {/* Quantity Selector */}
           
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="mr-2" />Buy Now
              </button>
            
            </div>

            {/* Technical Specifications */}
            <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2 text-yellow-500" /> Technical Specifications
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Bolt className="text-blue-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Hashrate</p>
                    <p className="font-medium">{product.hashrate} TH/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Power Consumption</p>
                    <p className="font-medium">{product.powerConsumption} W</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Profit</p>
                    <p className="font-medium text-green-500">${product.monthlyProfit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="text-red-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Coins Mined</p>
                    <p className="font-medium">{product.coinsMined}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Description</h2>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LandingLayout>
  );
};

export default ProductDetails;