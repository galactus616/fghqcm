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
    console.log('API: Fetching subcategories for mainCategoryId:', mainCategoryId);
    console.log('API: Full URL:', `${API_BASE}/${mainCategoryId}/subcategories`);
    const res = await axios.get(`${API_BASE}/${mainCategoryId}/subcategories`, { withCredentials: true });
    console.log('API: Successfully fetched subcategories:', res.data.length, 'items');
    return res.data;
  } catch (error) {
    console.error('API: Failed to fetch sub categories for', mainCategoryId, ':', error);
    console.error('API: Error response:', error.response?.data);
    console.error('API: Error status:', error.response?.status);
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
