import { MOCK_USER } from '../mocks/data';

// Real API calls (uncomment when backend is ready):
// import api from './api';
// export const authService = {
//   register: (name, email, password) => api.post('/auth/register', { name, email, password }),
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   getMe: () => api.get('/auth/me'),
// };

export const authService = {
  register: async (name, email, password) => ({ token: 'mock-token', user: { ...MOCK_USER, name, email } }),
  login: async (email, password) => ({ token: 'mock-token', user: { ...MOCK_USER, email } }),
  getMe: async () => MOCK_USER,
};
