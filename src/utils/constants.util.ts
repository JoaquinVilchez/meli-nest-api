export const ENTITY_NAMES = {
  CATEGORIES: 'categories',
  STORES: 'stores',
  USERS: 'users',
  REVIEWS: 'reviews',
  PRODUCTS: 'products',
} as const

export const STORES_POPULATE_OPTIONS = [ENTITY_NAMES.CATEGORIES] as const
export const REVIEWS_POPULATE_OPTIONS = [ENTITY_NAMES.USERS, ENTITY_NAMES.PRODUCTS] as const
export const PRODUCTS_POPULATE_OPTIONS = [ENTITY_NAMES.CATEGORIES, ENTITY_NAMES.STORES] as const

export const CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'MXN'] as const
export const CONDITIONS = ['new', 'used'] as const
export const SHIPPING = ['free', 'standard', 'premium'] as const
