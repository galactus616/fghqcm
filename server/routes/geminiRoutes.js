const express = require("express");
const { generateRecipe } = require("../controllers/geminiController");
const authenticateToken = require("../middleware/authMiddleware"); // Optional, if you want only logged-in users to generate recipes
const router = express.Router();

router.post("/generate-recipe", authenticateToken, generateRecipe);

module.exports = router;
