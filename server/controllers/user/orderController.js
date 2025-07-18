const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const placeOrder = async (req, res, next) => {
  const userId = req.user._id;
  const { deliveryAddress, phone, paymentMethod } = req.body;

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
    const userCart = await Cart.findOne({ userId }).populate("items.productId");

    if (!userCart || userCart.items.length === 0) {
      const error = new Error("Cannot place order with an empty cart.");
      error.statusCode = 400;
      return next(error);
    }

    const populatedItems = userCart.items.map((item) => ({
      product: {
        id: item.productId._id.toString(),
        name: item.productId.name,
        price: item.productId.price,
        imageUrl: item.productId.imageUrl,
      },
      quantity: item.quantity,
    }));

    const total = populatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
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
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.imageUrl,
          },
          quantity: item.quantity,
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
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
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
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
        },
        quantity: item.quantity,
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
