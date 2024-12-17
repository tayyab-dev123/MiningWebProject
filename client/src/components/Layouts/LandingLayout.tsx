"use client";
import React, { useState, ReactNode } from "react";
import Header from "@/components/Header";
import Navbar from "../NavBar";
import Footer from "@/components/home/Footer";
import { AdminNavbar } from "../AdminNavbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="bg-black-2" >
      <AdminNavbar/>

       <Navbar/>

        <div >
         
          <main>
            <div >
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
          <Footer/>
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
