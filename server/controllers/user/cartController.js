const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const logger = require("../../config/logger");

const getCart = async (req, res, next) => {
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        populate: [
          { path: "mainCategory", select: "name slug" },
          { path: "subCategory", select: "name slug" },
          { path: "subSubCategory", select: "name slug" },
          { path: "subSubSubCategory", select: "name slug" }
        ]
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
        _id: item._id, // <-- ensure stable id for React key
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        nameBn: product.nameBn,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        variantLabelBn: variant.quantityLabelBn || '',
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
    const product = await Product.findById(productId)
      .populate("mainCategory", "name slug")
      .populate("subCategory", "name slug")
      .populate("subSubCategory", "name slug")
      .populate("subSubSubCategory", "name slug");
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
      populate: [
        { path: "mainCategory", select: "name slug" },
        { path: "subCategory", select: "name slug" },
        { path: "subSubCategory", select: "name slug" },
        { path: "subSubSubCategory", select: "name slug" }
      ]
    });
    
    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        _id: item._id, // <-- ensure stable id for React key
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        nameBn: product.nameBn,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        variantLabelBn: variant.quantityLabelBn || '',
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
        description: product.description,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      };
    });
    res.status(200).json({ message: "Item added to cart", cart: populatedCart });
    
    // Log cart addition
    logger.info("Item added to cart", {
      userId: userId.toString(),
      productId,
      variantIndex,
      quantity: existingItem ? existingItem.quantity : quantity,
      productName: product.name
    });
  } catch (err) {
    logger.error("Error adding item to cart", {
      userId: userId.toString(),
      productId,
      variantIndex,
      error: err.message
    });
    next(err);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  const userId = req.user._id;
  let { productId, variantIndex } = req.params;
  // Support variantIndex from query if not present in params
  if (variantIndex === undefined) {
    variantIndex = req.query.variantIndex;
  }
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
        populate: [
          { path: "mainCategory", select: "name slug" },
          { path: "subCategory", select: "name slug" },
          { path: "subSubCategory", select: "name slug" },
          { path: "subSubSubCategory", select: "name slug" }
        ]
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
      populate: [
        { path: "mainCategory", select: "name slug" },
        { path: "subCategory", select: "name slug" },
        { path: "subSubCategory", select: "name slug" },
        { path: "subSubSubCategory", select: "name slug" }
      ]
    });
    
    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        _id: item._id, // <-- ensure stable id for React key
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        nameBn: product.nameBn,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        variantLabelBn: variant.quantityLabelBn || '',
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
  let { productId, variantIndex } = req.params;
  // Support variantIndex from query if not present in params
  if (variantIndex === undefined) {
    variantIndex = req.query.variantIndex;
  }

  try {
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        populate: [
          { path: "mainCategory", select: "name slug" },
          { path: "subCategory", select: "name slug" },
          { path: "subSubCategory", select: "name slug" },
          { path: "subSubSubCategory", select: "name slug" }
        ]
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
      populate: [
        { path: "mainCategory", select: "name slug" },
        { path: "subCategory", select: "name slug" },
        { path: "subSubCategory", select: "name slug" },
        { path: "subSubSubCategory", select: "name slug" }
      ]
    });
    
    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        _id: item._id, // <-- ensure stable id for React key
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        nameBn: product.nameBn,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        variantLabelBn: variant.quantityLabelBn || '',
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
    // Return the updated (now empty) cart for consistency
    res.status(200).json({ message: "Cart cleared", cart: [] });
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
      populate: [
        { path: "mainCategory", select: "name slug" },
        { path: "subCategory", select: "name slug" },
        { path: "subSubCategory", select: "name slug" },
        { path: "subSubSubCategory", select: "name slug" }
      ]
    });

    // Filter out items with null productId and map valid items
    const validItems = cart.items.filter(item => item.productId !== null);
    const populatedCart = validItems.map((item) => {
      const product = item.productId;
      const variant = product.variants?.[item.variantIndex] || {};
      return {
        _id: item._id, // <-- ensure stable id for React key
        id: `${product._id}-${item.variantIndex}-${item._id}`, // Unique ID for cart item
        productId: product._id,
        variantIndex: item.variantIndex,
        name: product.name,
        nameBn: product.nameBn,
        imageUrl: product.imageUrl,
        price: variant.discountedPrice || variant.price || 0,
        originalPrice: variant.price || 0,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || '',
        variantLabelBn: variant.quantityLabelBn || '',
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
