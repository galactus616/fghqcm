require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

// Import Models
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const dummyData = async () => {
  await connectDB();

  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log("Old data cleared!");

    // qCommerce-style categories
    const categories = await Category.insertMany([
      {
        name: "Fruits & Vegetables",
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Dairy & Bakery",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Snacks & Munchies",
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Beverages",
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Instant Food",
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Atta, Rice & Dal",
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Oils & Masala",
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Sweets & Chocolates",
        imageUrl:
          "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Personal Care",
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Home Care",
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Baby Care",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Meat, Eggs & Seafood",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Frozen Food",
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Pet Care",
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80",
      },
    ]);
    console.log("Categories seeded!");

    // qCommerce-style products
    const products = await Product.insertMany([
      // Fruits & Vegetables
      {
        name: "Banana (1 Dozen)",
        category: "Fruits & Vegetables",
        price: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
        description: "Fresh bananas, perfect for a healthy snack.",
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Tomato (1kg)",
        category: "Fruits & Vegetables",
        price: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description: "Juicy, ripe tomatoes for salads and cooking.",
        isBestSeller: false,
        isFeatured: false,
      },
      // Dairy & Bakery
      {
        name: "Brown Bread (400g)",
        category: "Dairy & Bakery",
        price: 45,
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80",
        description: "Soft and healthy brown bread.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Milk (Toned, 1L)",
        category: "Dairy & Bakery",
        price: 55,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        description: "Fresh toned milk, 1 litre pack.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Snacks & Munchies
      {
        name: "Potato Chips (200g)",
        category: "Snacks & Munchies",
        price: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
        description: "Crispy potato chips, lightly salted.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Salted Peanuts (250g)",
        category: "Snacks & Munchies",
        price: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Crunchy salted peanuts, perfect for snacking.",
        isBestSeller: false,
        isFeatured: false,
      },
      // Beverages
      {
        name: "Orange Juice (1L)",
        category: "Beverages",
        price: 90,
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description: "Refreshing orange juice, no added sugar.",
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Green Tea (25 bags)",
        category: "Beverages",
        price: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        description: "Antioxidant-rich green tea bags.",
        isBestSeller: false,
        isFeatured: false,
      },
      // Breakfast & Instant Food
      {
        name: "Oats (1kg)",
        category: "Breakfast & Instant Food",
        price: 110,
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80",
        description: "Healthy oats for a quick breakfast.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Instant Noodles (70g)",
        category: "Breakfast & Instant Food",
        price: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        description: "Tasty instant noodles, ready in 2 minutes.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Atta, Rice & Dal
      {
        name: "Basmati Rice (5kg)",
        category: "Atta, Rice & Dal",
        price: 350,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Premium long-grain basmati rice.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Moong Dal (1kg)",
        category: "Atta, Rice & Dal",
        price: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description: "Protein-rich moong dal.",
        isBestSeller: false,
        isFeatured: false,
      },
      // Oils & Masala
      {
        name: "Sunflower Oil (1L)",
        category: "Oils & Masala",
        price: 130,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        description: "Refined sunflower oil for healthy cooking.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Garam Masala (100g)",
        category: "Oils & Masala",
        price: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80",
        description: "Aromatic garam masala blend.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Sweets & Chocolates
      {
        name: "Milk Chocolate (100g)",
        category: "Sweets & Chocolates",
        price: 80,
        imageUrl:
          "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80",
        description: "Smooth and creamy milk chocolate.",
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Rasgulla (12 pcs)",
        category: "Sweets & Chocolates",
        price: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        description: "Traditional Bengali rasgulla sweets.",
        isBestSeller: false,
        isFeatured: false,
      },
      // Personal Care
      {
        name: "Toothpaste (150g)",
        category: "Personal Care",
        price: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        description: "Fluoride toothpaste for healthy teeth.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Shampoo (200ml)",
        category: "Personal Care",
        price: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80",
        description: "Gentle shampoo for daily use.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Home Care
      {
        name: "Dishwash Liquid (750ml)",
        category: "Home Care",
        price: 99,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Effective dishwash liquid for sparkling utensils.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Toilet Cleaner (1L)",
        category: "Home Care",
        price: 110,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        description: "Powerful toilet cleaner for hygiene.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Baby Care
      {
        name: "Baby Diapers (Pack of 20)",
        category: "Baby Care",
        price: 320,
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        description: "Soft and absorbent baby diapers.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Baby Lotion (200ml)",
        category: "Baby Care",
        price: 180,
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80",
        description: "Gentle lotion for baby's skin.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Meat, Eggs & Seafood
      {
        name: "Farm Fresh Eggs (12 pcs)",
        category: "Meat, Eggs & Seafood",
        price: 85,
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        description: "Large, brown, farm-fresh eggs.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Chicken Breast (500g)",
        category: "Meat, Eggs & Seafood",
        price: 220,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Boneless chicken breast, fresh and tender.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Frozen Food
      {
        name: "Frozen Peas (500g)",
        category: "Frozen Food",
        price: 70,
        imageUrl:
          "https://images.unsplash.com/photo-1606811842443-cde03d2feabe?auto=format&fit=crop&w=400&q=80",
        description: "Green peas, frozen for convenience.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Frozen Paratha (6 pcs)",
        category: "Frozen Food",
        price: 90,
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        description: "Ready-to-cook frozen parathas.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Pet Care
      {
        name: "Dog Food (1kg)",
        category: "Pet Care",
        price: 250,
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
        description: "Nutritious dog food for all breeds.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Cat Litter (5kg)",
        category: "Pet Care",
        price: 180,
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description: "Odor control cat litter.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Gourmet & World Food
      {
        name: "Pasta (500g)",
        category: "Gourmet & World Food",
        price: 90,
        imageUrl:
          "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80",
        description: "Premium Italian pasta.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Olive Oil (250ml)",
        category: "Gourmet & World Food",
        price: 210,
        imageUrl:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        description: "Extra virgin olive oil.",
        isBestSeller: false,
        isFeatured: true,
      },
      // Stationery & Office
      {
        name: "A4 Notebook (200 pages)",
        category: "Stationery & Office",
        price: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description: "A4 size ruled notebook for school/office.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Ballpoint Pens (Pack of 10)",
        category: "Stationery & Office",
        price: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Smooth writing ballpoint pens.",
        isBestSeller: false,
        isFeatured: true,
      },
    ]);
    console.log("Products seeded!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      address: "123 Main St, Anytown, CA 90210",
      phone: "9876543210",
    });
    console.log("Dummy user seeded!");

    const dummyCart = await Cart.create({
      userId: user._id,
      items: [
        { productId: products[0]._id, quantity: 2 },
        { productId: products[5]._id, quantity: 1 },
      ],
    });
    console.log("Dummy cart seeded!");

    await Order.insertMany([
      {
        userId: user._id,
        orderId: `ORD-${Date.now()}-001`,
        date: new Date("2025-06-25"),
        total: 250,
        status: "Delivered",
        items: [
          {
            product: {
              id: products[0]._id,
              name: products[0].name,
              price: products[0].price,
              imageUrl: products[0].imageUrl,
            },
            quantity: 2,
          },
          {
            product: {
              id: products[5]._id,
              name: products[5].name,
              price: products[5].price,
              imageUrl: products[5].imageUrl,
            },
            quantity: 1,
          },
        ],
        deliveryAddress: "123 Main St, Anytown, CA 90210",
        phone: "9876543210",
        paymentMethod: "cod",
      },
      {
        userId: user._id,
        orderId: `ORD-${Date.now()}-002`,
        date: new Date("2025-06-20"),
        total: 120,
        status: "Delivered",
        items: [
          {
            product: {
              id: products[10]._id,
              name: products[10].name,
              price: products[10].price,
              imageUrl: products[10].imageUrl,
            },
            quantity: 1,
          },
          {
            product: {
              id: products[15]._id,
              name: products[15].name,
              price: products[15].price,
              imageUrl: products[15].imageUrl,
            },
            quantity: 2,
          },
        ],
        deliveryAddress: "123 Main St, Anytown, CA 90210",
        phone: "9876543210",
        paymentMethod: "cod",
      },
      {
        userId: user._id,
        orderId: `ORD-${Date.now()}-003`,
        date: new Date("2025-06-18"),
        total: 180,
        status: "Cancelled",
        items: [
          {
            product: {
              id: products[20]._id,
              name: products[20].name,
              price: products[20].price,
              imageUrl: products[20].imageUrl,
            },
            quantity: 3,
          },
        ],
        deliveryAddress: "123 Main St, Anytown, CA 90210",
        phone: "9876543210",
        paymentMethod: "cod",
      },
    ]);
    console.log("Dummy orders seeded!");

    console.log("Data seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

dummyData();
