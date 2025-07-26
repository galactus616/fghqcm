import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreAuthModal from '../../components/store/StoreAuthModal';
import useStoreOwner from '../../store/useStoreOwner';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isStoreOwnerLoggedIn, fetchStoreOwnerProfile } = useStoreOwner();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreOwnerProfile();
  }, []);

  useEffect(() => {
    if (isStoreOwnerLoggedIn) {
      navigate('/store/dashboard/kyc-status', { replace: true });
    }
  }, [isStoreOwnerLoggedIn, navigate]);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    navigate('/store/dashboard/kyc');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-6 px-10 flex items-center justify-between z-10 border-b border-green-100">
        <div className="flex items-center gap-4">
          <img src="https://res.cloudinary.com/deepmitra/image/upload/v1753344029/qbd_logo_svg_onzssf.svg" alt="QBD Logo" className="h-[68px] object-contain rounded-lg bg-green-50 p-2 shadow" />
          <div className="font-extrabold text-2xl text-green-800 tracking-tight">store hub</div>
        </div>
        <div className="hidden md:block text-green-400 text-base font-medium italic tracking-wide">Empowering local stores across Bangladesh</div>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 w-full">
        {/* Hero Section - full width, no card */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          {/* Illustration */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <img
              src="https://res.cloudinary.com/deepmitra/image/upload/v1752308252/nrd-D6Tu_L3chLE-unsplash_pwr8ug.jpg"
              alt="Store Illustration"
              className="w-80 md:w-[420px] rounded-2xl shadow-lg border border-green-100 mb-4"
              style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%)' }}
            />
            <div className="hidden md:block text-gray-400 text-xs mt-2">Illustration for demo only</div>
          </div>
          {/* Hero Content */}
          <div className="flex-1 max-w-xl text-center md:text-left flex flex-col justify-center">
            <h1 className="text-5xl font-extrabold text-green-800 mb-4 leading-tight tracking-tight">
              Grow your business with <span className="text-green-500">QBD</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-medium">
              Join Quick Bangladesh to reach more customers, manage your store with ease, and enjoy seamless onboarding. Fast, secure, and built for modern sellers.
            </p>
            <button
              className="bg-gradient-to-r cursor-pointer from-green-600 to-green-500 text-white px-10 py-4 rounded-2xl font-bold text-xl shadow-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 transition-colors"
              onClick={() => setShowAuthModal(true)}
            >
              Become a Store
            </button>
            <div className="mt-10 flex flex-col md:flex-row gap-6 items-center justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="text-base text-gray-500 font-medium">10-minute onboarding</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="text-base text-gray-500 font-medium">No technical skills required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="text-base text-gray-500 font-medium">24/7 support</span>
              </div>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="w-full max-w-5xl border-t border-green-100 mb-12"></div>
        {/* Features Section */}
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border border-green-100">
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-green-50 border border-green-200 shadow">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-green-700 tracking-tight">Easy Onboarding</h3>
            <p className="text-gray-500 text-base text-center">Start selling in minutes with our guided onboarding process.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border border-green-100">
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-green-50 border border-green-200 shadow">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-green-700 tracking-tight">Real-Time Inventory</h3>
            <p className="text-gray-500 text-base text-center">Manage your products and stock with real-time updates and analytics.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border border-green-100">
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-green-50 border border-green-200 shadow">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M17 8V6a5 5 0 00-10 0v2a2 2 0 01-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-green-700 tracking-tight">Secure & Supported</h3>
            <p className="text-gray-500 text-base text-center">Your data is safe and our support team is always here to help you grow.</p>
          </div>
        </section>
      </main>
      {showAuthModal && <StoreAuthModal onClose={handleAuthModalClose} />}
    </div>
  );
};

export default LandingPage; 