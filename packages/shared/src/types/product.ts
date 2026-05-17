export type ProductCategory = 'mens-wear' | 'gym-outfits' | 'accessories';

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  price: number;
  compareAtPrice?: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  basePrice: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
