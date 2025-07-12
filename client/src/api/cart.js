import axios from 'axios';

const API_BASE = '/api/cart';

export async function getCart() {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data; // Should return cart items array
}

export async function addToCart(item) {
  const res = await axios.post(API_BASE, item, { withCredentials: true });
  return res.data;
}

export async function updateCartItem(productId, variantIndex, quantity) {
  const res = await axios.put(`${API_BASE}/${productId}?variantIndex=${variantIndex}`, { quantity }, { withCredentials: true });
  return res.data;
}

export async function removeFromCart(productId, variantIndex) {
  const res = await axios.delete(`${API_BASE}/${productId}?variantIndex=${variantIndex}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function clearCart() {
  const res = await axios.delete(API_BASE, { withCredentials: true });
  return res.data;
}

export async function mergeCart(items) {
  const res = await axios.post(`${API_BASE}/merge`, { items }, { withCredentials: true });
  return res.data;
} 
