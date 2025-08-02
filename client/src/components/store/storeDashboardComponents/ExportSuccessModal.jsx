import React from 'react';
import { CheckCircle, Download, X } from 'lucide-react';

const ExportSuccessModal = ({ isOpen, onClose, exportCount, fileName }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-sans"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Export Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Your order details have been successfully exported to Excel.
          </p>

          {/* Export Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Download className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                {exportCount} orders exported
              </span>
            </div>
            <p className="text-xs text-gray-500">
              File: {fileName}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportSuccessModal; 