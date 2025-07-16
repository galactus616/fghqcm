const Product = require("../models/Product");
const Category = require("../models/Category");

const getAllProducts = async (req, res, next) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    // Find matching categories by name
    const categories = await Category.find({ name: { $regex: search, $options: "i" } });
    const categoryIds = categories.map(c => c._id);

    query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $in: categoryIds } }
      ],
    };
  }

  try {
    const products = await Product.find(query).populate("category", "name");
    const mappedProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      category: typeof p.category === 'object' ? { id: p.category._id, name: p.category.name } : p.category,
      // price: p.price, // Deprecated: use variants array
      // discountedPrice: p.discountedPrice, // Deprecated: use variants array
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
    const product = await Product.findById(id).populate("category", "name");
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({
      id: product._id,
      name: product.name,
      category: typeof product.category === 'object' ? { id: product.category._id, name: product.category.name } : product.category,
      // price: product.price, // Deprecated: use variants array
      // discountedPrice: product.discountedPrice, // Deprecated: use variants array
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

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    const mappedCategories = categories.map((c) => ({
      id: c._id,
      name: c.name,
      imageUrl: c.imageUrl,
      createdAt: c.createdAt,
    }));
    res.json(mappedCategories);
  } catch (err) {
    next(err);
  }
};

const getProductsByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId }).populate("category", "name");
    const mappedProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      category: typeof p.category === 'object' ? { id: p.category._id, name: p.category.name } : p.category,
      // price: p.price, // Deprecated: use variants array
      // discountedPrice: p.discountedPrice, // Deprecated: use variants array
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
  getAllCategories,
  getProductsByCategoryId,
};
