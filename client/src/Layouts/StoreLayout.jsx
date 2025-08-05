import Sidebar from "../components/store/storeDashboardComponents/StoreSidebar";
import { Outlet } from "react-router-dom";
import StoreNav from "../components/store/storeDashboardComponents/StoreNav";
import StoreFooter from "../components/store/storeDashboardComponents/StoreFooter";

const StoreLayout = () => {
  return (
    <div className="flex min-h-dvh bg-gray-100">
    {/* Sidebar */}
    <aside className="sticky top-0 h-screen flex-shrink-0 z-20">
      <Sidebar />
    </aside>
  
    {/* Main content */}
    <div className="flex-1 flex flex-col min-w-0">
      <StoreNav />
      <main role="main" className="flex-1 overflow-y-auto p-3 md:p-6">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  </div>
  
  );
};

export default StoreLayout;
