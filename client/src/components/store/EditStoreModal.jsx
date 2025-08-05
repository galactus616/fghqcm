import React, { useState, useEffect } from 'react';
import { X, Save, Store, MapPin, Phone, User, AlertCircle, CheckCircle, Building, CreditCard, FileText, Clock, Shield } from 'lucide-react';
import { getKycStatus } from '../../api/store/storeKyc';

const EditStoreModal = ({ isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    // Store Information
    storeName: '',
    storeType: '',
    storeAddress: '',
    storePhone: '',
    operatingHours: '',
    
    // Owner Information
    ownerName: '',
    ownerPhone: '',
    ownerNID: '',
    
    // Bank Information
    bankAccountName: '',
    bankName: '',
    bankAccountNumber: '',
    
    // Business Documents
    tradeLicenseNumber: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [kycData, setKycData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchKycData();
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Countdown effect for success state
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      onUpdate();
      onClose();
    }
  }, [success, countdown, onUpdate, onClose]);

  const fetchKycData = async () => {
    try {
      setLoading(true);
      setError(null);
      const kycResponse = await getKycStatus();
      setKycData(kycResponse);
      
      if (kycResponse?.kyc) {
        const kyc = kycResponse.kyc;
        setFormData({
          // Store Information
          storeName: kyc.storeName || '',
          storeType: kyc.storeType || '',
          storeAddress: kyc.storeAddress || '',
          storePhone: kyc.storePhone || '',
          operatingHours: kyc.operatingHours || '',
          
          // Owner Information
          ownerName: kyc.ownerName || '',
          ownerPhone: kyc.ownerPhone || '',
          ownerNID: kyc.ownerNID || '',
          
          // Bank Information
          bankAccountName: kyc.bankAccountName || '',
          bankName: kyc.bankName || '',
          bankAccountNumber: kyc.bankAccountNumber || '',
          
          // Business Documents
          tradeLicenseNumber: kyc.tradeLicenseNumber || ''
        });
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      setError('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // For now, just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
             setSuccess(true);
       setCountdown(3);
    } catch (error) {
      console.error('Error updating store:', error);
      setError('Failed to update store information');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      storeName: '',
      storeType: '',
      storeAddress: '',
      storePhone: '',
      operatingHours: '',
      ownerName: '',
      ownerPhone: '',
      ownerNID: '',
      bankAccountName: '',
      bankName: '',
      bankAccountNumber: '',
      tradeLicenseNumber: ''
    });
    setError(null);
    setSuccess(false);
    setCountdown(3);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Store Information</h2>
              <p className="text-gray-600 text-sm">Update your store and business details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error && !success ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
                     ) : success ? (
             <div className="flex flex-col items-center justify-center py-12">
               <CheckCircle className="w-20 h-20 text-primary mb-4 animate-bounce" />
               <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-2 text-center">
                 Store Updated Successfully!
               </h2>
               <p className="text-gray-700 text-center mb-6">
                 Your store information has been updated and saved.
               </p>
               <div className="flex items-center gap-2 text-gray-500 text-sm">
                 Redirecting in <span className="font-bold text-primary text-lg">{countdown}</span> seconds...
               </div>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Store Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Store className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter store name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="storeType"
                      value={formData.storeType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select store type</option>
                      <option value="grocery">Grocery</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Phone
                    </label>
                    <input
                      type="tel"
                      name="storePhone"
                      value={formData.storePhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter store phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={formData.operatingHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="e.g., 9:00 AM - 8:00 PM"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Address
                    </label>
                    <textarea
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Enter complete store address"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Owner Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter owner name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter owner phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner NID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerNID"
                      value={formData.ownerNID}
                      onChange={handleInputChange}
                      readOnly
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter NID number"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Bank Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankAccountName"
                      readOnly
                      value={formData.bankAccountName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter bank account name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      readOnly
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter bank name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      required
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter bank account number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Documents Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Business Documents</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tradeLicenseNumber"
                    readOnly
                    value={formData.tradeLicenseNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter trade license number"
                  />
                </div>
              </div>

              {/* KYC Status Info */}
              {kycData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-700">KYC Status Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                        kycData.status === 'approved' ? 'bg-green-100 text-green-800' :
                        kycData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {kycData.status || 'Not submitted'}
                      </span>
                    </div>
                    {kycData.kyc?.submittedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">
                          {new Date(kycData.kyc.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStoreModal; 