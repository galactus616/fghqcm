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
        { subCategory: { $in: categoryIds } }
      ],
    };
  }

  try {
    const products = await Product.find(query)
      .populate("mainCategory", "name displayName slug")
      .populate("subCategory", "name displayName slug");
    
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
      .populate("subCategory", "name displayName slug");
    
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
  const { mainCategoryId } = req.params;
  
  try {
    // Verify the main category exists
    const mainCategory = await Category.findById(mainCategoryId);
    if (!mainCategory || mainCategory.level !== 1) {
      const error = new Error("Main category not found");
      error.statusCode = 404;
      return next(error);
    }

    const subCategories = await Category.find({ 
      parentCategory: mainCategoryId,
      level: 2,
      isActive: true 
    }).sort({ sortOrder: 1, name: 1 });
    
    const mappedSubCategories = subCategories.map((c) => ({
      id: c._id,
      name: c.displayName || c.name,
      slug: c.slug,
      imageUrl: c.imageUrl,
      parentCategory: c.parentCategory,
      createdAt: c.createdAt,
    }));
    res.json(mappedSubCategories);
  } catch (err) {
    next(err);
  }
};

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
      // Main category - get all products from this main category
      query.mainCategory = categoryId;
    } else if (category.level === 2) {
      // Sub category - get products from this specific sub category
      query.subCategory = categoryId;
    } else {
      const error = new Error("Invalid category level");
      error.statusCode = 400;
      return next(error);
    }

    const products = await Product.find(query)
      .populate("mainCategory", "name displayName slug")
      .populate("subCategory", "name displayName slug");
    
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
};
