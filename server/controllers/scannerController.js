const fetchAvocavoData = async (upc) => {
  const apiKey = process.env.AVOCAVO_API_KEY;
  if (!apiKey) {
    throw new Error('Avocavo API key not configured on server');
  }

  const response = await fetch('https://app.avocavo.app/api/v2/upc/ingredient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ upc }),
  });

  if (!response.ok) {
    const errText = await response.text();
    try {
      const errData = JSON.parse(errText);
      if (errData.error === 'Product not found') {
        return null;
      }
    } catch (e) {}
    throw new Error(`Failed to fetch from Avocavo API: ${errText}`);
  }

  const data = await response.json();
  if (!data.success || !data.product) {
    return null;
  }

  const p = data.product;
  const nData = data.nutrition?.data || {};
  const per100g = nData.per_100g || {};

  const roundToWhole = (val) => typeof val === 'number' ? Math.round(val) : (val ?? null);

  return {
    name: p.name || 'Unknown Product',
    brand: p.brand || null,
    imageUrl: p.image_url || null,
    nutrition: {
      calories: roundToWhole(per100g.calories),
      protein: roundToWhole(per100g.protein),
      carbs: roundToWhole(per100g.carbohydrates),
      fat: roundToWhole(per100g.fat),
      sugar: roundToWhole(per100g.sugars),
      fiber: roundToWhole(per100g.fiber),
      sodium: roundToWhole(per100g.sodium),
      servingSize: nData.serving_size ?? null,
    },
  };
};

const extractUPCFromText = (text) => {
  if (!text) return null;
  const match = text.replace(/-/g, '').match(/\b\d{8,14}\b/);
  if (match) {
    return match[0];
  }

  const numericOnly = text.replace(/\D/g, '');
  if (numericOnly.length >= 8 && numericOnly.length <= 14) {
    return numericOnly;
  }
  return null;
}

const scanFoodLabel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const visionApiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!visionApiKey) {
      return res.status(500).json({ message: 'Google Vision API key not configured' });
    }

    const base64Image = req.file.buffer.toString('base64');

    const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION' }]
          }
        ]
      })
    });

    if (!visionResponse.ok) {
      const errText = await visionResponse.text();
      console.error('[scanFoodLabel] Vision API Error:', errText);
      return res.status(visionResponse.status).json({ message: 'Error processing image with Vision API' });
    }

    const visionData = await visionResponse.json();
    const annotations = visionData.responses[0]?.textAnnotations;

    if (!annotations || annotations.length === 0) {
      return res.status(400).json({ message: 'No text/barcode found in the image' });
    }

    const detectedText = annotations[0].description;

    const extractedUPC = extractUPCFromText(detectedText);

    if (!extractedUPC) {
      return res.status(400).json({ message: 'Could not detect a valid barcode number in the image' });
    }

    console.log(`[scanFoodLabel] Successfully read UPC from image: ${extractedUPC}`);

    const productResult = await fetchAvocavoData(extractedUPC);

    if (!productResult) {
      return res.status(404).json({ 
        message: `Product not found for detected UPC: ${extractedUPC}`,
        upc: extractedUPC
      });
    }

    res.json(productResult);
  } catch (err) {
    console.error('[scanFoodLabel] Internal Error:', err.message);
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

    const productResult = await fetchAvocavoData(upc);

    if (!productResult) {
      console.log('[lookupUPC] Product not found or success is false');
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('[lookupUPC] Sending parsed result back to client');
    res.json(productResult);
  } catch (err) {
    console.error('[lookupUPC] Internal Error:', err.message);

    if (err.message.includes('not configured')) {
      return res.status(500).json({ message: err.message });
    }
    next(err);
  }
};

const parseNutritionLabel = (text) => {
  const getTextNum = (regex) => {
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : null;
  };

  const calories = getTextNum(/Calories\s+(\d+)/i);
  const totalFat = getTextNum(/Total\s*Fat\s*([\d.]+)/i);
  const sodium = getTextNum(/Sodium\s*([\d.]+)/i);
  const carbs = getTextNum(/(?:Total\s*)?Carbohydrate\s*([\d.]+)/i) || getTextNum(/Carbs\s*([\d.]+)/i);
  const fiber = getTextNum(/(?:Dietary\s*)?Fiber\s*([\d.]+)/i);
  const sugar = getTextNum(/(?:Total\s*)?Sugars?\s*([\d.]+)/i);
  const protein = getTextNum(/Protein\s*([\d.]+)/i);

  const servingMatch = text.match(/Serving\s*size\s*([^\n]+)/i);
  const servingSize = servingMatch ? servingMatch[1].trim() : null;

  return {
    name: "Scanned Nutrition Label",
    brand: null,
    imageUrl: null,
    nutrition: {
      calories,
      protein,
      carbs,
      fat: totalFat,
      sugar,
      fiber,
      sodium,
      servingSize
    }
  };
};

const scanNutritionLabel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const visionApiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!visionApiKey) {
      return res.status(500).json({ message: 'Google Vision API key not configured' });
    }

    const base64Image = req.file.buffer.toString('base64');

    const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION' }]
          }
        ]
      })
    });

    if (!visionResponse.ok) {
      const errText = await visionResponse.text();
      console.error('[scanNutritionLabel] Vision API Error:', errText);
      return res.status(visionResponse.status).json({ message: 'Error processing image with Vision API' });
    }

    const visionData = await visionResponse.json();
    const annotations = visionData.responses[0]?.textAnnotations;

    if (!annotations || annotations.length === 0) {
      return res.status(400).json({ message: 'No text found in the image' });
    }

    const detectedText = annotations[0].description;
    const nutritionInfo = parseNutritionLabel(detectedText);

    res.json(nutritionInfo);
  } catch (err) {
    console.error('[scanNutritionLabel] Internal Error:', err.message);
    next(err);
  }
};

module.exports = { scanFoodLabel, lookupUPC, scanNutritionLabel };
