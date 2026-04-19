const SIMULATED_ORDERS = [
  {
    id: 'order-001',
    store: 'Whole Foods',
    provider: 'instacart',
    orderedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { name: 'Whole Milk', brand: 'Horizon', quantity: { amount: 1, unit: 'gallon' }, category: 'dairy', expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Greek Yogurt', brand: 'Chobani', quantity: { amount: 2, unit: 'cup' }, category: 'dairy', expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Chicken Breast', brand: null, quantity: { amount: 2, unit: 'lbs' }, category: 'meat', expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Broccoli', brand: null, quantity: { amount: 1, unit: 'head' }, category: 'produce', expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Cheddar Cheese', brand: 'Tillamook', quantity: { amount: 8, unit: 'oz' }, category: 'dairy', expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'order-002',
    store: 'Publix',
    provider: 'instacart',
    orderedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { name: 'Eggs', brand: null, quantity: { amount: 12, unit: 'count' }, category: 'dairy', expirationDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Orange Juice', brand: 'Tropicana', quantity: { amount: 52, unit: 'oz' }, category: 'beverages', expirationDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Ground Beef', brand: null, quantity: { amount: 1, unit: 'lbs' }, category: 'meat', expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Strawberries', brand: null, quantity: { amount: 1, unit: 'pint' }, category: 'produce', expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

const getSimulatedOrders = (userId) => SIMULATED_ORDERS;

module.exports = { getSimulatedOrders };
