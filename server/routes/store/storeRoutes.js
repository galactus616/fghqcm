const express = require('express');
const router = express.Router();
const storeController = require('../../controllers/store/storeController');
const storeOwnerAuthMiddleware = require('../../middleware/storeOwnerAuthMiddleware');

router.post('/', storeOwnerAuthMiddleware, storeController.createStore);
router.get('/my', storeOwnerAuthMiddleware, storeController.getMyStore);
router.put('/:storeId', storeOwnerAuthMiddleware, storeController.updateStore);

module.exports = router;
