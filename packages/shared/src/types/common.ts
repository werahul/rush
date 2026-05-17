export type UserRole = 'user' | 'admin';

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'popular';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface Address {
  _id?: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}
