import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products`;

export async function getAllProducts() {
  try {
    const res = await axios.get(API_BASE, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    throw error;
  }
}

export async function getProductById(productId) {
  try {
    const res = await axios.get(`${API_BASE}/${productId}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    throw error;
  }
}

export async function getProductsByCategory(categoryId) {
  try {
    const res = await axios.get(`${API_BASE}/categories/${encodeURIComponent(categoryId)}/products`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    throw error;
  }
} 
