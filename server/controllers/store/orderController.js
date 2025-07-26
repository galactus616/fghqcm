const Order = require('../../models/Order');
const Store = require('../../models/Store');

// Get all orders for the current store owner's store
// Route: GET /api/store/orders
// Access: Private (StoreOwner)
// Returns: { orders }
exports.getStoreOrders = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;

  const store = await Store.findOne({ owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });

  const orders = await Order.find({ 'items.storeId': store._id }).lean();

  const filteredOrders = orders.map(order => {
    const items = order.items.filter(item => item.storeId.toString() === store._id.toString());
    return { ...order, items };
  });
  
  res.json({ orders: filteredOrders });
};

// Update the status of an order for the current store owner's store
// Route: PUT /api/store/orders/:orderId/status
// Access: Private (StoreOwner)
// Body: { status }
// Returns: { message, order }
exports.updateOrderStatus = async (req, res) => {
  const storeOwnerId = req.storeOwner.id;
  const { orderId } = req.params;
  const { status } = req.body;

  const store = await Store.findOne({ owner: storeOwnerId });
  if (!store) return res.status(404).json({ message: 'Store not found' });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  // Optionally, check if the order contains items from this store
  // (if multi-store orders are supported)

  order.status = status;
  await order.save();

  res.json({ message: 'Order status updated', order });
};
