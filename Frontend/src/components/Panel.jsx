import React from "react";
import { Link } from "react-router-dom";

const Panel = ({ backgroundImage, title, description, link = "#", className = "" }) => {
  return (
    <Link
      to={link}
      className={`block w-full h-[300px] md:h-[400px] bg-cover bg-center relative ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white">
        <div className="p-6 rounded-xl max-w-2xl text-center hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
          <p className="text-lg md:text-xl">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default Panel;
