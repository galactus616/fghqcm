import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-30">
        <Navbar />
      </div>
      {/* Add padding top equal to navbar height (e.g., 64px) */}
      <main className="flex-grow pt-44 md:pt-22">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
