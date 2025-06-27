const express = require("express");
const {
  placeOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateToken, placeOrder);
router.get("/", authenticateToken, getOrders);
router.get("/:orderId", authenticateToken, getOrderById);

module.exports = router;
