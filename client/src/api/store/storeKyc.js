import axios from 'axios';

export async function submitKyc(kycData) {
  const res = await axios.post('/api/store/kyc/submit', kycData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
} 