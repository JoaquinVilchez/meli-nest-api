export const ENTITY_NAMES = {
  CATEGORIES: 'categories',
  STORES: 'stores',
  USERS: 'users',
  REVIEWS: 'reviews',
  PRODUCTS: 'products',
} as const

export const STORES_POPULATE_OPTIONS = [ENTITY_NAMES.CATEGORIES] as const
export const REVIEWS_POPULATE_OPTIONS = [ENTITY_NAMES.USERS, ENTITY_NAMES.STORES] as const
