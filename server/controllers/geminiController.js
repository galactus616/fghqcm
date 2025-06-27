const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecipe = async (req, res) => {
  const { ingredientsList } = req.body;

  if (!ingredientsList) {
    return res.status(400).json({ message: "Ingredients list is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a recipe using the following ingredients: ${ingredientsList}.
                    The recipe should be suitable for a quick meal.
                    Please provide the response in a structured JSON format with the following keys:
                    "recipeName": (string),
                    "ingredients": (array of strings, including quantities and any suggested additional ingredients),
                    "instructions": (array of strings for each step).`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            recipeName: { type: "STRING" },
            ingredients: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            instructions: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
          },
          propertyOrdering: ["recipeName", "ingredients", "instructions"],
        },
      },
    });

    const responseText = result.response.text();
    const recipe = JSON.parse(responseText);

    res.json(recipe);
  } catch (error) {
    console.error("Error generating recipe with Gemini API:", error);
    if (error.response && error.response.statusText) {
      return res
        .status(500)
        .json({
          message: `Failed to generate recipe: ${error.response.statusText}`,
          details: error.message,
        });
    }
    res
      .status(500)
      .json({ message: "Failed to generate recipe.", details: error.message });
  }
};

module.exports = {
  generateRecipe,
};
