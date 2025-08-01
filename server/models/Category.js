const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  displayName: {
    type: String,
    trim: true,
    // If not provided, defaults to name
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
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

// Auto-generate slug if not provided
CategorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  // Don't update slug if it already exists (prevents breaking URLs)
  
  // Set displayName to name if not provided
  if (!this.displayName) {
    this.displayName = this.name;
  }
  
  next();
});

// Virtual for checking if it's a main category
CategorySchema.virtual('isMainCategory').get(function() {
  return this.level === 1;
});

// Virtual for checking if it's a sub category
CategorySchema.virtual('isSubCategory').get(function() {
  return this.level === 2;
});

// Virtual for getting the display name
CategorySchema.virtual('getDisplayName').get(function() {
  return this.displayName || this.name;
});

// Static method to get main categories
CategorySchema.statics.getMainCategories = function() {
  return this.find({ level: 1, isActive: true }).sort('sortOrder');
};

// Instance method to get subcategories
CategorySchema.methods.getSubcategories = function() {
  return this.model('Category').find({ parentCategory: this._id, isActive: true }).sort('sortOrder');
};

module.exports = mongoose.model("Category", CategorySchema);
