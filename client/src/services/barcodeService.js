import api from './api';

export const barcodeService = {
  lookup: async (barcode) => {
    // Calls our secure backend proxy to hit the Avocavo API
    const response = await api.post('/scanner/upc', { upc: barcode });
    return response; // The custom api client already unwraps res.data in its interceptor!
  },
};
