import api from './api';

export const barcodeService = {
  lookup: async (barcode) => {
    const response = await api.post('/scanner/upc', { upc: barcode });
    return response;
  },
  scanImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/scanner/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  }
};
