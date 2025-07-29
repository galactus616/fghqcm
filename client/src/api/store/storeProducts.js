import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products`;

export async function getStoreProducts() {
  try {
    const res = await axios.get(API_BASE, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch store products:', error);
    throw error;
  }
}

export async function getStoreProductById(productId) {
  try {
    const res = await axios.get(`${API_BASE}/${productId}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch store product:', error);
    throw error;
  }
}

export async function getStoreProductsByCategory(categoryId) {
  try {
    const res = await axios.get(`${API_BASE}/categories/${encodeURIComponent(categoryId)}/products`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch store products by category:', error);
    throw error;
  }
}