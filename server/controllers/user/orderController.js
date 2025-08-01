const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const placeOrder = async (req, res, next) => {
  const userId = req.user._id;
  let { deliveryAddress, phone, paymentMethod } = req.body;

  if (!deliveryAddress || !phone) {
    const error = new Error("Delivery address and phone are required.");
    error.statusCode = 400;
    return next(error);
  }
  if (paymentMethod !== "cod") {
    const error = new Error("Only Cash on Delivery is currently supported.");
    error.statusCode = 400;
    return next(error);
  }

  try {
    // If deliveryAddress is an object with _id, treat as address ID; else, use as object
    if (typeof deliveryAddress === 'string' || (deliveryAddress && deliveryAddress._id)) {
      // Fetch user and address
      const user = await require('../../models/User').findById(userId);
      let addressObj = null;
      if (typeof deliveryAddress === 'string') {
        addressObj = user.addresses.id(deliveryAddress);
      } else {
        addressObj = user.addresses.id(deliveryAddress._id);
      }
      if (!addressObj) {
        const error = new Error("Selected address not found.");
        error.statusCode = 400;
        return next(error);
      }
      deliveryAddress = addressObj.toObject();
      delete deliveryAddress._id; // Remove subdoc id for cleanliness
    }

    const userCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: [
        { path: "mainCategory", select: "name displayName slug" },
        { path: "subCategory", select: "name displayName slug" }
      ]
    });

    if (!userCart || userCart.items.length === 0) {
      const error = new Error("Cannot place order with an empty cart.");
      error.statusCode = 400;
      return next(error);
    }

    // Validate that all cart items have valid products and variants
    const invalidItems = userCart.items.filter(item => 
      !item.productId || 
      !item.productId.variants || 
      !item.productId.variants[item.variantIndex]
    );

    if (invalidItems.length > 0) {
      const error = new Error("Some items in your cart are no longer available. Please review your cart.");
      error.statusCode = 400;
      return next(error);
    }

    const populatedItems = userCart.items.map((item) => {
      // Get the variant for this cart item
      const variant = item.productId.variants[item.variantIndex];
      if (!variant) {
        throw new Error(`Invalid variant index ${item.variantIndex} for product ${item.productId.name}`);
      }
      
      return {
        productId: item.productId._id.toString(),
        name: item.productId.name,
        price: variant.price,
        imageUrl: item.productId.imageUrl,
        quantity: item.quantity,
        variantLabel: variant.quantityLabel || 'Default',
      };
    });

    const total = populatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      userId,
      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date(),
      total: parseFloat(total.toFixed(2)),
      status: "Pending",
      items: populatedItems,
      deliveryAddress,
      phone,
      paymentMethod,
    });

    userCart.items = [];
    await userCart.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: {
        id: newOrder._id,
        orderId: newOrder.orderId,
        date: newOrder.date,
        total: newOrder.total,
        status: newOrder.status,
        deliveryAddress: newOrder.deliveryAddress,
        phone: newOrder.phone,
        items: newOrder.items.map((item) => ({
          product: {
            id: item.productId,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
          },
          quantity: item.quantity,
          variantLabel: item.variantLabel,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });
    const mappedOrders = userOrders.map((order) => ({
      id: order._id,
      orderId: order.orderId,
      date: order.date,
      total: order.total,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      phone: order.phone,
      items: order.items.map((item) => ({
        product: {
          id: item.productId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        },
        quantity: item.quantity,
        variantLabel: item.variantLabel,
      })),
    }));
    res.json(mappedOrders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  const userId = req.user._id;
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      const error = new Error("Order not found or you do not have access.");
      error.statusCode = 404;
      return next(error);
    }
    res.json({
      id: order._id,
      orderId: order.orderId,
      date: order.date,
      total: order.total,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      phone: order.phone,
      items: order.items.map((item) => ({
        product: {
          id: item.productId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        },
        quantity: item.quantity,
        variantLabel: item.variantLabel,
      })),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getOrderById,
};
