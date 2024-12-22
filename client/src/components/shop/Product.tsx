"use client";
import React, { useState } from "react";
import { Shuffle, Search, Heart, ChevronDown } from "lucide-react";
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";

const Shop = ({
  isHomePage = false,
  initialProductCount = 6,
  whatsappNumber = "+1234567890", // Add your WhatsApp number here
}) => {
  const [sortOption, setSortOption] = useState("featured");
  const { data: products, isLoading, isError } = useGetAllMiningMachinesQuery();
  const router = useRouter();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const topProducts = products?.data?.slice(0, 3) || [];

  const handleWhatsAppClick = (product) => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    const message = `Hi, I'm interested in buying the ${product.machineName}.\n\nDetails:\n- Hashrate: ${product.hashrate} TH/s\n- Price: $${product.priceRange}\n\nPlease provide more information.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const TopProductCard = ({ product }) => {
    if (isHomePage) return null;

    return (
      <div className="flex flex-col">
        <div className="mb-4 flex items-center gap-4 rounded-lg py-3">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.machineName}
            className="h-20 w-20 object-contain"
          />
          <div>
            <h3 className="mb-1 text-sm font-medium text-white">
              {product.machineName}
            </h3>
            <p className="font-bold text-green-500">${product.priceRange}</p>
            <p className="text-sm text-gray-400">{product.hashrate} TH/s</p>
          </div>
        </div>
        <span className="h-[1px] w-full bg-gray-200"></span>
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="relative overflow-hidden rounded-lg bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {isHovered && (
            <div className="absolute right-0 top-0 z-10 w-12 rounded-bl-lg bg-primary">
              <div className="flex flex-col items-center gap-4 p-4">
                <button className="text-white transition-colors hover:text-green-500">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          <div
            className="relative aspect-square cursor-pointer p-4"
            onClick={() =>
              router.push(
                `/shop/${product.machineName.toLowerCase().replace(/\s+/g, "-")}`,
              )
            }
          >
            <img
              src={product.images?.[0] || "/placeholder.jpg"}
              alt={product.machineName}
              className="h-full w-full object-contain"
            />
          </div>
          {isHovered && (
            <div className="absolute bottom-0 left-0 right-0 bg-green-500 transition-transform duration-300">
              <button
                onClick={() => handleWhatsAppClick(product)}
                className="w-full py-4 font-semibold text-white transition-colors hover:bg-green-600"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
        <div
          className="cursor-pointer bg-primary p-4 pb-20"
          onClick={() =>
            router.push(
              `/shop/${product.machineName.toLowerCase().replace(/\s+/g, "-")}`,
            )
          }
        >
          <h3 className="mb-2 text-center text-lg font-medium text-white">
            {product.machineName}
          </h3>
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-300">
              {product.hashrate} TH/s
            </span>
          </div>
          <p className="text-center text-xl font-bold text-secondary">
            ${product.priceRange}
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to fetch products");
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="text-white">
          Error loading products. Please try again later.
        </div>
      </div>
    );
  }

  const sortedProducts = [...(products?.data || [])].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return Number(a.priceRange) - Number(b.priceRange);
      case "price-high":
        return Number(b.priceRange) - Number(a.priceRange);
      case "hashrate":
        return Number(b.hashrate) - Number(a.hashrate);
      default:
        return 0;
    }
  });

  const displayProducts = isHomePage
    ? sortedProducts.slice(0, initialProductCount)
    : sortedProducts;

  return (
    <div className="min-h-screen bg-primary">
      <div className="p-8">
        <div className="mx-auto flex max-w-7xl gap-8">
          {!isHomePage && (
            <div className="hidden w-60 flex-shrink-0 md:block">
              <h2 className="mb-6 text-2xl font-bold text-white">
                TOP RATED PRODUCTS
              </h2>
              {topProducts.map((product, index) => (
                <TopProductCard key={product._id || index} product={product} />
              ))}
            </div>
          )}

          <div className="flex-1">
            {/* {!isHomePage && (
              <div className="mb-6 flex justify-end">
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none rounded-lg bg-gray-800 px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="hashrate">Hashrate</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-white" />
                </div>
              </div>
            )} */}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayProducts.map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
              ))}
            </div>

            {isHomePage && (
              <div className="mt-8 flex justify-center">
                <Link
                  href="/shop"
                  className="rounded-lg bg-green-500 px-6 py-3 text-white transition-colors hover:bg-green-600"
                >
                  More Shop
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
