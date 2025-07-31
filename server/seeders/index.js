require("dotenv").config();
const connectDB = require("../config/db");

// Import Models
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Store = require("../models/Store");
const StoreOwner = require("../models/StoreOwner");
const StoreKYC = require("../models/StoreKYC");
const Inventory = require("../models/Inventory");

// Import Helpers
const { clearDatabase, insertCategories, insertProducts } = require('./helpers');

// Import Data
const mainCategories = require('./mainCategories');
const subCategories = require('./subCategories');
const products = require('./products');

// Models object for helper functions
const models = {
  User,
  Product,
  Category,
  Cart,
  Order,
  Store,
  StoreOwner,
  StoreKYC,
  Inventory
};

const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearDatabase(models);
    
    // Insert main categories first
    console.log("📂 Inserting main categories...");
    const { categories: insertedMainCategories, categoryMap: mainCategoryMap } = await insertCategories(mainCategories, Category);
    console.log(`✅ ${insertedMainCategories.length} main categories inserted!`);
    
    // Insert sub categories (if any)
    if (subCategories.length > 0) {
      console.log("📂 Inserting sub categories...");
      // Map parent category names to ObjectIds for subcategories
      const subCategoriesWithParents = subCategories.map(subCat => ({
        ...subCat,
        parentCategory: mainCategoryMap[subCat.parentCategory]
      }));
      
      const { categories: insertedSubCategories, categoryMap: subCategoryMap } = await insertCategories(subCategoriesWithParents, Category);
      console.log(`✅ ${insertedSubCategories.length} sub categories inserted!`);
      
      // Merge category maps
      const allCategoryMap = { ...mainCategoryMap, ...subCategoryMap };
      
      // Insert products with category references
      if (products.length > 0) {
        await insertProducts(products, Product, allCategoryMap);
      }
    } else {
      // If no subcategories, use main categories for products
      if (products.length > 0) {
        await insertProducts(products, Product, mainCategoryMap);
      }
    }
    
    // Create test user
    console.log("👤 Creating test user...");
    const testUser = await User.create({
      name: "Test User",
      phone: "9876543210",
      email: "test@example.com",
      isPhoneVerified: true,
      addresses: [
        {
          label: "Home",
          flat: "Apt 4B",
          floor: "4th Floor",
          area: "Gulshan-2",
          landmark: "Near Gulshan Circle",
          isDefault: true
        }
      ]
    });
    console.log("✅ Test user created!");
    
    // Create test store owner
    console.log("🏪 Creating test store owner...");
    const testStoreOwner = await StoreOwner.create({
      name: "Test Store Owner",
      email: "store@example.com",
      kycStatus: "approved"
    });
    console.log("✅ Test store owner created!");
    
    // Create test store
    console.log("🏪 Creating test store...");
    const testStore = await Store.create({
      name: "Test Store",
      owner: testStoreOwner._id,
      address: "123 Test Street, Dhaka",
      contact: "9876543210"
    });
    console.log("✅ Test store created!");
    
    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Main Categories: ${mainCategories.length}`);
    console.log(`   - Sub Categories: ${subCategories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Test User: ${testUser.phone}`);
    console.log(`   - Test Store Owner: ${testStoreOwner.email}`);
    console.log(`   - Test Store: ${testStore.name}`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding process completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
