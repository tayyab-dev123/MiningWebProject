"use client"
import React, { useState } from "react";
import {
  FileText,
  User,
  Heart,
  LogOut,
  X,
  Settings,
  ChevronRight,
  Menu
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MenuLink = ({ href, icon: Icon, label, isActive }) => (
    <a
      href={href}
      className={`group relative flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-zinc-900
        ${isActive ? 'bg-gradient-to-r from-[#21eb00]/10 to-transparent text-[#21eb00]' : 'text-zinc-400 hover:text-white'}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 
          ${isActive ? 'text-[#21eb00]' : 'text-zinc-400 group-hover:text-white'}`} />
        <span className="font-medium">{label}</span>
      </div>
      {isActive && (
        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#21eb00]" />
      )}
      <ChevronRight className={`ml-auto h-4 w-4 opacity-0 transition-all duration-300 
        ${isActive ? 'text-[#21eb00] opacity-100' : 'group-hover:opacity-100'}`} />
    </a>
  );

  return (
    <div className="flex min-h-screen flex-col bg-black text-white lg:flex-row">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 block lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg bg-zinc-900 p-2 text-white hover:bg-zinc-800"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } fixed inset-0 z-50 w-full transform bg-black transition-all duration-300 lg:static lg:block lg:w-72`}
      >
        <div className="flex h-full flex-col border-r border-zinc-800 bg-black/95 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between lg:mb-8">
            <h1 className="bg-gradient-to-r from-[#21eb00] to-emerald-500 bg-clip-text text-2xl font-bold text-transparent">
              DASHBOARD
            </h1>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden rounded-lg bg-zinc-900 p-2 text-white hover:bg-zinc-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-2">
            <MenuLink href="#" icon={FileText} label="Overview" isActive={true} />
            <MenuLink href="/profile/assignProfile" icon={Settings} label="Total Machine" />

            <MenuLink href="#" icon={Heart} label="Favorites" />
            <MenuLink href="#" icon={User} label="Profile" />
            <MenuLink href="#" icon={LogOut} label="Logout" />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-black px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;