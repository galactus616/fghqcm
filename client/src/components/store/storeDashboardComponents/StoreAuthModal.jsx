import { useState } from 'react';
import { registerStoreOwner, requestOtp } from '../../../api/store/storeAuth';
import useStoreOwner from '../../../store/useStoreOwner';

const StoreAuthModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithOtp } = useStoreOwner();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      try {
        await registerStoreOwner(email);
      } catch (err) {
        if (!err.response || err.response.data.message !== 'Email already registered') {
          throw err;
        }
      }
      // Request OTP
      await requestOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginWithOtp(email, otp);
      setStep(3);
      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={() => onClose(false)}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-3 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12v1a4 4 0 01-8 0v-1m8 0V8a4 4 0 00-8 0v4m8 0H8" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-green-700">Store Owner Login</h2>
          <p className="text-gray-500 mb-6 text-center">Sign in with your email to start onboarding your store.</p>
        </div>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <input
              type="email"
              className="w-full border-2 border-green-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-semibold text-lg shadow hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <input
              type="text"
              className="w-full border-2 border-green-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition tracking-widest text-center text-lg"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              required
              autoFocus
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-semibold text-lg shadow hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center py-8">
            <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            <div className="text-green-700 font-bold text-xl mb-2">Login Successful!</div>
            <div className="text-gray-500">Redirecting to onboarding...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreAuthModal; 