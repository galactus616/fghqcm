import axios from 'axios';

const API_BASE = '/api/products/categories';


export async function getCategories() {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data;
} 
