import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKycStatus, approveKyc } from '../../api/store/storeKyc';
import useStoreOwner from '../../store/useStoreOwner';

const POLL_INTERVAL = 5000; // 5 seconds

const KycStatusPage = () => {
  const [status, setStatus] = useState('pending');
  const [kyc, setKyc] = useState(null);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const { logoutStoreOwner, storeOwner, refreshProfile } = useStoreOwner();
  const pollRef = useRef();

  const fetchStatus = async () => {
    setError('');
    try {
      const res = await getKycStatus();
      setStatus(res.status);
      setKyc(res.kyc);
      if (res.status === 'approved') {
        navigate('/store/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch KYC status.');
    }
  };

  useEffect(() => {
    // Add a small delay to ensure backend has updated the status
    const timer = setTimeout(async () => {
      // Refresh profile first to get latest kycStatus
      await refreshProfile();
      fetchStatus();
      pollRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(pollRef.current);
    };
    // eslint-disable-next-line
  }, []);

  const handleDevApprove = async () => {
    if (!kyc?._id) return;
    setApproving(true);
    setError('');
    try {
      await approveKyc(kyc._id);
      await fetchStatus();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to approve KYC.');
    } finally {
      setApproving(false);
    }
  };

  const handleLogout = async () => {
    await logoutStoreOwner();
    navigate('/store');
  };

  // UI for each status
  let content;
  if (status === 'pending') {
    content = (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-20 h-20 text-yellow-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">KYC Submitted!</h2>
        <p className="text-gray-700 mb-4 text-center max-w-md">Your KYC is under review. You will be notified by email once your account is verified.<br/>If you have questions, please contact support.</p>
        {process.env.NODE_ENV === 'development' && (
          <button
            className="px-6 py-2 rounded bg-green-600 cursor-pointer text-white font-semibold hover:bg-green-700 transition shadow mb-4"
            onClick={handleDevApprove}
            disabled={approving}
          >
            {approving ? 'Approving...' : 'Dev Approve KYC'}
          </button>
        )}
        <button
          className="px-6 py-2 rounded cursor-pointer bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition shadow"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    );
  } else if (status === 'rejected') {
    content = (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-20 h-20 text-red-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6m0-6l6 6" /></svg>
        <h2 className="text-2xl font-bold text-red-700 mb-2">KYC Rejected</h2>
        <p className="text-gray-700 mb-4 text-center max-w-md">Your KYC was rejected. Please review your information and resubmit.<br/>{kyc?.remarks && <span className="block mt-2 text-red-500 font-semibold">Reason: {kyc.remarks}</span>}</p>
        <button
          className="px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow"
          onClick={() => window.location.reload()}
        >
          Resubmit KYC
        </button>
        <button
          className="mt-4 px-6 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition shadow"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    );
  } else if (status === 'approved') {
    // Should redirect, but fallback UI
    content = (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-20 h-20 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
        <h2 className="text-2xl font-bold text-green-700 mb-2">KYC Approved!</h2>
        <p className="text-gray-700 mb-4 text-center max-w-md">Your KYC has been approved. Redirecting to your dashboard...</p>
      </div>
    );
  } else if (status === 'not_submitted') {
    content = (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">KYC Not Submitted</h2>
        <p className="text-gray-700 mb-4 text-center max-w-md">Please complete your KYC to proceed.</p>
        <button
          className="px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow"
          onClick={() => navigate('/store/dashboard/kyc')}
        >
          Start KYC
        </button>
        <button
          className="mt-4 px-6 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition shadow"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12">
        {error && <div className="text-red-600 text-center font-semibold mb-4">{error}</div>}
        {content}
      </div>
    </div>
  );
};

export default KycStatusPage; 