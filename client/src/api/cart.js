import { API_BASE_URL, handleResponse, getAuthHeaders } from "./config";

const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

const addToCart = async (productId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
};

const updateCartItemQuantity = async (productId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(response);
};

const removeFromCart = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

const clearCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};
