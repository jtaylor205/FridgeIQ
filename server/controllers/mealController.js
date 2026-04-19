const axios = require('axios');
const FridgeItem = require('../models/FridgeItem');

const SPOONACULAR_BASE = 'https://api.spoonacular.com';
const API_KEY = process.env.SPOONACULAR_API_KEY;

const getMealSuggestions = async (req, res, next) => {
  try {
    const items = await FridgeItem.find({ fridge: req.user.fridge });

    if (!items.length) {
      return res.json([]);
    }

    const ingredientNames = items.map((i) => i.name.toLowerCase());
    const fridgeMap = {};
    items.forEach((item) => {
      fridgeMap[item.name.toLowerCase()] = item;
    });

    const { number = 8, ranking = 2, ignorePantry = true } = req.query;

    const spoonacularRes = await axios.get(
      `${SPOONACULAR_BASE}/recipes/findByIngredients`,
      {
        params: {
          apiKey: API_KEY,
          ingredients: ingredientNames.join(','),
          number: Math.min(Number(number), 20),
          ranking: Number(ranking),
          ignorePantry: String(ignorePantry) === 'true',
        },
      }
    );

    const rawRecipes = spoonacularRes.data;

    if (!rawRecipes.length) {
      return res.json([]);
    }

    const recipeIds = rawRecipes.map((r) => r.id).join(',');

    const bulkRes = await axios.get(
      `${SPOONACULAR_BASE}/recipes/informationBulk`,
      {
        params: {
          apiKey: API_KEY,
          ids: recipeIds,
          includeNutrition: true,
        },
      }
    );

    const detailMap = {};
    bulkRes.data.forEach((detail) => {
      detailMap[detail.id] = detail;
    });

    const suggestions = rawRecipes.map((recipe) => {
      const detail = detailMap[recipe.id] || {};

      const usedIngredients = (recipe.usedIngredients || []).map((ing) => {
        const key = ing.name.toLowerCase();
        const fridgeItem = fridgeMap[key] || null;

        return {
          name: ing.name,
          amount: ing.amount,
          unit: ing.unitLong || ing.unitShort || '',
          inFridge: true,
          expirationDate: fridgeItem?.expirationDate ?? null,
          category: fridgeItem?.category ?? null,
          imageUrl: ing.image
            ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`
            : null,
        };
      });

      const missingIngredients = (recipe.missedIngredients || []).map((ing) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unitLong || ing.unitShort || '',
        inFridge: false,
        imageUrl: ing.image
          ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`
          : null,
      }));

      let status;
      if (missingIngredients.length === 0) {
        status = 'ready';
      } else if (missingIngredients.length <= 2) {
        status = 'almost_ready';
      } else {
        status = 'needs_ingredients';
      }

      const instructions =
        detail.analyzedInstructions?.[0]?.steps?.map((step) => ({
          number: step.number,
          step: step.step,
        })) || [];

      const importantNutrients = ['Calories', 'Protein', 'Carbohydrates', 'Fat'];

      const nutrition =
        detail.nutrition?.nutrients
          ?.filter((n) => importantNutrients.includes(n.name))
          .map((n) => ({
            name: n.name,
            amount: n.amount,
            unit: n.unit,
          })) || [];

      return {
        id: recipe.id,
        name: recipe.title,
        imageUrl: recipe.image || detail.image || null,
        sourceUrl: detail.sourceUrl || null,
        readyInMinutes: detail.readyInMinutes || null,
        servings: detail.servings || null,

        summary: detail.summary
          ? stripHtml(detail.summary).slice(0, 300)
          : null,

        cuisines: detail.cuisines || [],
        dishTypes: detail.dishTypes || [],
        diets: detail.diets || [],

        ingredients: [...usedIngredients, ...missingIngredients],
        missingIngredients,
        usedIngredientCount: recipe.usedIngredientCount,
        missedIngredientCount: recipe.missedIngredientCount,
        status,
        instructions,
        nutrition,
      };
    });

    res.json(suggestions);
  } catch (err) {
    if (err.response) {
      const { status, data } = err.response;

      if (status === 402) {
        return res.status(502).json({
          message: 'Spoonacular daily quota exceeded. Try again tomorrow.',
        });
      }

      if (status === 401) {
        return res.status(502).json({
          message: 'Invalid Spoonacular API key.',
        });
      }

      return res.status(502).json({
        message: 'Spoonacular API error.',
        detail: data?.message || null,
      });
    }

    next(err);
  }
};

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

module.exports = { getMealSuggestions };