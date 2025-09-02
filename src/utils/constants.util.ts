export const ENTITY_NAMES = {
  ANSWERS: 'answers',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  QUESTIONS: 'questions',
  REVIEWS: 'reviews',
  STORES: 'stores',
  USERS: 'users',
} as const

export const STORES_POPULATE_OPTIONS = [ENTITY_NAMES.CATEGORIES] as const
export const REVIEWS_POPULATE_OPTIONS = [ENTITY_NAMES.USERS, ENTITY_NAMES.PRODUCTS] as const
export const PRODUCTS_POPULATE_OPTIONS = [
  ENTITY_NAMES.CATEGORIES,
  ENTITY_NAMES.STORES,
  ENTITY_NAMES.QUESTIONS,
] as const

export const ANSWERS_POPULATE_OPTIONS = [ENTITY_NAMES.USERS] as const
export const QUESTIONS_POPULATE_OPTIONS = [ENTITY_NAMES.USERS, ENTITY_NAMES.ANSWERS] as const

export const CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'MXN'] as const
export const CONDITIONS = ['new', 'used'] as const
export const SHIPPING = ['free', 'standard', 'premium'] as const
