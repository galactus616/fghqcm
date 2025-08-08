const Product = require("../../models/Product");
const Category = require("../../models/Category");

const getAllProducts = async (req, res, next) => {
  const { search } = req.query;
  let query = { isActive: true };

  if (search) {
    // Find matching categories by name or displayName
    const categories = await Category.find({ 
      $or: [
        { name: { $regex: search, $options: "i" } },
        { displayName: { $regex: search, $options: "i" } }
      ],
      isActive: true 
    });
    const categoryIds = categories.map(c => c._id);

    query = {
      isActive: true,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { mainCategory: { $in: categoryIds } },
        { subCategory: { $in: categoryIds } },
        { subSubCategory: { $in: categoryIds } },
        { subSubSubCategory: { $in: categoryIds } }
      ],
    };
  }

  try {
    const products = await Product.find(query)
      .populate("mainCategory", "name displayName slug")
      .populate("subCategory", "name displayName slug")
      .populate("subSubCategory", "name displayName slug")
      .populate("subSubSubCategory", "name displayName slug");
    
    const mappedProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      mainCategory: p.mainCategory ? { 
        id: p.mainCategory._id, 
        name: p.mainCategory.displayName || p.mainCategory.name,
        slug: p.mainCategory.slug 
      } : null,
      subCategory: p.subCategory ? { 
        id: p.subCategory._id, 
        name: p.subCategory.displayName || p.subCategory.name,
        slug: p.subCategory.slug 
      } : null,
      subSubCategory: p.subSubCategory ? { 
        id: p.subSubCategory._id, 
        name: p.subSubCategory.displayName || p.subSubCategory.name,
        slug: p.subSubCategory.slug 
      } : null,
      subSubSubCategory: p.subSubSubCategory ? { 
        id: p.subSubSubCategory._id, 
        name: p.subSubSubCategory.displayName || p.subSubSubCategory.name,
        slug: p.subSubSubCategory.slug 
      } : null,
      imageUrl: p.imageUrl,
      images: p.images,
      description: p.description,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
      variants: p.variants,
      createdAt: p.createdAt,
    }));
    res.json(mappedProducts);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate("mainCategory", "name displayName slug")
      .populate("subCategory", "name displayName slug")
      .populate("subSubCategory", "name displayName slug")
      .populate("subSubSubCategory", "name displayName slug");
    
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }
    
    res.json({
      id: product._id,
      name: product.name,
      mainCategory: product.mainCategory ? { 
        id: product.mainCategory._id, 
        name: product.mainCategory.displayName || product.mainCategory.name,
        slug: product.mainCategory.slug 
      } : null,
      subCategory: product.subCategory ? { 
        id: product.subCategory._id, 
        name: product.subCategory.displayName || product.subCategory.name,
        slug: product.subCategory.slug 
      } : null,
      subSubCategory: product.subSubCategory ? { 
        id: product.subSubCategory._id, 
        name: product.subSubCategory.displayName || product.subSubCategory.name,
        slug: product.subSubCategory.slug 
      } : null,
      subSubSubCategory: product.subSubSubCategory ? { 
        id: product.subSubSubCategory._id, 
        name: product.subSubSubCategory.displayName || product.subSubSubCategory.name,
        slug: product.subSubSubCategory.slug 
      } : null,
      imageUrl: product.imageUrl,
      images: product.images,
      description: product.description,
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
      variants: product.variants,
      createdAt: product.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

const getMainCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ 
      level: 1, 
      isActive: true 
    }).sort({ sortOrder: 1, name: 1 });
    
    const mappedCategories = categories.map((c) => ({
      id: c._id,
      name: c.displayName || c.name,
      slug: c.slug,
      imageUrl: c.imageUrl,
      createdAt: c.createdAt,
    }));
    res.json(mappedCategories);
  } catch (err) {
    next(err);
  }
};

const getSubCategories = async (req, res, next) => {
  const { parentCategoryId } = req.params;
  try {
    // Verify the parent category exists
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      const error = new Error("Parent category not found");
      error.statusCode = 404;
      return next(error);
    }
    // Fetch all direct children (subcategories) regardless of level
    const subCategories = await Category.find({
      parentCategory: parentCategoryId,
      isActive: true
    }).sort({ sortOrder: 1, name: 1 });
    const mappedSubCategories = subCategories.map((c) => ({
      id: c._id,
      name: c.displayName || c.name,
      slug: c.slug,
      imageUrl: c.imageUrl,
      parentCategory: c.parentCategory,
      level: c.level,
      createdAt: c.createdAt,
    }));
    res.json(mappedSubCategories);
  } catch (err) {
    next(err);
  }
};

// Updated getProductsByCategoryId: support all 4 levels
const getProductsByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    // Check if the category exists and determine its level
    const category = await Category.findById(categoryId);
    if (!category || !category.isActive) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }
    let query = { isActive: true };
    if (category.level === 1) {
      query.mainCategory = categoryId;
    } else if (category.level === 2) {
      // Find all sub-subcategories and sub-sub-subcategories under this subcategory
      const subSubCategories = await Category.find({ parentCategory: categoryId, level: 3, isActive: true });
      const subSubSubCategories = await Category.find({ parentCategory: { $in: subSubCategories.map(c => c._id) }, level: 4, isActive: true });
      query.$or = [
        { subCategory: categoryId },
        { subSubCategory: { $in: subSubCategories.map(c => c._id) } },
        { subSubSubCategory: { $in: subSubSubCategories.map(c => c._id) } }
      ];
    } else if (category.level === 3) {
      // Find all sub-sub-subcategories under this sub-subcategory
      const subSubSubCategories = await Category.find({ parentCategory: categoryId, level: 4, isActive: true });
      query.$or = [
        { subSubCategory: categoryId },
        { subSubSubCategory: { $in: subSubSubCategories.map(c => c._id) } }
      ];
    } else if (category.level === 4) {
      query.subSubSubCategory = categoryId;
    } else {
      const error = new Error("Invalid category level");
      error.statusCode = 400;
      return next(error);
    }
    const products = await Product.find(query)
      .populate("mainCategory", "name displayName slug")
      .populate("subCategory", "name displayName slug")
      .populate("subSubCategory", "name displayName slug")
      .populate("subSubSubCategory", "name displayName slug");
    const mappedProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      mainCategory: p.mainCategory ? {
        id: p.mainCategory._id,
        name: p.mainCategory.displayName || p.mainCategory.name,
        slug: p.mainCategory.slug
      } : null,
      subCategory: p.subCategory ? {
        id: p.subCategory._id,
        name: p.subCategory.displayName || p.subCategory.name,
        slug: p.subCategory.slug
      } : null,
      subSubCategory: p.subSubCategory ? {
        id: p.subSubCategory._id,
        name: p.subSubCategory.displayName || p.subSubCategory.name,
        slug: p.subSubCategory.slug
      } : null,
      subSubSubCategory: p.subSubSubCategory ? {
        id: p.subSubSubCategory._id,
        name: p.subSubSubCategory.displayName || p.subSubSubCategory.name,
        slug: p.subSubSubCategory.slug
      } : null,
      imageUrl: p.imageUrl,
      images: p.images,
      description: p.description,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
      variants: p.variants,
      createdAt: p.createdAt,
    }));
    res.json(mappedProducts);
  } catch (err) {
    next(err);
  }
};

const getRelatedProducts = async (req, res, next) => {
  const { id } = req.params;
  const { limit = 5 } = req.query;
  
  try {
    // Find the product first
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    // Get related products using the instance method
    const relatedProducts = await product.getRelatedProducts(parseInt(limit));
    
    // Populate category information
    const populatedProducts = await Product.populate(relatedProducts, [
      { path: "mainCategory", select: "name displayName slug" },
      { path: "subCategory", select: "name displayName slug" },
      { path: "subSubCategory", select: "name displayName slug" },
      { path: "subSubSubCategory", select: "name displayName slug" }
    ]);
    
    const mappedProducts = populatedProducts.map((p) => ({
      id: p._id,
      name: p.name,
      mainCategory: p.mainCategory ? { 
        id: p.mainCategory._id, 
        name: p.mainCategory.displayName || p.mainCategory.name,
        slug: p.mainCategory.slug 
      } : null,
      subCategory: p.subCategory ? { 
        id: p.subCategory._id, 
        name: p.subCategory.displayName || p.subCategory.name,
        slug: p.subCategory.slug 
      } : null,
      subSubCategory: p.subSubCategory ? { 
        id: p.subSubCategory._id, 
        name: p.subSubCategory.displayName || p.subSubCategory.name,
        slug: p.subSubCategory.slug 
      } : null,
      subSubSubCategory: p.subSubSubCategory ? { 
        id: p.subSubSubCategory._id, 
        name: p.subSubSubCategory.displayName || p.subSubSubCategory.name,
        slug: p.subSubSubCategory.slug 
      } : null,
      imageUrl: p.imageUrl,
      images: p.images,
      description: p.description,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
      variants: p.variants,
      createdAt: p.createdAt,
    }));
    
    res.json(mappedProducts);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getMainCategories,
  getSubCategories,
  getProductsByCategoryId,
  getRelatedProducts,
};
