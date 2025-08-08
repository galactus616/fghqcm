const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nameBn: {
    type: String,
    trim: true,
    // Bengali name - optional, falls back to English if not provided
  },
  displayName: {
    type: String,
    trim: true,
    // If not provided, defaults to name
  },
  displayNameBn: {
    type: String,
    trim: true,
    // Bengali display name - optional, falls back to nameBn or name
  },
  slug: {
    type: String,
    required: false,
    lowercase: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  level: {
    type: Number,
    enum: [1, 2, 3, 4], // Now supports up to 4 levels
    default: 1,
    min: 1,
    max: 4,
  },
  ancestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
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
CategorySchema.pre('save', async function(next) {
  // Always generate slug from name
  if (!this.slug || this.slug === '') {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  // Set displayName to name if not provided
  if (!this.displayName) {
    this.displayName = this.name;
  }
  // Set displayNameBn to nameBn if not provided, fallback to name
  if (!this.displayNameBn) {
    this.displayNameBn = this.nameBn || this.name;
  }
  // Set ancestors array
  if (this.parentCategory) {
    const parent = await this.model('Category').findById(this.parentCategory);
    if (parent) {
      this.ancestors = parent.ancestors ? [...parent.ancestors, parent._id] : [parent._id];
      this.level = (parent.level || 1) + 1;
    }
  } else {
    this.ancestors = [];
    this.level = 1;
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

// Virtual for checking if it's a sub-sub category
CategorySchema.virtual('isSubSubCategory').get(function() {
  return this.level === 3;
});

// Virtual for checking if it's a sub-sub-sub category
CategorySchema.virtual('isSubSubSubCategory').get(function() {
  return this.level === 4;
});

// Method to get localized name
CategorySchema.methods.getLocalizedName = function(language = 'en') {
  if (language === 'bn') {
    return this.displayNameBn || this.nameBn || this.displayName || this.name;
  }
  return this.displayName || this.name;
};

// Static method to get main categories
CategorySchema.statics.getMainCategories = function() {
  return this.find({ level: 1, isActive: true }).sort('sortOrder');
};

// Instance method to get subcategories
CategorySchema.methods.getSubcategories = function() {
  return this.model('Category').find({ parentCategory: this._id, isActive: true }).sort('sortOrder');
};

// Instance method to get sub-subcategories (level 3)
CategorySchema.methods.getSubSubcategories = function() {
  return this.model('Category').find({ parentCategory: this._id, level: 3, isActive: true }).sort('sortOrder');
};

// Instance method to get sub-sub-subcategories (level 4)
CategorySchema.methods.getSubSubSubcategories = function() {
  return this.model('Category').find({ parentCategory: this._id, level: 4, isActive: true }).sort('sortOrder');
};

module.exports = mongoose.model("Category", CategorySchema);
