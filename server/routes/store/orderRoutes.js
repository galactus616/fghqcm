const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/store/orderController');
const storeOwnerAuthMiddleware = require('../../middleware/storeOwnerAuthMiddleware');

router.get('/', storeOwnerAuthMiddleware, orderController.getStoreOrders);
router.put('/:orderId/item/:itemId/status', storeOwnerAuthMiddleware, orderController.updateOrderItemStatus);

module.exports = router;
