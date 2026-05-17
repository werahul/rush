'use client';

import { use } from 'react';
import { CATEGORIES } from '@rush/shared';
import { CollectionHero } from '@/components/shop/collection-hero';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-skeleton';
import { useProducts } from '@/hooks/use-products';
import type { ProductCategory } from '@rush/shared';
import { notFound } from 'next/navigation';

export default function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const cat = CATEGORIES.find((c) => c.id === category);

  if (!cat) notFound();

  const { products, isLoading, fromMock } = useProducts({
    category: category as ProductCategory,
  });

  return (
    <>
      <CollectionHero title={cat.label} categoryId={category} />
      <div className="container mx-auto px-4 pb-10 md:pb-14">
        {fromMock && (
          <p className="mb-6 text-xs text-muted-foreground">Showing demo catalog — API offline</p>
        )}
        <div className="flex flex-col gap-10 lg:flex-row">
          <ProductFilters className="lg:w-56 lg:shrink-0" />
          <div className="flex-1">
            {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={products} />}
          </div>
        </div>
      </div>
    </>
  );
}
