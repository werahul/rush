import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(['mens-wear', 'gym-outfits', 'accessories']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sizes: z.string().optional().transform((v) => (v ? v.split(',') : undefined)),
  colors: z.string().optional().transform((v) => (v ? v.split(',') : undefined)),
  brands: z.string().optional().transform((v) => (v ? v.split(',') : undefined)),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating', 'popular']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(48).default(12),
  featured: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  newArrival: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  category: z.enum(['mens-wear', 'gym-outfits', 'accessories']),
  subcategory: z.string().optional(),
  brand: z.string().default('RUSH'),
  tags: z.array(z.string()).optional(),
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string().optional(),
      isPrimary: z.boolean().optional(),
    })
  ),
  variants: z.array(
    z.object({
      sku: z.string(),
      size: z.string(),
      color: z.string(),
      colorHex: z.string().optional(),
      stock: z.number().min(0),
      price: z.number().min(0),
      compareAtPrice: z.number().optional(),
    })
  ),
  basePrice: z.number().min(0),
  compareAtPrice: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
});
