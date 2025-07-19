const jwt = require('jsonwebtoken');
const StoreOwner = require('../models/StoreOwner');

module.exports = async (req, res, next) => {
  const token = req.cookies && req.cookies.store_owner_token;
  if (!token) return res.status(401).json({ message: 'Store owner authentication required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'storeOwner') return res.status(401).json({ message: 'Invalid token type' });
    const storeOwner = await StoreOwner.findById(decoded.id);
    if (!storeOwner) return res.status(404).json({ message: 'Store owner not found' });
    req.storeOwner = { id: storeOwner._id, email: storeOwner.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}; 