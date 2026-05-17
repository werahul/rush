import mongoose, { Schema, Document } from 'mongoose';

const variantSchema = new Schema({
  sku: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: String,
  stock: { type: Number, required: true, min: 0, default: 0 },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: Number,
});

const imageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
});

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: 'mens-wear' | 'gym-outfits' | 'accessories';
  subcategory?: string;
  brand: string;
  tags: string[];
  images: { url: string; alt: string; isPrimary?: boolean }[];
  variants: {
    sku: string;
    size: string;
    color: string;
    colorHex?: string;
    stock: number;
    price: number;
    compareAtPrice?: number;
  }[];
  basePrice: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: String,
    category: {
      type: String,
      enum: ['mens-wear', 'gym-outfits', 'accessories'],
      required: true,
    },
    subcategory: String,
    brand: { type: String, required: true, default: 'RUSH' },
    tags: [{ type: String, lowercase: true }],
    images: [imageSchema],
    variants: [variantSchema],
    basePrice: { type: Number, required: true, min: 0 },
    compareAtPrice: Number,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isFeatured: 1, isNewArrival: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
