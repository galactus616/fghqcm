import { API_BASE_URL, handleResponse, getAuthHeaders } from "./config";

const placeOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

const getOrderById = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export { placeOrder, getOrders, getOrderById };
