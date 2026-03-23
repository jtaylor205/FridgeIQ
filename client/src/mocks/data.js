export const MOCK_USER = {
  id: 'mock-user-1',
  name: 'Jaedon',
  email: 'jaedon@example.com',
  fridge: 'mock-fridge-1',
  connectedGroceryAccount: { connected: false, provider: null },
};

export const MOCK_FRIDGE_ITEMS = [
  {
    _id: 'item-1',
    name: 'Broccoli',
    brand: null,
    quantity: { amount: 2, unit: 'heads' },
    expirationDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    shelf: 'top',
    category: 'produce',
    isShared: false,
    importSource: 'manual',
    addedBy: { name: 'Jaedon' },
    nutrition: { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, vitamins: ['Vitamin C', 'Vitamin K'] },
    imageUrl: null,
  },
  {
    _id: 'item-2',
    name: 'Whole Milk',
    brand: 'Horizon',
    quantity: { amount: 1, unit: 'gallon' },
    expirationDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    shelf: 'middle',
    category: 'dairy',
    isShared: true,
    importSource: 'grocery_import',
    addedBy: { name: 'Jaedon' },
    nutrition: { calories: 149, protein: 8, carbs: 12, fat: 8 },
    imageUrl: null,
  },
  {
    _id: 'item-3',
    name: 'Chicken Breast',
    brand: null,
    quantity: { amount: 2, unit: 'lbs' },
    expirationDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    shelf: 'bottom',
    category: 'meat',
    isShared: false,
    importSource: 'grocery_import',
    addedBy: { name: 'Jaedon' },
    nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    imageUrl: null,
  },
  {
    _id: 'item-4',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    quantity: { amount: 4, unit: 'cups' },
    expirationDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    shelf: 'middle',
    category: 'dairy',
    isShared: false,
    importSource: 'scan',
    addedBy: { name: 'Jaedon' },
    nutrition: { calories: 100, protein: 17, carbs: 6, fat: 0, sugar: 4, sodium: 60, servingSize: '150g', vitamins: ['Calcium 15% DV', 'Vitamin D 10% DV'] },
    imageUrl: null,
  },
  {
    _id: 'item-5',
    name: 'Cheddar Cheese',
    brand: 'Tillamook',
    quantity: { amount: 8, unit: 'oz' },
    expirationDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    shelf: 'door',
    category: 'dairy',
    isShared: false,
    importSource: 'grocery_import',
    addedBy: { name: 'Jaedon' },
    nutrition: { calories: 110, protein: 7, carbs: 0, fat: 9 },
    imageUrl: null,
  },
  {
    _id: 'item-6',
    name: 'Strawberries',
    brand: null,
    quantity: { amount: 1, unit: 'pint' },
    expirationDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    shelf: 'drawer',
    category: 'produce',
    isShared: false,
    importSource: 'manual',
    addedBy: { name: 'Jaedon' },
    nutrition: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
    imageUrl: null,
  },
];

export const MOCK_FRIDGE = {
  _id: 'mock-fridge-1',
  name: "Jaedon's Fridge",
  owner: 'mock-user-1',
  members: [],
  isShared: false,
  items: MOCK_FRIDGE_ITEMS,
};

export const MOCK_EXPIRATION_ALERTS = {
  expired: MOCK_FRIDGE_ITEMS.filter((i) => new Date(i.expirationDate) < new Date()),
  today: MOCK_FRIDGE_ITEMS.filter((i) => {
    const d = new Date(i.expirationDate);
    const now = new Date();
    return d >= now && d < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  }),
  tomorrow: MOCK_FRIDGE_ITEMS.filter((i) => {
    const d = new Date(i.expirationDate);
    const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    return d >= start && d < end;
  }),
  thisWeek: MOCK_FRIDGE_ITEMS.filter((i) => {
    const d = new Date(i.expirationDate);
    const now = new Date();
    const weekOut = new Date(now.getTime() + 7 * 86400000);
    const twoDaysOut = new Date(now.getTime() + 2 * 86400000);
    return d >= twoDaysOut && d <= weekOut;
  }),
};

export const MOCK_MEAL_SUGGESTIONS = [
  {
    id: 'meal-1',
    name: 'Chicken Parmesan',
    imageUrl: null,
    status: 'in-progress',
    ingredients: [
      { name: 'Chicken Breast', inFridge: true },
      { name: 'Pasta', inFridge: false },
    ],
    missingIngredients: ['Pasta'],
  },
  {
    id: 'meal-2',
    name: 'Broccoli & Cheese Bake',
    imageUrl: null,
    status: 'ready',
    ingredients: [
      { name: 'Broccoli', inFridge: true },
      { name: 'Cheddar Cheese', inFridge: true },
    ],
    missingIngredients: [],
  },
  {
    id: 'meal-3',
    name: 'Yogurt Parfait',
    imageUrl: null,
    status: 'in-progress',
    ingredients: [
      { name: 'Greek Yogurt', inFridge: true },
      { name: 'Granola', inFridge: false },
      { name: 'Strawberries', inFridge: true },
    ],
    missingIngredients: ['Granola'],
  },
  {
    id: 'meal-4',
    name: 'Cheeseburger',
    imageUrl: null,
    status: 'ready',
    ingredients: [
      { name: 'Cheddar Cheese', inFridge: true },
      { name: 'Whole Milk', inFridge: true },
    ],
    missingIngredients: [],
  },
];

export const MOCK_GROCERY_ORDERS = [
  {
    id: 'order-001',
    store: 'Whole Foods',
    provider: 'instacart',
    orderedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    items: [
      { name: 'Whole Milk', brand: 'Horizon', quantity: { amount: 1, unit: 'gallon' }, category: 'dairy', expirationDate: new Date(Date.now() + 10 * 86400000).toISOString() },
      { name: 'Greek Yogurt', brand: 'Chobani', quantity: { amount: 2, unit: 'cup' }, category: 'dairy', expirationDate: new Date(Date.now() + 14 * 86400000).toISOString() },
      { name: 'Chicken Breast', brand: null, quantity: { amount: 2, unit: 'lbs' }, category: 'meat', expirationDate: new Date(Date.now() + 3 * 86400000).toISOString() },
      { name: 'Broccoli', brand: null, quantity: { amount: 1, unit: 'head' }, category: 'produce', expirationDate: new Date(Date.now() + 7 * 86400000).toISOString() },
      { name: 'Cheddar Cheese', brand: 'Tillamook', quantity: { amount: 8, unit: 'oz' }, category: 'dairy', expirationDate: new Date(Date.now() + 30 * 86400000).toISOString() },
    ],
  },
  {
    id: 'order-002',
    store: 'Publix',
    provider: 'instacart',
    orderedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    items: [
      { name: 'Eggs', brand: null, quantity: { amount: 12, unit: 'count' }, category: 'dairy', expirationDate: new Date(Date.now() + 21 * 86400000).toISOString() },
      { name: 'Orange Juice', brand: 'Tropicana', quantity: { amount: 52, unit: 'oz' }, category: 'beverages', expirationDate: new Date(Date.now() + 12 * 86400000).toISOString() },
      { name: 'Ground Beef', brand: null, quantity: { amount: 1, unit: 'lbs' }, category: 'meat', expirationDate: new Date(Date.now() + 2 * 86400000).toISOString() },
      { name: 'Strawberries', brand: null, quantity: { amount: 1, unit: 'pint' }, category: 'produce', expirationDate: new Date(Date.now() - 1 * 86400000).toISOString() },
    ],
  },
];

export const MOCK_SCAN_RESULT = {
  name: 'Greek Yogurt',
  brand: 'Chobani',
  expirationDate: new Date(Date.now() + 14 * 86400000).toISOString(),
  imageUrl: null,
  nutrition: {
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    sugar: 4,
    fiber: 0,
    sodium: 60,
    servingSize: '150g',
    vitamins: ['Calcium: 15% DV', 'Vitamin D: 10% DV', 'Potassium: 5% DV'],
  },
};
