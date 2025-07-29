import Sidebar from "../components/store/Sidebar";
import { Outlet } from "react-router-dom";
import StoreNav from "../components/store/StoreNav";

const StoreLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <StoreNav />
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StoreLayout;
