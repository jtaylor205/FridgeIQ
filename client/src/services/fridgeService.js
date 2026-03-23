import { MOCK_FRIDGE } from '../mocks/data';

// Real API calls (uncomment when backend is ready):
// import api from './api';
// export const fridgeService = {
//   getFridge: () => api.get('/fridge'),
//   addItem: (data) => api.post('/fridge/items', data),
//   updateItem: (id, data) => api.put(`/fridge/items/${id}`, data),
//   deleteItem: (id) => api.delete(`/fridge/items/${id}`),
// };

export const fridgeService = {
  getFridge: async () => structuredClone(MOCK_FRIDGE),
  addItem: async (data) => ({ _id: `item-${Date.now()}`, addedBy: { name: 'Jaedon' }, importSource: 'manual', ...data }),
  updateItem: async (id, data) => ({ _id: id, ...data }),
  deleteItem: async (id) => ({ message: 'Item removed' }),
};
