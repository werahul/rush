export const BRAND = {
  name: 'RUSH',
  tagline: 'Move Fast. Dress Bold.',
  description: 'Premium modern streetwear for men — gym fits, everyday essentials, and accessories.',
} as const;

export const CATEGORIES = [
  { id: 'mens-wear', label: "Men's Wear", href: '/collections/mens-wear' },
  { id: 'gym-outfits', label: 'Gym Outfits', href: '/collections/gym-outfits' },
  { id: 'accessories', label: 'Accessories', href: '/collections/accessories' },
] as const;

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  PRODUCTS: '/products',
  CART: '/cart',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  COUPONS: '/coupons',
  USERS: '/users',
  ADMIN: '/admin',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  refunded: 'Refunded',
};
