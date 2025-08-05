import { useNavigate } from "react-router-dom";
import useStoreOwner from "../../../store/useStoreOwner";
import { Menu, Bell, Search } from "lucide-react";

const StoreNav = ({ toggleSidebar }) => {
  const { storeOwner } = useStoreOwner();
  // console.log(storeOwner);

  return (
    <nav className="sticky z-40 top-0 bg-white border-b border-l border-gray-200 px-6 h-18 flex items-center justify-between">
      {/* Left side - Menu toggle only */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center - Search bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Right side - Notifications and user profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-pointer relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-700 font-semibold text-sm">
              {storeOwner?.name?.charAt(0) || storeOwner?.email?.charAt(0) || 'S'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">
              {storeOwner?.name || 'Store Owner'}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-32">
              {storeOwner?.email}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StoreNav;
