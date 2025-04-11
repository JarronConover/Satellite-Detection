import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using a custom Button component

const Navbar = ({ title, add }) => {
  return (
    <nav className="bg-gray-800 text-white w-[100%]">
      <div className="p-4 flex flex-row justify-between">
        <div className="flex-1 flex justify-center">
          <div className="text-2xl font-semibold">{title}</div>
        </div>
        <div>{add && add}</div>
      </div>
    </nav>
  );
};

export default Navbar;
