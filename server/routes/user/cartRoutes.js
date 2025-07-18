const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  mergeCart,
} = require("../../controllers/user/cartController");
const authenticateToken = require("../../middleware/authMiddleware");
const { sensitiveLimiter } = require('../../middleware/rateLimiters');
const { addToCartValidation, handleValidation } = require('../../middleware/validation');
const router = express.Router();

router.get("/", sensitiveLimiter, authenticateToken, getCart);
router.post("/", sensitiveLimiter, authenticateToken, addToCartValidation, handleValidation, addToCart);
router.post("/merge", sensitiveLimiter, authenticateToken, mergeCart);
router.put("/:productId", sensitiveLimiter, authenticateToken, updateCartItemQuantity);
router.delete("/:productId", sensitiveLimiter, authenticateToken, removeFromCart);
router.delete("/", sensitiveLimiter, authenticateToken, clearCart);

module.exports = router;
