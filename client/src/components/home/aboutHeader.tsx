/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const TradifierHero = () => {
  return (
    <div className="relative bg-[#fff]">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_70%,rgba(251,146,60,0.1))]" />
        
        {/* Circuit-like pattern */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px w-24 bg-orange-500"
              style={{
                top: `${20 + i * 15}%`,
                right: `${30 + (i % 3) * 20}%`,
                transform: `rotate(${45 + (i * 15)}deg)`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-24">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Pre-heading badge - Centered */}
            <div className="mb-8 inline-flex items-center space-x-2 rounded-full bg-primary px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-white">Revolutionizing Asset Trading</span>
            </div>
            <h1 className="relative z-10 max-w-7xl text-3xl font-medium tracking-tight text-black sm:text-xl lg:text-5xl md:mx-48  text-center">
              <span className="block md:leading-[1.2]">Building Tomorrow's World One Trade at a Time
              </span>
              <span className="mt-2 block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              </span>
            </h1>
            {/* Mission statement - Centered */}
            <div className="mt-8 max-w-5xl text-center">
              <p className="text-xl leading-relaxed text-gray-600">
                At Tradifier, we believe in simplifying how businesses in the solar and IT industries trade. 
                As a global platform, we've created a streamlined eco-system for buying, selling, and recycling assets.
              </p>
              <p className="mt-4 text-xl leading-relaxed text-gray-600">
                Whether you're a solar installer looking for surplus panels or an IT professional needing to dispose of 
                outdated hardware, Tradifier offers a reliable and efficient solution.
              </p>
            </div>

            <div className="mt-8">
        <button className="px-12 py-4 bg-secondary hover:bg-primary text-white text-lg font-medium rounded-full  transition duration-300">
          Free Sign Up
        </button>
      </div>          </div>
        </div>
      </div>
    </div>
  );
};

export default TradifierHero;