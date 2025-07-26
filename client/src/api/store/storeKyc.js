import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/store/kyc`;

export async function submitKyc(kycData) {
  const res = await axios.post(`${API_BASE}/submit`, kycData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function getKycStatus() {
  const res = await axios.get(`${API_BASE}/status`, {
    withCredentials: true,
  });
  return res.data;
}

export async function approveKyc(kycId) {
  const res = await axios.put(`${API_BASE}/${kycId}/approve`, {}, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
} 