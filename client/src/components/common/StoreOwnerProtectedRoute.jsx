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
  
  // Check KYC status and handle routing
  const kycStatus = storeOwner?.kycStatus;
  
  // If KYC not submitted and not on KYC form, redirect to KYC form
  if (kycStatus === 'not_submitted' && location.pathname !== '/store/dashboard/kyc') {
    return <Navigate to="/store/dashboard/kyc" replace />;
  }
  
  // If KYC is pending and not on status page, redirect to status page
  if (kycStatus === 'pending' && location.pathname !== '/store/dashboard/kyc-status') {
    return <Navigate to="/store/dashboard/kyc-status" replace />;
  }
  
  // If KYC is approved and trying to access KYC pages, redirect to dashboard
  if (kycStatus === 'approved' && (location.pathname === '/store/dashboard/kyc' || location.pathname === '/store/dashboard/kyc-status')) {
    return <Navigate to="/store/dashboard" replace />;
  }
  
  // If KYC is rejected and not on status page, redirect to status page
  if (kycStatus === 'rejected' && location.pathname !== '/store/dashboard/kyc-status') {
    return <Navigate to="/store/dashboard/kyc-status" replace />;
  }
  
  return children;
} 