const express = require("express");
const {
  getAllProducts,
  getProductById,
  getMainCategories,
  getSubCategories,
  getProductsByCategoryId,
  getRelatedProducts,
} = require("../../controllers/common/productController");
const router = express.Router();

// Category routes
router.get("/categories/main", getMainCategories);
router.get("/categories/:mainCategoryId/subcategories", getSubCategories);
router.get("/categories/:categoryId/products", getProductsByCategoryId);

// Product routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

module.exports = router;
