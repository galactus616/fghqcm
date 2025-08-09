import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/inventory`;

export async function getMyInventory() {
  try {
    const res = await axios.get(`${API_BASE}/my`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    throw error;
  }
}

export async function addToInventory(productId, stock = 1) {
  try {
    const res = await axios.post(`${API_BASE}`, { productId, stock }, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to add to inventory:', error);
    throw error;
  }
}

export async function updateInventory(inventoryId, updates) {
  try {
    const res = await axios.put(`${API_BASE}/${inventoryId}`, updates, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to update inventory:', error);
    throw error;
  }
}

export async function removeFromInventory(inventoryId) {
  try {
    const res = await axios.delete(`${API_BASE}/${inventoryId}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Failed to remove from inventory:', error);
    throw error;
  }
}
