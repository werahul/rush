'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchFeaturedProducts, fetchProductBySlug, fetchProducts } from '@/lib/products';
import type { PaginationMeta, Product, ProductFilters } from '@rush/shared';

interface UseProductsResult {
  products: Product[];
  meta?: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  fromMock: boolean;
  refetch: () => void;
}

export function useProducts(filters?: ProductFilters): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromMock, setFromMock] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProducts(filters);
      setProducts(result.products);
      setMeta(result.meta);
      setFromMock(result.fromMock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, meta, isLoading, error, fromMock, refetch: load };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const result = await fetchFeaturedProducts();
      if (!cancelled) {
        setProducts(result.products);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, isLoading };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const result = await fetchProductBySlug(slug);
      if (!cancelled) {
        setProduct(result.product);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, isLoading };
}
