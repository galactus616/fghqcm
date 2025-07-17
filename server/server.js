require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: [
    "https://arsacart-frontend.onrender.com",
    "https://www.brightlinesolutions.in"
  ],
  credentials: true,
}));
app.use(express.json());
app.options('*', cors({
  origin: [
    "https://arsacart-frontend.onrender.com",
    "https://www.brightlinesolutions.in"
  ],
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/gemini", geminiRoutes);
app.use('/api/user', userRoutes);

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get("/", (req, res) => {
  res.send("SwiftCart API is running!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    errors: err.errors || undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
