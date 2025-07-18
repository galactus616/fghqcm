const express = require("express");
const { generateRecipe } = require("../../controllers/user/geminiController");
const authenticateToken = require("../../middleware/authMiddleware"); // Optional, if you want only logged-in users to generate recipes
const { sensitiveLimiter } = require('../../middleware/rateLimiters');
const router = express.Router();

router.post("/generate-recipe", sensitiveLimiter, authenticateToken, generateRecipe);

module.exports = router;
