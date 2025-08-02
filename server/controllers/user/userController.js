const User = require('../../models/User');
const logger = require('../../config/logger');

// Get all addresses for the logged-in user
exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (err) {
    next(err);
  }
};

// Add a new address
exports.addAddress = async (req, res, next) => {
  try {
    const { label = 'Home', flat = '', floor = '', area = '', landmark = '', isDefault = false } = req.body;
    if (!flat && !area) return res.status(400).json({ message: 'Flat and area are required' });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Limit max addresses (e.g., 10)
    if (user.addresses.length >= 10) return res.status(400).json({ message: 'Maximum 10 addresses allowed' });
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    user.addresses.push({ label, flat, floor, area, landmark, isDefault });
    await user.save();
    
    // Log address addition
    logger.info("User address added", {
      userId: req.user._id.toString(),
      addressLabel: label,
      isDefault
    });
    
    res.status(201).json(user.addresses);
  } catch (err) {
    logger.error("Error adding user address", {
      userId: req.user._id.toString(),
      error: err.message
    });
    next(err);
  }
};

// Update an address
exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { label, flat, floor, area, landmark, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    if (label !== undefined) addr.label = label;
    if (flat !== undefined) addr.flat = flat;
    if (floor !== undefined) addr.floor = floor;
    if (area !== undefined) addr.area = area;
    if (landmark !== undefined) addr.landmark = landmark;
    if (isDefault !== undefined && isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      addr.isDefault = true;
    }
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    next(err);
  }
};

// Delete an address
exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Remove address using filter for better compatibility
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    next(err);
  }
};

// Set an address as default
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.addresses.forEach(addr => addr.isDefault = false);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    addr.isDefault = true;
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    next(err);
  }
}; 