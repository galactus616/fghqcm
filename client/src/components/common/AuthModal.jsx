import React, { useState, useEffect } from 'react';
import { sendOtp } from '../../api/user/auth';
import useStore from '../../store/useStore';
import { useTranslation } from "react-i18next";

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithOtp } = useStore();
  const { t } = useTranslation();

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhone('');
      setOtp('');
      setDevOtp('');
      setLoading(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDevOtp('');
    try {
      const data = await sendOtp(phone);
      setStep(2);
      if (data.devOtp) setDevOtp(data.devOtp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginWithOtp(phone, otp);
      onClose(true); // Indicate successful login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">{t('login_register')}</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('mobile_number')}</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
                placeholder={t('enter_mobile_number')}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                pattern="[0-9]{10,15}"
              />
            </div>
            {devOtp && (
              <div className="text-xs text-blue-600">{t('dev_otp')}: <span className="font-mono">{devOtp}</span></div>
            )}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? t('sending_otp') : t('send_otp')}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('enter_otp')}</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-green-50 placeholder-gray-400"
                placeholder={t('enter_otp_placeholder')}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                pattern="[0-9]{6}"
              />
            </div>
            {devOtp && (
              <div className="text-xs text-blue-600">{t('dev_otp')}: <span className="font-mono">{devOtp}</span></div>
            )}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? t('verifying') : t('verify_login')}
            </button>
            <button
              type="button"
              className="w-full cursor-pointer text-green-700 hover:underline text-sm mt-2"
              onClick={() => { setStep(1); setOtp(''); setError(''); }}
            >
              {t('change_mobile_number')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 