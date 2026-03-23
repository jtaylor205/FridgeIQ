import { MOCK_SCAN_RESULT } from '../mocks/data';

// Real implementation using Open Food Facts — no API key needed (uncomment when ready):
//
// export const barcodeService = {
//   lookup: async (barcode) => {
//     const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
//     const data = await res.json();
//     if (data.status !== 1) throw new Error('Product not found');
//     const p = data.product;
//     return {
//       name: p.product_name,
//       brand: p.brands,
//       imageUrl: p.image_url,
//       nutrition: {
//         calories: p.nutriments?.['energy-kcal_100g'],
//         protein: p.nutriments?.proteins_100g,
//         carbs: p.nutriments?.carbohydrates_100g,
//         fat: p.nutriments?.fat_100g,
//         sugar: p.nutriments?.sugars_100g,
//         fiber: p.nutriments?.fiber_100g,
//         sodium: p.nutriments?.sodium_100g,
//         servingSize: p.serving_size,
//       },
//     };
//   },
// };

export const barcodeService = {
  lookup: async (barcode) => {
    await new Promise((r) => setTimeout(r, 1000));
    return { ...MOCK_SCAN_RESULT };
  },
};
