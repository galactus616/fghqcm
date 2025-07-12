const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res, next) => {
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        populate: { path: "category", select: "name" }
      });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Filter out items with null productId (products that no longer exist)
    const validItems = cart.items.filter(item => item.productId !== null);
    
    // If there are invalid items, update the cart to remove them
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        category: typeof product.category === 'object' && product.category !== null
          ? { id: product.category._id, name: product.category.name }
          : product.category,
        description: product.description,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      };
    });

    res.json(populatedCart);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, variantIndex, quantity = 1 } = req.body;

  if (!productId || typeof variantIndex !== 'number') {
    const error = new Error("Product ID and variantIndex are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const product = await Product.findById(productId).populate("category", "name");
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }
    if (!product.variants || !product.variants[variantIndex]) {
      const error = new Error("Invalid variantIndex");
      error.statusCode = 400;
      return next(error);
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.variantIndex === variantIndex
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, variantIndex, quantity });
    }

    await cart.save();
    await cart.populate({
      path: "items.productId",
      populate: { path: "category", select: "name" }
    });
    
    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        category: typeof product.category === 'object' && product.category !== null
          ? { id: product.category._id, name: product.category.name }
          : product.category,
        description: product.description,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      };
    });
    res.status(200).json({ message: "Item added to cart", cart: populatedCart });
  } catch (err) {
    next(err);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, variantIndex } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity < 0) {
    const error = new Error("Quantity must be a non-negative number");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        populate: { path: "category", select: "name" }
      });

    if (!cart) {
      const error = new Error("Cart not found for this user");
      error.statusCode = 404;
      return next(error);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId && item.variantIndex === Number(variantIndex)
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
    await cart.populate({
      path: "items.productId",
      populate: { path: "category", select: "name" }
    });
    
    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        category: typeof product.category === 'object' && product.category !== null
          ? { id: product.category._id, name: product.category.name }
          : product.category,
        description: product.description,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      };
    });
    res.status(200).json({ message: "Cart updated", cart: populatedCart });
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, variantIndex } = req.params;

  try {
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        populate: { path: "category", select: "name" }
      });

    if (!cart) {
      const error = new Error("Cart not found for this user");
      error.statusCode = 404;
      return next(error);
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => !(item.productId._id.toString() === productId && item.variantIndex === Number(variantIndex))
    );

    if (cart.items.length === initialLength) {
      const error = new Error("Item not found in cart");
      error.statusCode = 404;
      return next(error);
    }

    await cart.save();
    await cart.populate({
      path: "items.productId",
      populate: { path: "category", select: "name" }
    });
    
    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        category: typeof product.category === 'object' && product.category !== null
          ? { id: product.category._id, name: product.category.name }
          : product.category,
        description: product.description,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      };
    });
    res.status(200).json({ message: "Item removed from cart", cart: populatedCart });
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

const mergeCart = async (req, res, next) => {
  const userId = req.user._id;
  const { items } = req.body; // [{productId, variantIndex, quantity}]

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Items must be an array" });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    for (const guestItem of items) {
      const { productId, variantIndex, quantity } = guestItem;
      if (!productId || typeof variantIndex !== "number" || typeof quantity !== "number") continue;

      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          item.variantIndex === variantIndex
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, variantIndex, quantity });
      }
    }

    await cart.save();
    await cart.populate({
      path: "items.productId",
      populate: { path: "category", select: "name" }
    });

    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        category: typeof product.category === 'object' && product.category !== null
          ? { id: product.category._id, name: product.category.name }
          : product.category,
        description: product.description,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      };
    });

    res.status(200).json({ message: "Cart merged", cart: populatedCart });
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
  mergeCart,
};
