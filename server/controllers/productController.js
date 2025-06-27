const Product = require("../models/Product");
const Category = require("../models/Category");

const getAllProducts = async (req, res, next) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    };
  }

  try {
    const products = await Product.find(query);
    const mappedProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      imageUrl: p.imageUrl,
      description: p.description,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
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
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description,
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
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

const getProductsByCategory = async (req, res, next) => {
  const { categoryName } = req.params;
  try {
    const products = await Product.find({
      category: new RegExp(`^${categoryName}$`, "i"),
    });
    const mappedProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      imageUrl: p.imageUrl,
      description: p.description,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
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
  getProductsByCategory,
};
