const StoreKYC = require('../../models/StoreKYC');
const StoreOwner = require('../../models/StoreOwner');
const Store = require('../../models/Store');
const logger = require('../../config/logger');

//
// Submit or update KYC for the current store owner
// Route: POST /api/store/kyc/submit
// Access: Private (StoreOwner)
// Body: KYC fields (see StoreKYC model)
// Returns: { message, kyc }
//
exports.submitKyc = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const data = req.body;
  
  // Check if KYC is already approved
  const storeOwner = await StoreOwner.findById(storeOwnerId);
  if (storeOwner.kycStatus === 'approved') {
    return res.status(400).json({ message: 'KYC already approved' });
  }
  
  let kyc = await StoreKYC.findOne({ userId: storeOwnerId });
  if (!kyc) {
    kyc = new StoreKYC({ userId: storeOwnerId, ...data });
  } else {
    Object.assign(kyc, data);
  }
  await kyc.save();
  
  // Update StoreOwner's kycStatus and kycId fields
  await StoreOwner.findByIdAndUpdate(storeOwnerId, {
    kycStatus: 'pending',
    kycId: kyc._id
  });
  
  // Log KYC submission
  logger.info("KYC submitted", {
    storeOwnerId: storeOwnerId.toString(),
    kycId: kyc._id.toString(),
    status: 'pending'
  });
  
  res.json({ message: 'KYC submitted', kyc });
};

//
// Get KYC status for the current store owner
// Route: GET /api/store/kyc/status
// Access: Private (StoreOwner)
// Returns: { status, kyc }
//
exports.getKycStatus = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const storeOwner = await StoreOwner.findById(storeOwnerId);
  const kyc = await StoreKYC.findOne({ userId: storeOwnerId });
  
  if (!kyc) return res.json({ status: 'not_submitted' });
  res.json({ status: storeOwner.kycStatus, kyc });
};

//
// Admin approve KYC
// Route: PUT /api/store/kyc/:kycId/approve
// Access: Private (Admin)
// Returns: { message, kyc }
//
exports.approveKyc = async (req, res) => {
  const { kycId } = req.params;
  const kyc = await StoreKYC.findById(kycId);
  if (!kyc) return res.status(404).json({ message: 'KYC not found' });
  
  kyc.reviewedAt = new Date();
  await kyc.save();
  
  // Update StoreOwner's kycStatus to approved when admin approves
  await StoreOwner.findByIdAndUpdate(kyc.userId, {
    kycStatus: 'approved'
  });
  
  // Check if store already exists for this store owner
  let store = await Store.findOne({ owner: kyc.userId });
  
  // If no store exists, create one automatically using KYC data
  if (!store) {
    store = new Store({
      name: kyc.storeName || 'My Store',
      owner: kyc.userId,
      address: kyc.storeAddress || '',
      contact: kyc.storePhone || ''
    });
    await store.save();
    
    // Link the store to the KYC
    kyc.storeId = store._id;
    await kyc.save();
    
    // Log store creation
    logger.info("Store created automatically after KYC approval", {
      storeId: store._id.toString(),
      storeOwnerId: kyc.userId.toString(),
      storeName: store.name,
      kycId: kycId
    });
  }
  
  // Log KYC approval
  logger.info("KYC approved", {
    kycId: kycId,
    storeOwnerId: kyc.userId.toString(),
    status: 'approved',
    reviewedAt: kyc.reviewedAt,
    storeId: store?._id?.toString()
  });
  
  res.json({ message: 'KYC approved', kyc, store });
};