const express = require("express");
const {
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategory,
} = require("../controllers/productController");
const router = express.Router();

router.get("/categories", getAllCategories); // Place before /:id
router.get("/category/:categoryName", getProductsByCategory); // Place before /:id
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;
