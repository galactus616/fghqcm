import Sidebar from '../components/store/Sidebar';
import { Outlet } from 'react-router-dom';

const StoreLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default StoreLayout;