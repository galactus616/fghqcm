const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  imageUrl: {
    type: String,
    default: "https://placehold.co/100x100/F0FDF4/1C6F40?text=Category",
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  level: {
    type: Number,
    default: 1, // 1 for main categories, 2 for sub categories
    min: 1,
    max: 2,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
CategorySchema.index({ parentCategory: 1, level: 1, isActive: 1 });
CategorySchema.index({ slug: 1 });

// Virtual for checking if it's a main category
CategorySchema.virtual('isMainCategory').get(function() {
  return this.level === 1;
});

// Virtual for checking if it's a sub category
CategorySchema.virtual('isSubCategory').get(function() {
  return this.level === 2;
});

module.exports = mongoose.model("Category", CategorySchema);
