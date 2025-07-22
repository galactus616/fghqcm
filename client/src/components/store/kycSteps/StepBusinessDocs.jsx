import React, { useState } from 'react';
import { uploadToCloudinary } from '../../../utils/cloudinary';

const StepBusinessDocs = ({ kycData, updateKycData, errors = {} }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadToCloudinary(file);
      updateKycData({ tradeLicenseImage: url });
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
      updateKycData({ tradeLicenseImage: '' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-8">
      <h2 className="text-2xl font-bold mb-2 text-green-800">Business Documents</h2>
      <p className="text-gray-500 mb-8">Upload your business documents for verification.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block font-semibold mb-2 text-green-700">Trade License Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition placeholder-gray-400 shadow-sm"
            placeholder="Trade license number"
            required
            value={kycData.tradeLicenseNumber || ''}
            onChange={e => updateKycData({ tradeLicenseNumber: e.target.value })}
          />
          {errors.tradeLicenseNumber && <div className="text-xs text-red-600 mt-1">{errors.tradeLicenseNumber}</div>}
        </div>
        <div>
          <label className="block font-semibold mb-2 text-green-700">Upload Trade License <span className="text-red-500">*</span></label>
          <input
            type="file"
            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700"
            accept="image/*,application/pdf"
            required
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
          {uploadError && <div className="text-xs text-red-600 mt-1">{uploadError}</div>}
          {kycData.tradeLicenseImage && typeof kycData.tradeLicenseImage === 'string' && (
            <div className="text-xs text-green-700 mt-2">File uploaded <a href={kycData.tradeLicenseImage} target="_blank" rel="noopener noreferrer" className="underline ml-2">View</a></div>
          )}
          {errors.tradeLicenseImage && <div className="text-xs text-red-600 mt-1">{errors.tradeLicenseImage}</div>}
        </div>
      </div>
    </form>
  );
};

export default StepBusinessDocs; 