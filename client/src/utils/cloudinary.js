const CLOUD_NAME = 'deepmitra';
const UPLOAD_PRESET = 'kyc_unsigned';

export async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Cloudinary upload failed');
  }
  const data = await res.json();
  return data.secure_url;
} 