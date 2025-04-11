import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using a custom Button component
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger


const Navbar = ({ title, add }) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Left Section: Title */}
      <SidebarTrigger/>

      <div className="text-2xl font-bold">{title}</div>

      {/* Right Section: Add*/}
      <div className="flex items-center space-x-4">
        {add && add} 
              </div>
    </nav>
  );
};

export default Navbar;
