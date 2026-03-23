import { MOCK_SCAN_RESULT } from '../mocks/data';

// Real API call (uncomment when backend is ready):
// import api from './api';
// export const scannerService = {
//   scanImage: (file) => {
//     const form = new FormData();
//     form.append('image', file);
//     return api.post('/scanner/scan', form, { headers: { 'Content-Type': 'multipart/form-data' } });
//   },
// };

export const scannerService = {
  scanImage: async (file) => {
    await new Promise((r) => setTimeout(r, 1500));
    return { ...MOCK_SCAN_RESULT, imageUrl: URL.createObjectURL(file) };
  },
};
