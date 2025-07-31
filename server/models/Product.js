const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mainCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
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
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
ProductSchema.index({ mainCategory: 1, subCategory: 1, isActive: 1 });
ProductSchema.index({ isBestSeller: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

// Virtual properties for backward compatibility
ProductSchema.virtual('price').get(function() {
  return this.variants && this.variants.length > 0 ? this.variants[0].price : 0;
});

ProductSchema.virtual('discountedPrice').get(function() {
  return this.variants && this.variants.length > 0 ? this.variants[0].discountedPrice : 0;
});

// Include virtuals in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

// Instance method to get related products
ProductSchema.methods.getRelatedProducts = function(limit = 4) {
  return this.model('Product').find({
    subCategory: this.subCategory,
    _id: { $ne: this._id },
    isActive: true
  }).limit(limit);
};

module.exports = mongoose.model("Product", ProductSchema);
