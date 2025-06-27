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

    const categories = await Category.insertMany([
      {
        name: "Rice",
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Fish & Seafood",
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Fruits",
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Sweets",
        imageUrl:
          "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Snacks",
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Bakery",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Dairy & Eggs",
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Vegetables",
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
      },
    ]);
    console.log("Categories seeded!");

    const products = await Product.insertMany([
      {
        name: "Hilsa Fish (1kg)",
        category: "Fish & Seafood",
        price: 1200,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description:
          "Fresh Hilsa fish, the pride of Bangladesh. Rich in flavor and Omega-3.",
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Aromatic Rice (5kg)",
        category: "Rice",
        price: 550,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description:
          "Premium Bangladeshi aromatic rice, perfect for biryani and pulao.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Mango (Himsagar, 1kg)",
        category: "Fruits",
        price: 300,
        imageUrl:
          "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
        description:
          "Juicy, sweet Himsagar mangoes, a summer favorite in Bangladesh.",
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Red Lentils (Masoor Dal, 1kg)",
        category: "Vegetables",
        price: 180,
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description:
          "High-quality red lentils, a staple in Bangladeshi kitchens.",
        isBestSeller: false,
        isFeatured: false,
      },
      {
        name: "Roshogolla (12 pcs)",
        category: "Sweets",
        price: 250,
        imageUrl:
          "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80",
        description:
          "Soft, spongy Roshogolla made with pure chhana. A Bengali classic.",
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Paratha (6 pcs)",
        category: "Bakery",
        price: 90,
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        description: "Flaky, soft parathas, perfect for breakfast or snacks.",
        isBestSeller: false,
        isFeatured: false,
      },
      {
        name: "Mishti Doi (500g)",
        category: "Dairy & Eggs",
        price: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        description:
          "Traditional sweet yogurt, a beloved dessert in Bangladesh.",
        isBestSeller: false,
        isFeatured: true,
      },
      {
        name: "Chanachur (400g)",
        category: "Snacks",
        price: 80,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Spicy, crunchy chanachur, the perfect tea-time snack.",
        isBestSeller: true,
        isFeatured: false,
      },
      {
        name: "Farm Fresh Eggs (12 pcs)",
        category: "Dairy & Eggs",
        price: 140,
        imageUrl:
          "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        description: "Large, brown, farm-fresh eggs from local farms.",
        isBestSeller: false,
        isFeatured: false,
      },
      {
        name: "Seasonal Vegetables (1kg)",
        category: "Vegetables",
        price: 100,
        imageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description:
          "A mix of fresh, seasonal vegetables from Bangladeshi farms.",
        isBestSeller: false,
        isFeatured: false,
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
        { productId: products[0]._id, quantity: 1 },
        { productId: products[1]._id, quantity: 2 },
      ],
    });
    console.log("Dummy cart seeded!");

    await Order.insertMany([
      {
        userId: user._id,
        orderId: `ORD-${Date.now()}-001`,
        date: new Date("2025-06-25"),
        total: 10.97,
        status: "Delivered",
        items: [
          {
            product: {
              id: products[0]._id,
              name: products[0].name,
              price: products[0].price,
              imageUrl: products[0].imageUrl,
            },
            quantity: 1,
          },
          {
            product: {
              id: products[1]._id,
              name: products[1].name,
              price: products[1].price,
              imageUrl: products[1].imageUrl,
            },
            quantity: 3,
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
        total: 8.7,
        status: "Delivered",
        items: [
          {
            product: {
              id: products[2]._id,
              name: products[2].name,
              price: products[2].price,
              imageUrl: products[2].imageUrl,
            },
            quantity: 1,
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
        orderId: `ORD-${Date.now()}-003`,
        date: new Date("2025-06-18"),
        total: 12.5,
        status: "Cancelled",
        items: [
          {
            product: {
              id: products[6]._id,
              name: products[6].name,
              price: products[6].price,
              imageUrl: products[6].imageUrl,
            },
            quantity: 1,
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
