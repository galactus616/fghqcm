// KYC validation utility for multi-step form

export function validateStepOwnerDetails(data) {
  const errors = {};
  if (!data.ownerName?.trim()) errors.ownerName = 'Full Name is required';
  if (!/^01\d{9}$/.test(data.ownerPhone || '')) errors.ownerPhone = 'Valid phone required (e.g. 017XXXXXXXX)';
  if (!/^\d{10,17}$/.test(data.ownerNID || '')) errors.ownerNID = 'Valid NID required (10-17 digits)';
  if (!((typeof data.ownerNIDImage === 'string' && data.ownerNIDImage.startsWith('http')) || (data.ownerNIDImage instanceof File))) errors.ownerNIDImage = 'NID image is required';
  if (data.ownerNIDImage instanceof File) {
    if (!['image/jpeg', 'image/png'].includes(data.ownerNIDImage.type)) errors.ownerNIDImage = 'Only JPG/PNG allowed';
    if (data.ownerNIDImage.size > 2 * 1024 * 1024) errors.ownerNIDImage = 'Max size 2MB';
  }
  return errors;
}

export function validateStepStoreDetails(data) {
  const errors = {};
  if (!data.storeName?.trim()) errors.storeName = 'Store Name is required';
  if (!data.storeType) errors.storeType = 'Store Type is required';
  if (!data.storeAddress?.trim()) errors.storeAddress = 'Store Address is required';
  if (!/^01\d{9}$/.test(data.storePhone || '')) errors.storePhone = 'Valid phone required (e.g. 017XXXXXXXX)';
  if (data.storePhoto && !((typeof data.storePhoto === 'string' && data.storePhoto.startsWith('http')) || (data.storePhoto instanceof File))) errors.storePhoto = 'Please re-upload the store photo';
  if (data.storePhoto instanceof File) {
    if (!['image/jpeg', 'image/png'].includes(data.storePhoto.type)) errors.storePhoto = 'Only JPG/PNG allowed';
    if (data.storePhoto.size > 2 * 1024 * 1024) errors.storePhoto = 'Max size 2MB';
  }
  if (data.storeGeo) {
    if (data.storeGeo.lat && isNaN(Number(data.storeGeo.lat))) errors.storeGeoLat = 'Latitude must be a number';
    if (data.storeGeo.lng && isNaN(Number(data.storeGeo.lng))) errors.storeGeoLng = 'Longitude must be a number';
  }
  return errors;
}

export function validateStepBusinessDocs(data) {
  const errors = {};
  if (!data.tradeLicenseNumber?.trim()) errors.tradeLicenseNumber = 'Trade License Number is required';
  if (!((typeof data.tradeLicenseImage === 'string' && data.tradeLicenseImage.startsWith('http')) || (data.tradeLicenseImage instanceof File))) errors.tradeLicenseImage = 'Trade License image is required';
  if (data.tradeLicenseImage instanceof File) {
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(data.tradeLicenseImage.type)) errors.tradeLicenseImage = 'Only JPG/PNG/PDF allowed';
    if (data.tradeLicenseImage.size > 2 * 1024 * 1024) errors.tradeLicenseImage = 'Max size 2MB';
  }
  return errors;
}

export function validateStepBankPayout(data) {
  const errors = {};
  if (!data.bankAccountName?.trim()) errors.bankAccountName = 'Account Holder Name is required';
  if (!/^\d{8,20}$/.test(data.bankAccountNumber || '')) errors.bankAccountNumber = 'Valid Account Number required (8-20 digits)';
  if (!data.bankName?.trim()) errors.bankName = 'Bank Name is required';
  if (data.digitalWallet && !/^01\d{9}$/.test(data.digitalWallet)) errors.digitalWallet = 'Valid bKash/Nagad number required (e.g. 017XXXXXXXX)';
  return errors;
}

export function validateStepDeliveryOps(data) {
  const errors = {};
  if (data.operatingHours && !data.operatingHours.trim()) errors.operatingHours = 'Operating Hours cannot be empty';
  if (data.deliveryArea && !data.deliveryArea.trim()) errors.deliveryArea = 'Delivery Area cannot be empty';
  return errors;
}

export const stepValidators = [
  validateStepOwnerDetails,
  validateStepStoreDetails,
  validateStepBusinessDocs,
  validateStepBankPayout,
  validateStepDeliveryOps,
  () => ({}), // Review step: no validation
]; 