import api from './api';

export const barcodeService = {
  lookup: async (barcode) => {
    const response = await api.post('/scanner/upc', { upc: barcode });
    return response;
  },
};
