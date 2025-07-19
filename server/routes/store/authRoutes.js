const express = require('express');
const router = express.Router();
const storeOwnerAuthController = require('../../controllers/store/authController');
const storeOwnerAuthMiddleware = require('../../middleware/storeOwnerAuthMiddleware');

router.post('/register', storeOwnerAuthController.register);
router.post('/login/request-otp', storeOwnerAuthController.requestOtp);
router.post('/login/verify-otp', storeOwnerAuthController.verifyOtp);
router.post('/logout', storeOwnerAuthMiddleware, storeOwnerAuthController.logout);
router.get('/profile', storeOwnerAuthMiddleware, storeOwnerAuthController.profile);

module.exports = router;