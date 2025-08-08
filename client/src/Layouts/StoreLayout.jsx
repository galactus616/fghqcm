import Sidebar from "../components/store/storeDashboardComponents/StoreSidebar";
import { Outlet } from "react-router-dom";
import StoreNav from "../components/store/storeDashboardComponents/StoreNav";
import StoreFooter from "../components/store/storeDashboardComponents/StoreFooter";
import { useState } from "react";

const StoreLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-dvh bg-gray-100">
      {/* Overlay for mobile/tablet */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-white/40 bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen flex-shrink-0 z-50 lg:z-20
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 bg-white shadow-sm
      `}>
        <Sidebar onCloseSidebar={closeSidebar} />
      </aside>
  
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <StoreNav toggleSidebar={toggleSidebar} />
        <main role="main" className="flex-1 overflow-y-auto p-3 md:p-6">
          <Outlet />
        </main>
        <StoreFooter />
      </div>
    </div>
  );
};

export default StoreLayout;
