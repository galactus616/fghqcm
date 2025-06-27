import React, { createContext, useState, useEffect, useContext } from "react";
import * as cartApi from "../api/cart";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext(null);

const GUEST_CART_KEY = "swiftcart_guest_cart";

const getGuestCart = () => {
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const setGuestCart = (cart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, loading: authLoading } = useContext(AuthContext);

  // Merge guest cart with server cart on login
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (user && !authLoading) {
        const guestCart = getGuestCart();
        if (guestCart.length > 0) {
          for (const item of guestCart) {
            try {
              await cartApi.addToCart(
                item.product.id || item.product._id,
                item.quantity
              );
            } catch {}
          }
          clearGuestCart();
        }
        try {
          const fetchedCart = await cartApi.getCart();
          setCart(fetchedCart);
        } catch {
          setCart([]);
        }
      } else if (!user && !authLoading) {
        setCart(getGuestCart());
      }
    };
    mergeGuestCart();
    // eslint-disable-next-line
  }, [user, authLoading]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) =>
            (item.product.id || item.product._id) ===
            (product.id || product._id)
        );
        let newCart;
        if (existingItem) {
          newCart = prevCart.map((item) =>
            (item.product.id || item.product._id) ===
            (product.id || product._id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart = [...prevCart, { product, quantity }];
        }
        setGuestCart(newCart);
        return newCart;
      });
      return;
    }
    try {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevCart, { product, quantity }];
        }
      });
      await cartApi.addToCart(product.id, quantity);
    } catch (error) {
      if (user) {
        const fetchedCart = await cartApi.getCart();
        setCart(fetchedCart);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user) {
      setCart((prevCart) => {
        let newCart;
        if (newQuantity <= 0) {
          newCart = prevCart.filter(
            (item) => (item.product.id || item.product._id) !== productId
          );
        } else {
          newCart = prevCart.map((item) =>
            (item.product.id || item.product._id) === productId
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
        setGuestCart(newCart);
        return newCart;
      });
      return;
    }
    try {
      setCart((prevCart) => {
        if (newQuantity <= 0) {
          return prevCart.filter((item) => item.product.id !== productId);
        }
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      });
      await cartApi.updateCartItemQuantity(productId, newQuantity);
    } catch (error) {
      if (user) {
        const fetchedCart = await cartApi.getCart();
        setCart(fetchedCart);
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      setCart((prevCart) => {
        const newCart = prevCart.filter(
          (item) => (item.product.id || item.product._id) !== productId
        );
        setGuestCart(newCart);
        return newCart;
      });
      return;
    }
    try {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
      await cartApi.removeFromCart(productId);
    } catch (error) {
      if (user) {
        const fetchedCart = await cartApi.getCart();
        setCart(fetchedCart);
      }
    }
  };

  const clearCart = async () => {
    if (!user) {
      setCart([]);
      clearGuestCart();
      return;
    }
    try {
      setCart([]);
      await cartApi.clearCart();
    } catch (error) {
      if (user) {
        const fetchedCart = await cartApi.getCart();
        setCart(fetchedCart);
      }
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
