import { API_BASE_URL, handleResponse, getAuthHeaders } from "./config";

const generateRecipe = async (ingredientsList) => {
  const response = await fetch(`${API_BASE_URL}/gemini/generate-recipe`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ingredientsList }),
  });
  return handleResponse(response);
};

export { generateRecipe };
