import { NavLink, useNavigate } from "react-router-dom";
import useStoreOwner from "../../../store/useStoreOwner";
import {
  LayoutDashboard,
  Package,
  Package2,
  ShoppingCart,
  DollarSign,
  User,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    to: "/store/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    to: "/store/dashboard/store_products",
    icon: Package,
  },
  {
    label: "Inventory",
    to: "/store/dashboard/inventory",
    icon: Package2,
  },
  {
    label: "Orders",
    to: "/store/dashboard/store_orders",
    icon: ShoppingCart,
  },
  {
    label: "Finances",
    to: "/store/dashboard/finances",
    icon: DollarSign,
  },
  {
    label: "Account",
    to: "/store/dashboard/store_account",
    icon: User,
  },
];

const Sidebar = () => {
  const { logoutStoreOwner, storeOwner } = useStoreOwner();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutStoreOwner();
    navigate('/store');
  };

  return (
    <aside className="w-64 bg-white flex flex-col h-full shadow-sm">
      {/* Logo section */}
      <div className="flex items-center border-b px-5 h-18 border-gray-200">
        <img
          src="https://res.cloudinary.com/deepmitra/image/upload/v1753775167/QBD-LOGO_wehuk0.svg"
          alt="QBD Logo"
          className="h-16 object-contain"
          draggable={false}
        />
      </div>
      
      {/* Navigation: non-scrollable */}
      <nav className="flex-1 py-4">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                      isActive
                        ? "bg-green-100 text-primary border-l-4 border-primary"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  end={item.to === "/store/dashboard"}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom: Logout/email */}
      <div className="p-3 border-t border-gray-200 flex items-center gap-2 h-14">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2" />
        </svg>
        <span className="text-xs truncate flex-1 text-gray-600">{storeOwner?.email}</span>
        <button
          className="px-3 py-1.5 bg-gray-100 text-gray-700 cursor-pointer rounded-md font-medium hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 text-xs border border-gray-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
