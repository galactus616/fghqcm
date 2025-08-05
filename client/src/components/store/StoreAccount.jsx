import React, { useState, useEffect } from 'react';
import { Download, Edit, User, Store, Shield, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, AlertCircle, CreditCard, FileText, Settings, Copy, Building, Globe, Award, MapPinIcon } from 'lucide-react';
import useStoreOwner from '../../store/useStoreOwner';
import { getKycStatus } from '../../api/store/storeKyc';
import EditStoreModal from './storeDashboardComponents/EditStoreModal';
import EditProfileModal from './storeDashboardComponents/EditProfileModal';
import axios from 'axios';

const StoreAccount = () => {
  const { storeOwner } = useStoreOwner();
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch KYC data which includes store details
      const kycResponse = await getKycStatus();
      setKycData(kycResponse);
    } catch (error) {
      console.error('Error fetching account data:', error);
      setError('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKycProgress = () => {
    if (!kycData?.kyc) return 0;
    const steps = ['ownerName', 'storeName', 'bankAccountName', 'tradeLicenseNumber', 'operatingHours'];
    const completedSteps = steps.filter(step => kycData.kyc[step]).length;
    return (completedSteps / steps.length) * 100;
  };

  const handleEditStore = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleStoreUpdate = () => {
    // Refresh KYC data after update
    fetchAccountData();
  };

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleProfileUpdate = () => {
    // Refresh account data after update
    fetchAccountData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 ">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Store Account</h1>
            <p className="text-green-100 text-base md:text-lg">Manage your business profile and settings</p>
          </div>
          <div className="flex gap-3 mt-6 lg:mt-0">
            <button 
              onClick={handleEditStore}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 cursor-pointer text-sm md:text-base"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Store</span>
            </button>
            <button 
              onClick={handleEditProfile}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white text-primary rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer text-sm md:text-base"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">KYC Status</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {kycData?.status === 'approved' ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Store Status</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {kycData?.kyc ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
              <Store className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Account Type</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">Business</p>
            </div>
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
              <User className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Member Since</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {storeOwner?.createdAt ? new Date(storeOwner.createdAt).getFullYear() : '2024'}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Store Owner & Store Details */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Store Owner Profile */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Store Owner Profile</h2>
                  <p className="text-gray-600 text-xs md:text-sm">Personal information and account details</p>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs md:text-sm text-gray-600">Email Address</p>
                      <p className="text-sm md:text-base font-medium text-gray-900">{storeOwner?.email || 'Not provided'}</p>
                    </div>
                    <button className="p-1 md:p-2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs md:text-sm text-gray-600">Owner Name</p>
                      <p className="text-sm md:text-base font-medium text-gray-900">{kycData?.kyc?.ownerName || storeOwner?.name || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs md:text-sm text-gray-600">Verification Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(kycData?.status)}
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(kycData?.status)}`}>
                          {kycData?.status || 'Not submitted'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {kycData?.kyc && (
                    <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-600">KYC Submitted</p>
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          {new Date(kycData.kyc.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Store className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Store Information</h2>
                  <p className="text-gray-600 text-xs md:text-sm">Business details and store configuration</p>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6">
              {kycData?.kyc ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <Store className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-600">Store Name</p>
                        <p className="text-sm md:text-base font-medium text-gray-900">{kycData.kyc.storeName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <Building className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-600">Store Type</p>
                        <p className="text-sm md:text-base font-medium text-gray-900 capitalize">{kycData.kyc.storeType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-600">Store Address</p>
                        <p className="text-sm md:text-base font-medium text-gray-900">{kycData.kyc.storeAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-600">Store Phone</p>
                        <p className="text-sm md:text-base font-medium text-gray-900">{kycData.kyc.storePhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-600">Operating Hours</p>
                        <p className="text-sm md:text-base font-medium text-gray-900">{kycData.kyc.operatingHours || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-gray-600">KYC Submitted</p>
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          {new Date(kycData.kyc.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 md:py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <Store className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Store Information</h3>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Complete your KYC to add store information</p>
                  <button className="px-4 md:px-6 py-2 md:py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm md:text-base">
                    Complete KYC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - KYC Details */}
        <div className="space-y-4 md:space-y-6">
          {/* KYC Details Card */}
          {kycData?.kyc && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-semibold text-gray-900">KYC Details</h2>
                    <p className="text-gray-600 text-xs md:text-sm">Verification information</p>
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Owner Details */}
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">Owner Details</span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Name</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.ownerPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">NID</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.ownerNID}</p>
                    </div>
                  </div>
                </div>

                {/* Store Details */}
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Store className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">Store Details</span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Store Name</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.storeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Store Type</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900 capitalize">{kycData.kyc.storeType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Address</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.storeAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">Bank Details</span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Account Name</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.bankAccountName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Bank Name</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.bankName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Account Number</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">****{kycData.kyc.bankAccountNumber?.slice(-4)}</p>
                    </div>
                  </div>
                </div>

                {/* Business Documents */}
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">Business Documents</span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Trade License</p>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{kycData.kyc.tradeLicenseNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Store Modal */}
      <EditStoreModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onUpdate={handleStoreUpdate}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={handleProfileModalClose}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default StoreAccount;