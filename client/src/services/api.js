import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_URL;
const normalizedBaseUrl = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/+$/, '')
  : '/api';

const api = axios.create({ baseURL: normalizedBaseUrl });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || err)
);

export default api;
