import { Navigate } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isAuthLoading } = useStore();
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
} 