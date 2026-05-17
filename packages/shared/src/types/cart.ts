export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface Cart {
  _id?: string;
  userId?: string;
  items: CartItem[];
  updatedAt?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}
