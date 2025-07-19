import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/store/dashboard' },
  { label: 'KYC & Onboarding', to: '/store/kyc' },
  { label: 'Product Catalogue', to: '/store/catalogue' },
  { label: 'Inventory', to: '/store/inventory' },
  { label: 'Orders', to: '/store/orders' },
  { label: 'Account', to: '/store/account' },
];

const Sidebar = () => (
  <aside className="w-64 bg-white border-r flex flex-col min-h-screen">
    <div className="h-20 flex items-center justify-center font-bold text-xl border-b">Store Dashboard</div>
    <nav className="flex-1 py-6">
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `block px-6 py-3 rounded-lg transition font-medium ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`
              }
              end
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar; 