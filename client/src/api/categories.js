import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products/categories`;

export async function getCategories() {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data;
} 
