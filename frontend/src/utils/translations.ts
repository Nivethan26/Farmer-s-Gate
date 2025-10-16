// Translation key mappings for products and categories

export const categoryTranslationKeys: Record<string, string> = {
  'cat-1': 'categories.vegetables',
  'cat-2': 'categories.fruits',
  'cat-3': 'categories.riceGrains',
  'cat-4': 'categories.spices',
  'cat-5': 'categories.coconut',
};

export const productNameToKey: Record<string, string> = {
  'Fresh Tomatoes': 'products.freshTomatoes',
  'Red Onions': 'products.redOnions',
  'Green Chillies': 'products.greenChillies',
  'Carrots': 'products.carrots',
  'Potatoes': 'products.potatoes',
  'Cabbage': 'products.cabbage',
  'Bananas': 'products.bananas',
  'Mangoes': 'products.mangoes',
  'Papayas': 'products.papayas',
  'Pineapples': 'products.pineapples',
};

// Helper function to get translated category name
export const getCategoryTranslationKey = (categoryId: string): string => {
  return categoryTranslationKeys[categoryId] || '';
};

// Helper function to get translated product name
export const getProductNameTranslationKey = (productName: string): string => {
  return productNameToKey[productName] || '';
};
