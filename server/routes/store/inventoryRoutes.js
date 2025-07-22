const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/store/inventoryController');
const storeOwnerAuthMiddleware = require('../../middleware/storeOwnerAuthMiddleware');

router.get('/my', storeOwnerAuthMiddleware, inventoryController.getMyInventory);
router.post('/', storeOwnerAuthMiddleware, inventoryController.addToInventory);
router.put('/:inventoryId', storeOwnerAuthMiddleware, inventoryController.updateInventory);
router.delete('/:inventoryId', storeOwnerAuthMiddleware, inventoryController.removeFromInventory);

module.exports = router;
