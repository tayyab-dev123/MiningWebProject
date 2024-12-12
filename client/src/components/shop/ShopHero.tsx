import React from 'react';
import { Grid, Terminal, Droplets, Power, Database } from 'lucide-react';

const ShopHero = () => {
  const categories = [
    {
      title: 'ASIC MINERS',
      products: '31 Products',
      icon: <Terminal className="w-12 h-12" />,
    },
    {
      title: 'IMMERSION COOLING CABINETS',
      products: '7 Products',
      icon: <Grid className="w-12 h-12" />,
    },
    {
      title: 'HYDRO COOLING CABINETS AND KITS',
      products: '13 Products',
      icon: <Droplets className="w-12 h-12" />,
    },
    {
      title: 'READY TO PLUG BUNDLES',
      products: '17 Products',
      icon: <Power className="w-12 h-12" />,
    },
  
    {
      title: 'IPFS MAXIMALIST',
      products: '11 Products',
      icon: <Database className="w-12 h-12" />,
    },
  ];

  return (
    <div className=" min-h-screen p-8">
      <h1 className="text-white text-6xl font-bold text-center mb-16">Shop</h1>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group bg-black border border-green-500/10 rounded-lg p-6 hover:border-green-500 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="text-green-500">
                {category.icon}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg group-hover:text-green-500 transition-colors">
                  {category.title}
                </h2>
                <p className="text-gray-500 text-sm">{category.products}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopHero;