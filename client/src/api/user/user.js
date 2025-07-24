import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}`;

export async function getAddresses() {
  const res = await axios.get(`${API_BASE}/user/addresses`, { withCredentials: true });
  return res.data;
}

export async function addAddress(addressObj) {
  // addressObj should have: label, flat, floor, area, landmark, isDefault
  const res = await axios.post(`${API_BASE}/user/addresses`, addressObj, { withCredentials: true });
  return res.data;
}

export async function updateAddress(addressId, addressObj) {
  // addressObj should have: label, flat, floor, area, landmark, isDefault
  const res = await axios.put(`${API_BASE}/user/addresses/${addressId}`, addressObj, { withCredentials: true });
  return res.data;
}

export async function deleteAddress(addressId) {
  const res = await axios.delete(`${API_BASE}/user/addresses/${addressId}`, { withCredentials: true });
  return res.data;
}

export async function setDefaultAddress(addressId) {
  const res = await axios.patch(`${API_BASE}/user/addresses/${addressId}/default`, {}, { withCredentials: true });
  return res.data;
}

// Update user profile
export async function updateProfile(profileObj) {
  const res = await axios.put(`${API_BASE}/auth/profile`, profileObj, { withCredentials: true });
  return res.data;
}