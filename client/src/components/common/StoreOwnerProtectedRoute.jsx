import { Navigate, useLocation } from 'react-router-dom';
import useStoreOwner from '../../store/useStoreOwner';

export default function StoreOwnerProtectedRoute({ children }) {
  const { isStoreOwnerLoggedIn, isStoreOwnerAuthLoading, storeOwner } = useStoreOwner();
  const location = useLocation();

  if (isStoreOwnerAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }
  if (!isStoreOwnerLoggedIn) {
    return <Navigate to="/store" replace />;
  }
  // If not KYC completed, always redirect to KYC page
  if (!storeOwner?.kycCompleted && location.pathname !== '/store/dashboard/kyc') {
    return <Navigate to="/store/dashboard/kyc" replace />;
  }
  // If KYC completed and trying to access KYC page, redirect to dashboard home
  if (storeOwner?.kycCompleted && location.pathname === '/store/dashboard/kyc') {
    return <Navigate to="/store/dashboard" replace />;
  }
  return children;
} 