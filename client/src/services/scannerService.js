import api from './api';

export const scannerService = {
  scanImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/scanner/scan', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
