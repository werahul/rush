import { api } from '@/lib/api';
import { filterMockProducts, getMockProductBySlug, MOCK_PRODUCTS } from '@/lib/mock-data';
import type { PaginationMeta, Product, ProductFilters } from '@rush/shared';

export async function fetchProducts(
  filters?: ProductFilters
): Promise<{ products: Product[]; meta?: PaginationMeta; fromMock: boolean }> {
  try {
    const res = await api.get<Product[]>('/products', filters as Record<string, string | number | boolean | undefined>);
    return { products: res.data ?? [], meta: res.meta, fromMock: false };
  } catch {
    return {
      products: filterMockProducts(filters),
      meta: {
        page: 1,
        limit: filters?.limit ?? 20,
        total: MOCK_PRODUCTS.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      fromMock: true,
    };
  }
}

export async function fetchFeaturedProducts(): Promise<{ products: Product[]; fromMock: boolean }> {
  try {
    const res = await api.get<Product[]>('/products/featured');
    return { products: res.data ?? [], fromMock: false };
  } catch {
    return {
      products: filterMockProducts({ isFeatured: true }),
      fromMock: true,
    };
  }
}

export async function fetchProductBySlug(
  slug: string
): Promise<{ product: Product | null; fromMock: boolean }> {
  try {
    const res = await api.get<Product>(`/products/${slug}`);
    return { product: res.data ?? null, fromMock: false };
  } catch {
    return { product: getMockProductBySlug(slug) ?? null, fromMock: true };
  }
}
