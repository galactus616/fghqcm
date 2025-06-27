const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticateToken, getCart);
router.post("/", authenticateToken, addToCart);
router.put("/:productId", authenticateToken, updateCartItemQuantity);
router.delete("/:productId", authenticateToken, removeFromCart);
router.delete("/", authenticateToken, clearCart);

module.exports = router;
