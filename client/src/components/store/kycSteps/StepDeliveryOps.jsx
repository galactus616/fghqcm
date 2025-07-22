import React from 'react';

const StepDeliveryOps = ({ kycData, updateKycData, errors = {} }) => {
  return (
    <form className="space-y-8">
      <h2 className="text-2xl font-bold mb-2 text-green-800">Delivery & Operations</h2>
      <p className="text-gray-500 mb-8">Tell us about your store's delivery area and operating hours.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block font-semibold mb-2 text-green-700">Operating Hours</label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="e.g. 9am - 9pm"
            value={kycData.operatingHours || ''}
            onChange={e => updateKycData({ operatingHours: e.target.value })}
          />
          {errors.operatingHours && <div className="text-xs text-red-600 mt-1">{errors.operatingHours}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Delivery Area</label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="e.g. Uttara, Banani, Gulshan"
            value={kycData.deliveryArea || ''}
            onChange={e => updateKycData({ deliveryArea: e.target.value })}
          />
          {errors.deliveryArea && <div className="text-xs text-red-600 mt-1">{errors.deliveryArea}</div>}
        </div>
      </div>
    </form>
  );
};

export default StepDeliveryOps; 