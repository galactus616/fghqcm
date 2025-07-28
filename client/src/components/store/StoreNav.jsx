import { BellRing, CircleUserRound } from "lucide-react";
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
    title = "Dashboard History";
  }
  else if(location.pathname === "/store/dashboard/finances"){
    title = "Finances Management";
  } else {
    title = "Store Dashboard";
  }

  return (
    <nav className="border-b border-gray-400 h-16 z-10 bg-white flex items-center justify-between px-4">
      <section className="flex items-center">
        <div className="w-64">
          <img
            src="https://res.cloudinary.com/deepmitra/image/upload/v1753344029/qbd_logo_svg_onzssf.svg"
            alt="QBD Logo"
            className="h-[68px] object-contain"
            draggable={false}
          />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </section>
      <section className="flex items-center justify-between gap-4">
        <BellRing className="w-6 h-6" />
        <CircleUserRound className="w-6 h-6 pb-0.5" />
      </section>
    </nav>
  );
};

export default StoreNav;
