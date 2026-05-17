'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { PAGE_IMAGES } from '@/lib/images';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-skeleton';
import { fetchProducts } from '@/lib/products';
import { filterMockProducts } from '@/lib/mock-data';
import { useWishlistStore } from '@/stores/wishlist-store';
import type { Product } from '@rush/shared';

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    (async () => {
      setIsLoading(true);
      try {
        const { products: all } = await fetchProducts({ limit: 100 });
        setProducts(all.filter((p) => productIds.includes(p._id)));
      } catch {
        setProducts(filterMockProducts().filter((p) => productIds.includes(p._id)));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [productIds]);

  if (!isLoading && productIds.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="relative mb-8 h-48 w-48 overflow-hidden rounded-full">
          <Image src={PAGE_IMAGES.emptyWishlist} alt="" fill className="object-cover" sizes="192px" />
        </div>
        <Heart className="mb-4 h-8 w-8 text-muted-foreground" strokeWidth={1} />
        <h1 className="text-2xl font-semibold">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Save items you love for later</p>
        <Button variant="rush" className="mt-8" asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <h1 className="mb-10 text-2xl font-semibold tracking-tight md:text-3xl">Wishlist</h1>
      {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={products} />}
    </div>
  );
}
