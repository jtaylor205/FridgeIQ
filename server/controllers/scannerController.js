const scanFoodLabel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // TODO: pass req.file to a vision/nutrition API (Nutritionix, Open Food Facts, Google Vision)
    const result = {
      name: 'Detected Item',
      brand: null,
      expirationDate: null,
      imageUrl: `/uploads/${req.file.filename}`,
      nutrition: {
        calories: null,
        protein: null,
        carbs: null,
        fat: null,
        sugar: null,
        fiber: null,
        sodium: null,
        servingSize: null,
        vitamins: [],
      },
    };

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { scanFoodLabel };
