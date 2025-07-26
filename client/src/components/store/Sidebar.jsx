import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Package2, 
  ShoppingCart, 
  DollarSign, 
  User 
} from "lucide-react";

const navItems = [
  { 
    label: "Dashboard", 
    to: "/store/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    label: "Products", 
    to: "/store/dashboard/store_products", 
    icon: Package 
  },
  { 
    label: "Inventory", 
    to: "/store/dashboard/inventory", 
    icon: Package2 
  },
  { 
    label: "Orders", 
    to: "/store/dashboard/store_orders", 
    icon: ShoppingCart 
  },
  { 
    label: "Finances", 
    to: "/store/dashboard/finances", 
    icon: DollarSign 
  },
  { 
    label: "Account", 
    to: "/store/dashboard/store_account", 
    icon: User 
  },
];

const Sidebar = () => (
  <aside className="w-64 bg-white flex flex-col min-h-screen border-r border-gray-400">
    <nav className="flex-1 py-6">
      <ul className="space-y-2 px-4">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700 border-l-4 border-green-500"
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
  </aside>
);

export default Sidebar;
