import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products/categories`;

export async function getStoreCategories() {
  try {
    const res = await axios.get(`${API_BASE}/main`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch store categories:', error);
    throw error;
  }
}