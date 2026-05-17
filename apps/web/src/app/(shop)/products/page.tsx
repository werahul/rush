'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-skeleton';
import { useProducts } from '@/hooks/use-products';
import type { ProductCategory } from '@rush/shared';

function ProductsContent() {
  const searchParams = useSearchParams();
  const filters = {
    search: searchParams.get('search') ?? undefined,
    category: (searchParams.get('category') as ProductCategory) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: searchParams.get('sort') ?? 'newest',
  };

  const { products, isLoading, fromMock } = useProducts(filters);

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">All Products</h1>
        {searchParams.get('search') && (
          <p className="mt-2 text-sm text-muted-foreground">
            Results for &ldquo;{searchParams.get('search')}&rdquo;
          </p>
        )}
        {fromMock && (
          <p className="mt-1 text-xs text-muted-foreground">Showing demo catalog — API offline</p>
        )}
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <ProductFilters className="lg:w-56 lg:shrink-0" />
        <div className="flex-1">
          {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={products} />}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
