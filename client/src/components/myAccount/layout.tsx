import React from 'react';
import { FileText, Download, MapPin, CreditCard, User, Heart, LogOut, Menu } from 'lucide-react';

const AccountDashboard = () => {
  const username = "ruzwanali007";

  const MenuLink = ({ href, children, className = "" }) => (
    <a 
      href={href} 
      className={`group flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${className}`}
    >
      {children}
    </a>
  );

  const DashboardCard = ({ icon: Icon, title }) => (
    <a 
      href="#" 
      className="relative flex flex-col items-center p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 group"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-800/5 to-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col items-center">
        <Icon className="w-12 h-12 mb-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
        <span className="text-lg font-medium group-hover:text-blue-400 transition-colors duration-300">{title}</span>
      </div>
    </a>
  );

  return (
    <div className="flex min-h-screen bg-primary text-white">
      {/* Sidebar */}
      <div className="w-72 p-6 bg-gray-900/30 backdrop-blur-sm border-r border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            MY ACCOUNT
          </h1>
          <Menu className="w-6 h-6 lg:hidden" />
        </div>
        
        <nav className="space-y-1">
          <MenuLink href="#" className="bg-gray-800/50 text-white">
            <FileText className="w-5 h-5" />
            <span>Dashboard</span>
          </MenuLink>
          
          <MenuLink href="#" className="text-gray-400 hover:bg-gray-800/30 hover:text-white">
            <FileText className="w-5 h-5" />
            <span>Orders</span>
          </MenuLink>
          
          <MenuLink href="#" className="text-gray-400 hover:bg-gray-800/30 hover:text-white">
            <Download className="w-5 h-5" />
            <span>Downloads</span>
          </MenuLink>
          
          <MenuLink href="#" className="text-gray-400 hover:bg-gray-800/30 hover:text-white">
            <MapPin className="w-5 h-5" />
            <span>Addresses</span>
          </MenuLink>
          
          <MenuLink href="#" className="text-gray-400 hover:bg-gray-800/30 hover:text-white">
            <CreditCard className="w-5 h-5" />
            <span>Payment methods</span>
          </MenuLink>
          
          <MenuLink href="#" className="text-gray-400 hover:bg-gray-800/30 hover:text-white">
            <User className="w-5 h-5" />
            <span>Account details</span>
          </MenuLink>
          
          <MenuLink href="#" className="text-gray-400 hover:bg-gray-800/30 hover:text-white">
            <Heart className="w-5 h-5" />
            <span>Wishlist</span>
          </MenuLink>
          
          <MenuLink href="#" className="text-gray-400 hover:bg-gray-800/30 hover:text-white">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </MenuLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-2">
              Hello <span className="text-blue-400">{username}</span>{" "}
              <span className="text-sm font-normal">
                (not {username}?{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                  Log out
                </a>
                )
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
            </p>
          </div>

          {/* Grid of options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard icon={FileText} title="Orders" />
            <DashboardCard icon={Download} title="Downloads" />
            <DashboardCard icon={MapPin} title="Addresses" />
            <DashboardCard icon={CreditCard} title="Payment methods" />
            <DashboardCard icon={User} title="Account details" />
            <DashboardCard icon={Heart} title="Wishlist" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;