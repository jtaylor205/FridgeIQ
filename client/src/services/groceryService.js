import api from './api';

export const groceryService = {
  getOrders: () => api.get('/grocery/orders'),
  importItems: (items) => api.post('/grocery/import', { items }),
  connectAccount: (provider) => api.post('/grocery/connect', { provider }),
  disconnectAccount: () => api.post('/grocery/disconnect'),
};
