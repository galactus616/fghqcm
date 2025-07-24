const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  items: [OrderItemSchema],
  deliveryAddress: {
    label: { type: String, default: "Home" },
    flat: { type: String },
    floor: { type: String },
    area: { type: String },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
    // Optionally include _id if you want to keep the original address id
  },
  phone: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cod"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
