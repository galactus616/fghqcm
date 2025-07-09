const express = require("express");
const {
  placeOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const { sensitiveLimiter } = require('../middleware/rateLimiters');
const { orderValidation, handleValidation } = require('../middleware/validation');
const router = express.Router();

router.post("/", sensitiveLimiter, authenticateToken, orderValidation, handleValidation, placeOrder);
router.get("/", sensitiveLimiter, authenticateToken, getOrders);
router.get("/:orderId", sensitiveLimiter, authenticateToken, getOrderById);

module.exports = router;
