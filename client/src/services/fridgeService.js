import api from './api';

export const fridgeService = {
  getFridge: () => api.get('/fridge'),
  addItem: (data) => api.post('/fridge/items', data),
  updateItem: (id, data) => api.put(`/fridge/items/${id}`, data),
  deleteItem: (id) => api.delete(`/fridge/items/${id}`),
};
