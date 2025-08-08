const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
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
  subSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  subSubSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  imageUrl: {
    type: String,
    default: "https://res.cloudinary.com/dke11dwwc/image/upload/v1754568359/Frame_23_y4de3n.png",
  },
  images: {
    type: [String],
    validate: [arr => arr.length >= 4, 'At least 4 images required'],
    required: true,
  },
  variants: [
    {
      quantityLabel: { type: String, required: true },
      quantityLabelBn: { type: String, trim: true }, // Bengali quantity label
      price: { type: Number, required: true, min: 0 },
      discountedPrice: { type: Number, min: 0 },
    }
  ],
  description: {
    type: String,
    required: true,
  },
  descriptionBn: {
    type: String,
    trim: true,
    // Bengali description - optional, falls back to English if not provided
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

// Update indexes for efficient queries
ProductSchema.index({ mainCategory: 1, subCategory: 1, subSubCategory: 1, subSubSubCategory: 1, isActive: 1 });
ProductSchema.index({ isBestSeller: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

// Virtual properties for backward compatibility
ProductSchema.virtual('price').get(function() {
  return this.variants && this.variants.length > 0 ? this.variants[0].price : 0;
});

ProductSchema.virtual('discountedPrice').get(function() {
  return this.variants && this.variants.length > 0 ? this.variants[0].discountedPrice : 0;
});

// Method to get localized name
ProductSchema.methods.getLocalizedName = function(language = 'en') {
  if (language === 'bn') {
    return this.nameBn || this.name;
  }
  return this.name;
};

// Method to get localized description
ProductSchema.methods.getLocalizedDescription = function(language = 'en') {
  if (language === 'bn') {
    return this.descriptionBn || this.description;
  }
  return this.description;
};

// Method to get localized variant labels
ProductSchema.methods.getLocalizedVariants = function(language = 'en') {
  if (!this.variants) return [];
  
  return this.variants.map(variant => ({
    ...variant.toObject(),
    quantityLabel: language === 'bn' ? (variant.quantityLabelBn || variant.quantityLabel) : variant.quantityLabel
  }));
};

// Include virtuals in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

// Instance method to get related products
ProductSchema.methods.getRelatedProducts = function(limit = 4) {
  let query = {
    _id: { $ne: this._id },
    isActive: true
  };

  // Find related products based on the lowest level category that exists
  if (this.subSubSubCategory) {
    query.subSubSubCategory = this.subSubSubCategory;
  } else if (this.subSubCategory) {
    query.subSubCategory = this.subSubCategory;
  } else if (this.subCategory) {
    query.subCategory = this.subCategory;
  } else if (this.mainCategory) {
    query.mainCategory = this.mainCategory;
  }

  return this.model('Product').find(query).limit(limit);
};

module.exports = mongoose.model("Product", ProductSchema);
