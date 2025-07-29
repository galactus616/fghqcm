import { BellRing, CircleUserRound, Search } from "lucide-react";
import React from "react";
import { useLocation } from 'react-router-dom';

const StoreNav = () => {
  const location = useLocation();

  let title = "";
  if(location.pathname === "/store/dashboard/store_products"){
    title = "Products Management";
  }
  else if(location.pathname === "/store/dashboard/inventory"){
    title = "Inventory Management";
  }
  else if(location.pathname === "/store/dashboard/store_orders"){
    title = "Orders Management";
  }
  else if(location.pathname === "/store/dashboard/store_account"){
    title = "Account Management";
  }
  else if(location.pathname === "/store/dashboard"){
    title = "Dashboard Overview";
  }
  else if(location.pathname === "/store/dashboard/finances"){
    title = "Finances Management";
  } else {
    title = "Store Dashboard";
  }

  return (
    <nav className="bg-white border-b border-gray-100 h-17 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section - Title */}
      <section className="flex items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">Manage your store efficiently</p>
        </div>
      </section>
      
      {/* Right Section - Actions */}
      <section className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-48"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <BellRing className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User Profile */}
        <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <CircleUserRound className="w-5 h-5" />
        </button>
      </section>
    </nav>
  );
};

export default StoreNav;
