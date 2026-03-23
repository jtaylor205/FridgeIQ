const FridgeItem = require('../models/FridgeItem');

const getMealSuggestions = async (req, res, next) => {
  try {
    const items = await FridgeItem.find({ fridge: req.user.fridge });
    const ingredientNames = items.map((i) => i.name.toLowerCase());

    // TODO: call a recipe API (Spoonacular, Edamam) with ingredientNames
    const suggestions = [
      {
        id: 'mock-1',
        name: 'Meal suggestion',
        imageUrl: null,
        ingredients: ingredientNames.slice(0, 3).map((name) => ({ name, inFridge: true })),
        missingIngredients: [],
        status: 'ready',
      },
    ];

    res.json(suggestions);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMealSuggestions };
