import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using a custom Button component
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger
import { useLocation } from "react-router-dom";

const Navbar = ({ title, add }) => {
  const location = useLocation();

  const getNavbarTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Satellite Ship Detection";
      case "/ships":
        return "Ships";
      case "/ships/":
        return "Ship Details";
      case "/map":
        return "Map";
      case "/account":
        return "Account";
      default:
        return "Ship Detection via Satellite"; 
    }
  };

  return (
    <nav className="flex items-center justify-between h-[64px] px-4 bg-gray-800 text-white">
      {/* Left Section: Title */}
      <SidebarTrigger/>

      <div className="text-2xl font-bold">{getNavbarTitle()}</div>

      {/* Right Section: Add*/}
      <div className="flex items-center space-x-4">
        {add && add} 
              </div>
    </nav>
  );
};

export default Navbar;
