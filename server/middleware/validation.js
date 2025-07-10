const { body, validationResult, param } = require('express-validator');

// Validation chains
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('variantIndex').isInt({ min: 0 }).withMessage('Valid variantIndex is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const orderValidation = [
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
];

// Handler to check validation result
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  addToCartValidation,
  orderValidation,
  handleValidation,
}; 