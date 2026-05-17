import type { Product } from '@rush/shared';
import { ProductCard } from '@/components/product/product-card';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium">No products found</p>
        <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} priority={i < 4} index={i} />
      ))}
    </div>
  );
}
