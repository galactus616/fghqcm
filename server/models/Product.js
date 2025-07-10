const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: "https://placehold.co/400x300/F0FDF4/1C6F40?text=Product",
  },
  images: {
    type: [String],
    validate: [arr => arr.length >= 4, 'At least 4 images required'],
    required: true,
  },
  discountedPrice: {
    type: Number,
    min: 0,
  },
  variants: [
    {
      quantityLabel: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      discountedPrice: { type: Number, min: 0 },
    }
  ],
  description: {
    type: String,
    required: true,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
