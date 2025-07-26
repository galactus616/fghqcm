const express = require('express');
const router = express.Router();
const kycController = require('../../controllers/store/kycController');
const storeOwnerAuthMiddleware = require('../../middleware/storeOwnerAuthMiddleware');

router.post('/submit', storeOwnerAuthMiddleware, kycController.submitKyc);
router.get('/status', storeOwnerAuthMiddleware, kycController.getKycStatus);
router.put('/:kycId/approve', kycController.approveKyc);

module.exports = router; 