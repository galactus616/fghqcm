const express = require('express');
const router = express.Router();
const locationController = require('../../controllers/common/locationController');

router.get('/location', locationController.getLocation);

module.exports = router; 