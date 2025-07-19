import React, { useState } from 'react';
import { uploadToCloudinary } from '../../../utils/cloudinary';

const StepStoreDetails = ({ kycData, updateKycData, errors = {} }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadToCloudinary(file);
      updateKycData({ storePhoto: url });
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
      updateKycData({ storePhoto: '' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-8">
      <h2 className="text-2xl font-bold mb-2 text-green-800">Store Details</h2>
      <p className="text-gray-500 mb-8">Provide your store's basic information and contact details.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block font-semibold mb-2 text-green-700">Store Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="Store name"
            required
            value={kycData.storeName || ''}
            onChange={e => updateKycData({ storeName: e.target.value })}
          />
          {errors.storeName && <div className="text-xs text-red-600 mt-1">{errors.storeName}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Store Type <span className="text-red-500">*</span></label>
          <select
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition shadow-sm"
            required
            value={kycData.storeType || ''}
            onChange={e => updateKycData({ storeType: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="grocery">Grocery</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="other">Other</option>
          </select>
          {errors.storeType && <div className="text-xs text-red-600 mt-1">{errors.storeType}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-2 text-green-700">Store Address <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="Full address"
            required
            value={kycData.storeAddress || ''}
            onChange={e => updateKycData({ storeAddress: e.target.value })}
          />
          {errors.storeAddress && <div className="text-xs text-red-600 mt-1">{errors.storeAddress}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Store Phone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="e.g. 017XXXXXXXX"
            required
            value={kycData.storePhone || ''}
            onChange={e => updateKycData({ storePhone: e.target.value })}
          />
          {errors.storePhone && <div className="text-xs text-red-600 mt-1">{errors.storePhone}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Store Photo</label>
          <input
            type="file"
            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
          {uploadError && <div className="text-xs text-red-600 mt-1">{uploadError}</div>}
          {kycData.storePhoto && typeof kycData.storePhoto === 'string' && (
            <div className="text-xs text-green-700 mt-2">File uploaded <a href={kycData.storePhoto} target="_blank" rel="noopener noreferrer" className="underline ml-2">View</a></div>
          )}
          {errors.storePhoto && <div className="text-xs text-red-600 mt-1">{errors.storePhoto}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Geo Location (optional)</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              className="w-1/2 rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
              placeholder="Latitude"
              value={kycData.storeGeo?.lat || ''}
              onChange={e => updateKycData({ storeGeo: { ...kycData.storeGeo, lat: e.target.value } })}
            />
            <input
              type="number"
              step="any"
              className="w-1/2 rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
              placeholder="Longitude"
              value={kycData.storeGeo?.lng || ''}
              onChange={e => updateKycData({ storeGeo: { ...kycData.storeGeo, lng: e.target.value } })}
            />
          </div>
          {errors.storeGeoLat && <div className="text-xs text-red-600 mt-1">{errors.storeGeoLat}</div>}
          {errors.storeGeoLng && <div className="text-xs text-red-600 mt-1">{errors.storeGeoLng}</div>}
        </div>
      </div>
    </form>
  );
};

export default StepStoreDetails; 