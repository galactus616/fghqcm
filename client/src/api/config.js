const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.message || "Something went wrong");
    error.statusCode = response.status;
    throw error;
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("swiftcart_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export { API_BASE_URL, handleResponse, getAuthHeaders };
