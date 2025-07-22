const Store = require('../../models/Store');
const StoreKYC = require('../../models/StoreKYC');

//
// Create a new store for the current store owner (if KYC approved)
// Route: POST /api/store
// Access: Private (StoreOwner)
// Body: { name, address, contact }
// Returns: { message, store }
//
exports.createStore = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const kyc = await StoreKYC.findOne({ userId: storeOwnerId });
  if (!kyc || kyc.status !== 'approved') {
    return res.status(403).json({ message: 'KYC not approved' });
  }
  const { name, address, contact } = req.body;
  let store = await Store.findOne({ owner: storeOwnerId });
  if (store) {
    return res.status(400).json({ message: 'Store already exists' });
  }
  store = new Store({ name, owner: storeOwnerId, address, contact });
  await store.save();
  kyc.storeId = store._id;
  await kyc.save();
  res.json({ message: 'Store created', store });
};

//
// Get the current store owner's store
// Route: GET /api/store/my
// Access: Private (StoreOwner)
// Returns: { store }
//
exports.getMyStore = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const store = await Store.findOne({ owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });
  res.json({ store });
};

//
// Update the current store owner's store
// Route: PUT /api/store/:storeId
// Access: Private (StoreOwner)
// Body: { name, address, contact }
// Returns: { message, store }
//
exports.updateStore = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const { storeId } = req.params;
  const store = await Store.findOne({ _id: storeId, owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });
  const { name, address, contact } = req.body;
  if (name) store.name = name;
  if (address) store.address = address;
  if (contact) store.contact = contact;
  await store.save();
  res.json({ message: 'Store updated', store });
};
