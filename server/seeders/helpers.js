const mongoose = require('mongoose');

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to slug
 * @returns {string} - The slug
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

/**
 * Generate product variants based on base price and labels
 * @param {number} basePrice - Base price for the product
 * @param {string[]} labels - Array of quantity labels
 * @param {number} discount - Discount percentage (0.1 = 10%)
 * @returns {Array} - Array of variant objects
 */
const makeVariants = (basePrice, labels = ["Default"], discount = 0.1) => {
  return labels.map((label, idx) => {
    const price = Math.round(basePrice * (1 + idx * 0.2)); // Increase price for larger quantities
    const discountedPrice = Math.round(price * (1 - discount));
    return {
      quantityLabel: label,
      price: price,
      discountedPrice: discountedPrice,
    };
  });
};

/**
 * Generate multiple images array from a main image URL
 * @param {string} mainUrl - Main image URL
 * @returns {Array} - Array of image URLs
 */
const makeImages = (mainUrl) => [
  mainUrl,
  mainUrl,
  mainUrl,
  mainUrl,
];

/**
 * Generate a random price within a range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @returns {number} - Random price
 */
const randomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random boolean with given probability
 * @param {number} probability - Probability of true (0-1)
 * @returns {boolean} - Random boolean
 */
const randomBoolean = (probability = 0.3) => {
  return Math.random() < probability;
};

/**
 * Generate a random date within a range
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date} - Random date
 */
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Create a product object with all required fields
 * @param {Object} productData - Product data
 * @returns {Object} - Formatted product object
 */
const createProduct = (productData) => {
  const {
    name,
    mainCategory,
    subCategory,
    basePrice,
    imageUrl,
    description,
    variants = ["Default"],
    discount = 0.1,
    isBestSeller = false,
    isFeatured = false
  } = productData;

  const productVariants = makeVariants(basePrice, variants, discount);
  
  return {
    name,
    mainCategory,
    subCategory,
    imageUrl,
    images: makeImages(imageUrl),
    description,
    variants: productVariants,
    isBestSeller: isBestSeller || randomBoolean(0.2),
    isFeatured: isFeatured || randomBoolean(0.15),
    isActive: true,
    createdAt: randomDate(new Date(2024, 0, 1), new Date())
  };
};

/**
 * Create a category object with all required fields
 * @param {Object} categoryData - Category data
 * @returns {Object} - Formatted category object
 */
const createCategory = (categoryData) => {
  const {
    name,
    imageUrl,
    level = 1,
    parentCategory = null,
    sortOrder = 0
  } = categoryData;

  return {
    name,
    slug: generateSlug(name),
    imageUrl,
    level,
    parentCategory,
    isActive: true,
    sortOrder,
    createdAt: new Date()
  };
};

/**
 * Clear all collections from database
 * @param {Object} models - Object containing all models
 */
const clearDatabase = async (models) => {
  const { User, Product, Category, Cart, Order, Store, StoreOwner, StoreKYC, Inventory } = models;
  
  console.log("🗑️ Clearing old data...");
  
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Store.deleteMany({});
  await StoreOwner.deleteMany({});
  await StoreKYC.deleteMany({});
  await Inventory.deleteMany({});
  
  console.log("✅ Old data cleared!");
};

/**
 * Insert categories and return a map for easy reference
 * @param {Array} categories - Array of category objects
 * @param {Object} Category - Category model
 * @returns {Object} - Map of category name to ObjectId
 */
const insertCategories = async (categories, Category) => {
  console.log("📂 Inserting categories...");
  
  const insertedCategories = await Category.insertMany(categories);
  console.log(`✅ ${insertedCategories.length} categories inserted!`);
  
  // Create a mapping from category name to its ObjectId
  const categoryMap = {};
  insertedCategories.forEach(cat => {
    categoryMap[cat.name] = cat._id;
  });
  
  return { categories: insertedCategories, categoryMap };
};

/**
 * Insert products with category references
 * @param {Array} products - Array of product objects
 * @param {Object} Product - Product model
 * @param {Object} categoryMap - Map of category names to ObjectIds
 * @returns {Array} - Inserted products
 */
const insertProducts = async (products, Product, categoryMap) => {
  console.log("📦 Inserting products...");
  
  // Map category names to ObjectIds
  const validProducts = products.map(product => ({
    ...product,
    mainCategory: categoryMap[product.mainCategory],
    subCategory: categoryMap[product.subCategory]
  })).filter(product => product.mainCategory && product.subCategory);
  
  const insertedProducts = await Product.insertMany(validProducts);
  console.log(`✅ ${insertedProducts.length} products inserted!`);
  
  return insertedProducts;
};

module.exports = {
  generateSlug,
  makeVariants,
  makeImages,
  randomPrice,
  randomBoolean,
  randomDate,
  createProduct,
  createCategory,
  clearDatabase,
  insertCategories,
  insertProducts
};
