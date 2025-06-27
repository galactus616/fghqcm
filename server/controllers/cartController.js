const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res, next) => {
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const populatedCart = cart.items.map((item) => ({
      product: {
        id: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        price: item.productId.price,
        imageUrl: item.productId.imageUrl,
        description: item.productId.description,
        isBestSeller: item.productId.isBestSeller,
        isFeatured: item.productId.isFeatured,
      },
      quantity: item.quantity,
    }));

    res.json(populatedCart);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    const error = new Error("Product ID is required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    // Populate and map ids
    await cart.populate("items.productId");
    const populatedCart = cart.items.map((item) => ({
      product: {
        id: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        price: item.productId.price,
        imageUrl: item.productId.imageUrl,
        description: item.productId.description,
        isBestSeller: item.productId.isBestSeller,
        isFeatured: item.productId.isFeatured,
      },
      quantity: item.quantity,
    }));
    res
      .status(200)
      .json({ message: "Item added to cart", cart: populatedCart });
  } catch (err) {
    next(err);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity < 0) {
    const error = new Error("Quantity must be a non-negative number");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      const error = new Error("Cart not found for this user");
      error.statusCode = 404;
      return next(error);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    if (itemIndex === -1) {
      const error = new Error("Item not found in cart");
      error.statusCode = 404;
      return next(error);
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.productId");
    const populatedCart = cart.items.map((item) => ({
      product: {
        id: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        price: item.productId.price,
        imageUrl: item.productId.imageUrl,
        description: item.productId.description,
        isBestSeller: item.productId.isBestSeller,
        isFeatured: item.productId.isFeatured,
      },
      quantity: item.quantity,
    }));
    res.status(200).json({ message: "Cart updated", cart: populatedCart });
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      const error = new Error("Cart not found for this user");
      error.statusCode = 404;
      return next(error);
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      const error = new Error("Item not found in cart");
      error.statusCode = 404;
      return next(error);
    }

    await cart.save();
    await cart.populate("items.productId");
    const populatedCart = cart.items.map((item) => ({
      product: {
        id: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        price: item.productId.price,
        imageUrl: item.productId.imageUrl,
        description: item.productId.description,
        isBestSeller: item.productId.isBestSeller,
        isFeatured: item.productId.isFeatured,
      },
      quantity: item.quantity,
    }));
    res
      .status(200)
      .json({ message: "Item removed from cart", cart: populatedCart });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};
