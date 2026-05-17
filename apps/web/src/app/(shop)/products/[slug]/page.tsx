'use client';

import Image from 'next/image';
import { use, useMemo, useState } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductGridSkeleton } from '@/components/product/product-skeleton';
import { useProduct } from '@/hooks/use-products';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import type { ProductVariant } from '@rush/shared';
import { cn } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { product, isLoading } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);

  const colors = useMemo(
    () => [...new Set(product?.variants.map((v) => v.color) ?? [])],
    [product]
  );
  const sizes = useMemo(
    () => [...new Set(product?.variants.map((v) => v.size) ?? [])],
    [product]
  );

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const activeColor = selectedColor || colors[0] || '';
  const activeSize = selectedSize || sizes[0] || '';

  const selectedVariant: ProductVariant | undefined = product?.variants.find(
    (v) => v.color === activeColor && v.size === activeSize
  );

  const primaryImage = product?.images.find((i) => i.isPrimary) ?? product?.images[0];
  const discount = product ? getDiscountPercent(product.basePrice, product.compareAtPrice) : 0;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      toast.error('Please select size and color');
      return;
    }
    if (selectedVariant.stock < 1) {
      toast.error('Out of stock');
      return;
    }
    addItem({
      productId: product._id,
      sku: selectedVariant.sku,
      name: product.name,
      slug: product.slug,
      image: primaryImage?.url ?? '',
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      quantity,
      maxStock: selectedVariant.stock,
    });
    toast.success('Added to bag');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <ProductGridSkeleton count={1} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {primaryImage && (
            <Image src={primaryImage.url} alt={primaryImage.alt} fill className="object-cover" priority sizes="50vw" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex gap-2">
            {product.isNewArrival && <Badge variant="new">New</Badge>}
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-foreground" />
            <span>{product.rating}</span>
            <span>({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(selectedVariant?.price ?? product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest">Color — {activeColor}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'flex h-10 items-center gap-2 rounded-md border px-3 text-sm',
                        activeColor === color && 'border-foreground ring-1 ring-foreground'
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: variant?.colorHex ?? '#ccc' }}
                      />
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const inStock = product.variants.some(
                    (v) => v.size === size && v.color === activeColor && v.stock > 0
                  );
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[3rem] rounded-md border px-4 py-2 text-sm transition-colors',
                        activeSize === size && 'border-foreground bg-foreground text-background',
                        !inStock && 'cursor-not-allowed opacity-40'
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest">Qty</p>
              <div className="flex items-center border">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-accent">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock ?? 1, quantity + 1))}
                  className="p-2 hover:bg-accent"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {selectedVariant && (
                <span className="text-xs text-muted-foreground">{selectedVariant.stock} in stock</span>
              )}
            </div>
          </div>

          <Button variant="rush" size="xl" className="mt-10 w-full md:w-auto" onClick={handleAddToCart}>
            Add to Bag
          </Button>
        </div>
      </div>
    </div>
  );
}
