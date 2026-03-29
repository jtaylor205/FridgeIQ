import api from './api';

export const expirationService = {
  getAlerts: () => api.get('/expiration/alerts'),
};
