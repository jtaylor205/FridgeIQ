import { MOCK_GROCERY_ORDERS } from '../mocks/data';

// Real API calls (uncomment when backend is ready):
// import api from './api';
// export const groceryService = {
//   getOrders: () => api.get('/grocery/orders'),
//   importItems: (items) => api.post('/grocery/import', { items }),
//   connectAccount: (provider) => api.post('/grocery/connect', { provider }),
//   disconnectAccount: () => api.post('/grocery/disconnect'),
// };

export const groceryService = {
  getOrders: async () => MOCK_GROCERY_ORDERS,
  importItems: async (items) => ({ imported: items.length, items }),
  connectAccount: async (provider) => ({ connected: true, provider }),
  disconnectAccount: async () => ({ connected: false }),
};
