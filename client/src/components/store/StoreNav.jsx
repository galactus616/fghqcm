import { BellRing, CircleUserRound } from "lucide-react";
import React from "react";

const StoreNav = () => {
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
        <h3 className="text-xl font-semibold"> Products Management</h3>
      </section>
      <section className="flex items-center justify-between gap-4">
        <BellRing className="w-6 h-6" />
        <CircleUserRound className="w-6 h-6 pb-0.5" />
      </section>
    </nav>
  );
};

export default StoreNav;
