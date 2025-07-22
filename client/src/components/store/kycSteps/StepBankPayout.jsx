import React from 'react';

const StepBankPayout = ({ kycData, updateKycData, errors = {} }) => {
  return (
    <form className="space-y-8">
      <h2 className="text-2xl font-bold mb-2 text-green-800">Bank & Payout</h2>
      <p className="text-gray-500 mb-8">Enter your bank and payout details for settlements.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block font-semibold mb-2 text-green-700">Account Holder Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="Account holder name"
            required
            value={kycData.bankAccountName || ''}
            onChange={e => updateKycData({ bankAccountName: e.target.value })}
          />
          {errors.bankAccountName && <div className="text-xs text-red-600 mt-1">{errors.bankAccountName}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Account Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="Account number"
            required
            value={kycData.bankAccountNumber || ''}
            onChange={e => updateKycData({ bankAccountNumber: e.target.value })}
          />
          {errors.bankAccountNumber && <div className="text-xs text-red-600 mt-1">{errors.bankAccountNumber}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Bank Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="Bank name"
            required
            value={kycData.bankName || ''}
            onChange={e => updateKycData({ bankName: e.target.value })}
          />
          {errors.bankName && <div className="text-xs text-red-600 mt-1">{errors.bankName}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Branch</label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="Branch name (optional)"
            value={kycData.bankBranch || ''}
            onChange={e => updateKycData({ bankBranch: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-2 text-green-700">bKash/Nagad Number (optional)</label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="bKash or Nagad number"
            value={kycData.digitalWallet || ''}
            onChange={e => updateKycData({ digitalWallet: e.target.value })}
          />
          {errors.digitalWallet && <div className="text-xs text-red-600 mt-1">{errors.digitalWallet}</div>}
        </div>
      </div>
    </form>
  );
};

export default StepBankPayout; 