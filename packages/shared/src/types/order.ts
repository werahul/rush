import type { Address } from './common';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentProvider = 'stripe' | 'razorpay' | 'cod';

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentProvider?: PaymentProvider;
  paymentId?: string;
  timeline: OrderTimelineEvent[];
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}
