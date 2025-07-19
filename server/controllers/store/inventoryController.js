const Inventory = require('../../models/Inventory');
const Store = require('../../models/Store');
const Product = require('../../models/Product');

//
// Get all inventory items for the current store owner
// Route: GET /api/inventory/my
// Access: Private (StoreOwner)
// Returns: { inventory }
//
exports.getMyInventory = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const store = await Store.findOne({ owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });
  const inventory = await Inventory.find({ storeId: store._id, isActive: true }).populate('productId');
  res.json({ inventory });
};

//
// Add a product to the current store owner's inventory
// Route: POST /api/inventory
// Access: Private (StoreOwner)
// Body: { productId, stock }
// Returns: { message, inventory }
//
exports.addToInventory = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const store = await Store.findOne({ owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });
  const { productId, stock } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  let inv = await Inventory.findOne({ storeId: store._id, productId });
  if (inv) {
    if (inv.isActive) return res.status(400).json({ message: 'Product already in inventory' });
    inv.isActive = true;
    inv.stock = stock;
  } else {
    inv = new Inventory({ storeId: store._id, productId, stock, isActive: true });
  }
  await inv.save();
  res.json({ message: 'Product added to inventory', inventory: inv });
};

//
// Update an inventory item for the current store owner
// Route: PUT /api/inventory/:inventoryId
// Access: Private (StoreOwner)
// Body: { stock, isActive }
// Returns: { message, inventory }
//
exports.updateInventory = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const { inventoryId } = req.params;
  const store = await Store.findOne({ owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });
  const inv = await Inventory.findOne({ _id: inventoryId, storeId: store._id });
  if (!inv) return res.status(404).json({ message: 'Inventory item not found' });
  const { stock, isActive } = req.body;
  if (typeof stock === 'number') inv.stock = stock;
  if (typeof isActive === 'boolean') inv.isActive = isActive;
  await inv.save();
  res.json({ message: 'Inventory updated', inventory: inv });
};

//
// Remove (deactivate) an inventory item for the current store owner
// Route: DELETE /api/inventory/:inventoryId
// Access: Private (StoreOwner)
// Returns: { message }
//
exports.removeFromInventory = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const { inventoryId } = req.params;
  const store = await Store.findOne({ owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });
  const inv = await Inventory.findOne({ _id: inventoryId, storeId: store._id });
  if (!inv) return res.status(404).json({ message: 'Inventory item not found' });
  inv.isActive = false;
  await inv.save();
  res.json({ message: 'Product removed from inventory' });
};
