require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');

const connectDB = require("./config/db");
const authRoutes = require("./routes/user/authRoutes");
const productRoutes = require("./routes/user/productRoutes");
const cartRoutes = require("./routes/user/cartRoutes");
const orderRoutes = require("./routes/user/orderRoutes");
const geminiRoutes = require("./routes/user/geminiRoutes");
const userRoutes = require('./routes/user/userRoutes');
const locationRoutes = require('./routes/user/locationRoutes');

const storeKycRoutes = require('./routes/store/kycRoutes');
const storeRoutes = require('./routes/store/storeRoutes');
const inventoryRoutes = require('./routes/store/inventoryRoutes');
const storeOrderRoutes = require('./routes/store/orderRoutes');
const storeAuthRoutes = require('./routes/store/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://arsacart-frontend.onrender.com",
    "https://www.brightlinesolutions.in"
  ],
  credentials: true,
}));
app.use(express.json());
app.options('*', cors({
  origin: [
    "http://localhost:5173",
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
app.use('/api', locationRoutes);

app.use('/api/store/auth', storeAuthRoutes);
app.use('/api/store/kyc', storeKycRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/store/orders', storeOrderRoutes);

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
