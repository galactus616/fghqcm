// Utilities for guest cart in localStorage

export const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem("guest_cart")) || [];
  } catch {
    return [];
  }
};

export const setLocalCart = (cart) => {
  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

export const clearLocalCart = () => {
  localStorage.removeItem("guest_cart");
};

export const addToLocalCart = (item) => {
  const cart = getLocalCart();
  const existing = cart.find(
    (i) => i.productId === item.productId && i.variantIndex === item.variantIndex
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  setLocalCart(cart);
};

export const getAllLocalCartItems = getLocalCart; 