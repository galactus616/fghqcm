const express = require("express");
const {
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategoryId,
} = require("../controllers/productController");
const router = express.Router();

router.get("/categories", getAllCategories);
router.get("/categories/:categoryId/products", getProductsByCategoryId);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;
