const StoreKYC = require('../../models/StoreKYC');

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
  let kyc = await StoreKYC.findOne({ userId: storeOwnerId });
  if (kyc && kyc.status === 'approved') {
    return res.status(400).json({ message: 'KYC already approved' });
  }
  if (!kyc) {
    kyc = new StoreKYC({ userId: storeOwnerId, ...data, status: 'pending' });
  } else {
    Object.assign(kyc, data, { status: 'pending' });
  }
  await kyc.save();
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
  const kyc = await StoreKYC.findOne({ userId: storeOwnerId });
  if (!kyc) return res.json({ status: 'not_submitted' });
  res.json({ status: kyc.status, kyc });
};