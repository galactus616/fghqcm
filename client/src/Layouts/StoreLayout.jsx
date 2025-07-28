import Sidebar from "../components/store/Sidebar";
import { Outlet } from "react-router-dom";
import StoreNav from './../components/store/StoreNav';

const StoreLayout = () => {
  return (
    <>
      <StoreNav/>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 ">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default StoreLayout;
