import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products/categories`;

export async function getMainCategories() {
  try {
    const res = await axios.get(`${API_BASE}/main`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch main categories:', error);
    throw error;
  }
}

export async function getSubCategories(mainCategoryId) {
  try {
    const res = await axios.get(`${API_BASE}/${mainCategoryId}/subcategories`, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error;
  }
}

// Legacy function for backward compatibility
export async function getCategories() {
  try {
    const res = await axios.get(`${API_BASE}/main`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
} 
