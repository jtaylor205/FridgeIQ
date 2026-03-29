import api from './api';

export const mealService = {
  getSuggestions: () => api.get('/meals/suggestions'),
};
