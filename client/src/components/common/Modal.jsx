import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-white/55 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">{title}</h2>
        <div className="mt-4 text-gray-700 text-sm leading-relaxed overflow-y-auto max-h-[70vh] whitespace-pre-line">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;