import { API_BASE_URL, handleResponse } from "./config";

const getProducts = async (searchQuery = "") => {
  const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
  const response = await fetch(`${API_BASE_URL}/products${query}`);
  return handleResponse(response);
};

const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
};

const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  return handleResponse(response);
};

const getProductsByCategory = async (categoryName) => {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${encodeURIComponent(categoryName)}`
  );
  return handleResponse(response);
};

export { getProducts, getProductById, getCategories, getProductsByCategory };
