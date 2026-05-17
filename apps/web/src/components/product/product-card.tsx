'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Product } from '@rush/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { useWishlistStore } from '@/stores/wishlist-store';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

export function ProductCard({ product, priority, index = 0 }: ProductCardProps) {
  const { toggle, has } = useWishlistStore();
  const inWishlist = has(product._id);
  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const hoverImage = product.images[1];
  const discount = getDiscountPercent(product.basePrice, product.compareAtPrice);

  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: (index % 4) * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <motion.div
          className="relative aspect-[3/4] overflow-hidden bg-muted"
          whileHover="hover"
          initial="rest"
        >
          {image && (
            <>
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority={priority}
                className={cn(
                  'object-cover transition-all duration-700 ease-out',
                  hoverImage && 'group-hover:opacity-0 group-hover:scale-105'
                )}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              {hoverImage && (
                <Image
                  src={hoverImage.url}
                  alt={hoverImage.alt}
                  fill
                  className="object-cover opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}
            </>
          )}
          <motion.div
            className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10"
            variants={{ rest: {}, hover: {} }}
          />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isNewArrival && <Badge variant="new">New</Badge>}
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-white">Quick view</p>
          </motion.div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'absolute right-2 top-2 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300',
              'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100',
              inWishlist && 'opacity-100 scale-100'
            )}
            onClick={(e) => {
              e.preventDefault();
              toggle(product._id);
            }}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <motion.span whileTap={{ scale: 0.85 }}>
              <Heart className={cn('h-4 w-4 transition-colors', inWishlist && 'fill-foreground')} />
            </motion.span>
          </Button>
        </motion.div>
        <div className="mt-3 space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {product.category.replace('-', ' ')}
          </p>
          <h3 className="text-sm font-medium leading-snug transition-colors group-hover:text-muted-foreground">
            {product.name}
          </h3>
          <motion.div
            className="flex items-center gap-2"
            layout
          >
            <span className="text-sm font-semibold">{formatPrice(product.basePrice)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </motion.div>
        </div>
      </Link>
    </motion.article>
  );
}
