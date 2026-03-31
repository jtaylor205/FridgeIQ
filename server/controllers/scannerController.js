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

const lookupUPC = async (req, res, next) => {
  try {
    console.log('[lookupUPC] Received request body:', req.body);
    const { upc } = req.body;
    if (!upc) {
      console.log('[lookupUPC] Missing UPC');
      return res.status(400).json({ message: 'Missing UPC in request body' });
    }

    const apiKey = process.env.AVOCAVO_API_KEY;
    if (!apiKey) {
      console.log('[lookupUPC] Missing API Key in ENV');
      return res.status(500).json({ message: 'Avocavo API key not configured on server' });
    }

    console.log('[lookupUPC] Fetching from Avocavo for UPC:', upc);
    const response = await fetch('https://app.avocavo.app/api/v2/upc/ingredient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ upc }),
    });

    console.log('[lookupUPC] Avocavo Response Status:', response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error('[lookupUPC] Avocavo Error Response:', errText);
      return res.status(response.status).json({
        message: 'Failed to fetch from Avocavo API',
        details: errText
      });
    }

    const data = await response.json();
    console.log('[lookupUPC] Avocavo Data Received:', JSON.stringify(data, null, 2));

    if (!data.success || !data.product) {
      console.log('[lookupUPC] Product not found or success is false');
      return res.status(404).json({ message: 'Product not found' });
    }

    const p = data.product;
    const nData = data.nutrition?.data || {};
    const per100g = nData.per_100g || {};

    // Map the Avocavo response into the format our frontend expects
    const result = {
      name: p.name || 'Unknown Product',
      brand: p.brand || null,
      imageUrl: p.image_url || null,
      nutrition: {
        calories: per100g.calories ? Math.round(per100g.calories) : null,
        protein: per100g.protein ?? null,
        carbs: per100g.carbohydrates ?? null,
        fat: per100g.fat ?? null,
        sugar: per100g.sugars ?? null,
        fiber: per100g.fiber ?? null,
        sodium: per100g.sodium ?? null,
        servingSize: nData.serving_size ?? null,
      },
    };

    console.log('[lookupUPC] Sending parsed result back to client');
    res.json(result);
  } catch (err) {
    console.error('[lookupUPC] Internal Error:', err.message);
    next(err);
  }
};


module.exports = { scanFoodLabel, lookupUPC };
