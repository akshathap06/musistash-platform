import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "MP3 Analysis", path: "/agentic-manager" },
  { label: "Target Venues", path: "/agentic-manager/venues" },
  { label: "Email Pitch Assistant", path: "/agentic-manager/email" },
];

const AgenticNavbar = () => {
  const location = useLocation();
  return (
    <nav className="w-full flex justify-center bg-[#181c24] border-b border-purple-900/40 shadow-lg z-40">
      <div className="flex justify-center w-full py-3 px-4 max-w-4xl">
        <div className="flex gap-4 mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-[#23263a] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AgenticNavbar; 