import React from 'react';

const ReviewRow = ({ label, value, isFile, required }) => (
  <div className="flex items-center gap-2 py-1">
    <div className="w-40 text-gray-500 font-medium flex-shrink-0">{label}{required && <span className="text-red-500">*</span>}</div>
    <div className="flex-1 font-semibold">
      {isFile
        ? (typeof value === 'string' && value.trim() !== ''
            ? <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">File uploaded</span>
            : <span className="text-red-500">Not provided</span>
          )
        : (value ? value : <span className="text-red-500">Not provided</span>)}
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white border border-green-100 rounded-lg p-6 shadow-sm mb-4">
    <div className="flex items-center gap-2 mb-4">
      <span className="font-bold text-green-700 text-lg">{title}</span>
    </div>
    {children}
  </div>
);

const StepReviewSubmit = ({ kycData }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-2 text-green-800">Review & Submit</h2>
      <p className="text-gray-500 mb-8">Please review all your information before submitting for verification.</p>
      <div className="space-y-6">
        <SectionCard title="Owner Details">
          <ReviewRow label="Full Name" value={kycData.ownerName} required />
          <ReviewRow label="Phone" value={kycData.ownerPhone} required />
          <ReviewRow label="NID Number" value={kycData.ownerNID} required />
          <ReviewRow label="NID Image" value={kycData.ownerNIDImage} isFile required />
        </SectionCard>
        <SectionCard title="Store Details">
          <ReviewRow label="Store Name" value={kycData.storeName} required />
          <ReviewRow label="Store Type" value={kycData.storeType} required />
          <ReviewRow label="Store Address" value={kycData.storeAddress} required />
          <ReviewRow label="Store Phone" value={kycData.storePhone} required />
          <ReviewRow label="Store Photo" value={kycData.storePhoto} isFile />
          <ReviewRow label="Geo Location" value={kycData.storeGeo ? `${kycData.storeGeo.lat || '-'}, ${kycData.storeGeo.lng || '-'}` : ''} />
        </SectionCard>
        <SectionCard title="Business Documents">
          <ReviewRow label="Trade License Number" value={kycData.tradeLicenseNumber} required />
          <ReviewRow label="Trade License Image" value={kycData.tradeLicenseImage} isFile required />
        </SectionCard>
        <SectionCard title="Bank & Payout">
          <ReviewRow label="Account Name" value={kycData.bankAccountName} required />
          <ReviewRow label="Account Number" value={kycData.bankAccountNumber} required />
          <ReviewRow label="Bank Name" value={kycData.bankName} required />
          <ReviewRow label="Branch" value={kycData.bankBranch} />
          <ReviewRow label="bKash/Nagad" value={kycData.digitalWallet} />
        </SectionCard>
        <SectionCard title="Delivery & Operations">
          <ReviewRow label="Operating Hours" value={kycData.operatingHours} />
          <ReviewRow label="Delivery Area" value={kycData.deliveryArea} />
        </SectionCard>
      </div>
    </div>
  );
};

export default StepReviewSubmit; 