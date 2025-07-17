import axios from 'axios';

// const API_BASE = '/api/user/addresses';
const API_BASE = 'https://arsacart.onrender.com/api/user/addresses';

export async function getAddresses() {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data;
}

export async function addAddress(addressObj) {
  const res = await axios.post(API_BASE, addressObj, { withCredentials: true });
  return res.data;
}

export async function updateAddress(addressId, addressObj) {
  const res = await axios.put(`${API_BASE}/${addressId}`, addressObj, { withCredentials: true });
  return res.data;
}

export async function deleteAddress(addressId) {
  const res = await axios.delete(`${API_BASE}/${addressId}`, { withCredentials: true });
  return res.data;
}

export async function setDefaultAddress(addressId) {
  const res = await axios.patch(`${API_BASE}/${addressId}/default`, {}, { withCredentials: true });
  return res.data;
}

// Update user profile
export async function updateProfile(profileObj) {
  const res = await axios.put('/api/auth/profile', profileObj, { withCredentials: true });
  return res.data;
}