import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Product, Coupon, Category } from '../models';

dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);

const PRODUCTS = [
  {
    name: 'RUSH Oversized Street Tee',
    slug: 'rush-oversized-street-tee',
    description:
      'Premium heavyweight cotton oversized tee with minimal RUSH branding. Perfect for everyday street style.',
    shortDescription: 'Heavyweight oversized cotton tee',
    category: 'mens-wear',
    brand: 'RUSH',
    tags: ['tee', 'oversized', 'streetwear'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Oversized Street Tee',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RST-BLK-S', size: 'S', color: 'Black', colorHex: '#000000', stock: 50, price: 899 },
      { sku: 'RST-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', stock: 80, price: 899 },
      { sku: 'RST-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', stock: 60, price: 899 },
      { sku: 'RST-WHT-M', size: 'M', color: 'White', colorHex: '#FFFFFF', stock: 40, price: 899 },
    ],
    basePrice: 899,
    compareAtPrice: 1299,
    rating: 4.5,
    reviewCount: 128,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    name: 'RUSH Pro Gym Compression Set',
    slug: 'rush-pro-gym-compression-set',
    description:
      'High-performance 4-way stretch compression top and joggers set. Moisture-wicking, anti-odor fabric built for intense workouts.',
    shortDescription: 'Performance compression gym set',
    category: 'gym-outfits',
    brand: 'RUSH',
    tags: ['gym', 'compression', 'activewear'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Pro Gym Compression Set',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RGC-GRY-M', size: 'M', color: 'Charcoal', colorHex: '#36454F', stock: 35, price: 2499 },
      { sku: 'RGC-GRY-L', size: 'L', color: 'Charcoal', colorHex: '#36454F', stock: 45, price: 2499 },
      { sku: 'RGC-NVY-L', size: 'L', color: 'Navy', colorHex: '#1B2A4A', stock: 30, price: 2499 },
    ],
    basePrice: 2499,
    compareAtPrice: 3499,
    rating: 4.8,
    reviewCount: 89,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    name: 'RUSH Essential Cargo Joggers',
    slug: 'rush-essential-cargo-joggers',
    description:
      'Relaxed-fit cargo joggers with tapered ankle and multiple utility pockets. Street-ready comfort.',
    shortDescription: 'Relaxed cargo joggers',
    category: 'mens-wear',
    brand: 'RUSH',
    tags: ['joggers', 'cargo', 'streetwear'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Essential Cargo Joggers',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RCJ-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', stock: 55, price: 1599 },
      { sku: 'RCJ-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', stock: 70, price: 1599 },
      { sku: 'RCJ-OLV-L', size: 'L', color: 'Olive', colorHex: '#556B2F', stock: 25, price: 1599 },
    ],
    basePrice: 1599,
    compareAtPrice: 2199,
    rating: 4.3,
    reviewCount: 64,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    name: 'RUSH Crossbody Utility Bag',
    slug: 'rush-crossbody-utility-bag',
    description:
      'Water-resistant crossbody bag with adjustable strap and hidden zip pocket. Minimal RUSH deboss.',
    shortDescription: 'Water-resistant crossbody bag',
    category: 'accessories',
    brand: 'RUSH',
    tags: ['bag', 'accessories', 'crossbody'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Crossbody Utility Bag',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RCB-BLK-OS', size: 'OS', color: 'Black', colorHex: '#000000', stock: 100, price: 1299 },
    ],
    basePrice: 1299,
    compareAtPrice: 1699,
    rating: 4.6,
    reviewCount: 42,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    name: 'RUSH Monochrome Hoodie',
    slug: 'rush-monochrome-hoodie',
    description: 'Heavy fleece hoodie with kangaroo pocket and tonal embroidery. Street essential.',
    shortDescription: 'Heavy fleece street hoodie',
    category: 'mens-wear',
    brand: 'RUSH',
    tags: ['hoodie', 'streetwear'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Monochrome Hoodie',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RMH-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', stock: 45, price: 2199 },
      { sku: 'RMH-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', stock: 50, price: 2199 },
    ],
    basePrice: 2199,
    compareAtPrice: 2799,
    rating: 4.7,
    reviewCount: 95,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    name: 'RUSH Training Shorts',
    slug: 'rush-training-shorts',
    description: 'Lightweight training shorts with liner and zip pocket. Built for the gym floor.',
    shortDescription: 'Lightweight gym training shorts',
    category: 'gym-outfits',
    brand: 'RUSH',
    tags: ['shorts', 'gym'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Training Shorts',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RTS-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', stock: 60, price: 999 },
      { sku: 'RTS-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', stock: 55, price: 999 },
    ],
    basePrice: 999,
    rating: 4.4,
    reviewCount: 37,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    name: 'RUSH Performance Tank',
    slug: 'rush-performance-tank',
    description: 'Breathable mesh-back gym tank with dropped armholes. Engineered for maximum mobility.',
    shortDescription: 'Mesh-back gym tank',
    category: 'gym-outfits',
    brand: 'RUSH',
    tags: ['tank', 'gym', 'summer'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Performance Tank',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RPT-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', stock: 60, price: 699 },
      { sku: 'RPT-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', stock: 75, price: 699 },
      { sku: 'RPT-RED-L', size: 'L', color: 'Crimson', colorHex: '#DC143C', stock: 30, price: 699 },
    ],
    basePrice: 699,
    compareAtPrice: 999,
    rating: 4.4,
    reviewCount: 56,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    name: 'RUSH Snapback Cap',
    slug: 'rush-snapback-cap',
    description: 'Structured 6-panel snapback with embroidered RUSH logo. One size fits all.',
    shortDescription: 'Embroidered snapback cap',
    category: 'accessories',
    brand: 'RUSH',
    tags: ['cap', 'hat', 'accessories'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
        alt: 'RUSH Snapback Cap',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
        alt: 'Alternate view',
        isPrimary: false,
      },
    ],
    variants: [
      { sku: 'RSC-BLK-OS', size: 'OS', color: 'Black', colorHex: '#000000', stock: 120, price: 599 },
    ],
    basePrice: 599,
    rating: 4.2,
    reviewCount: 31,
    isFeatured: false,
    isNewArrival: false,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rush';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Coupon.deleteMany({}), Category.deleteMany({})]);

  const admin = await User.create({
    email: 'admin@rush.com',
    password: 'Admin@123',
    firstName: 'RUSH',
    lastName: 'Admin',
    role: 'admin',
    isEmailVerified: true,
  });

  await User.create({
    email: 'user@rush.com',
    password: 'User@1234',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    isEmailVerified: true,
  });

  await Product.insertMany(PRODUCTS);

  await Category.insertMany([
    { name: "Men's Wear", slug: 'mens-wear', order: 1 },
    { name: 'Gym Outfits', slug: 'gym-outfits', order: 2 },
    { name: 'Accessories', slug: 'accessories', order: 3 },
  ]);

  await Coupon.create({
    code: 'RUSH20',
    description: '20% off on orders above ₹999',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 999,
    maxDiscount: 500,
    usageLimit: 1000,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  console.log('Seed complete!');
  console.log('Admin: admin@rush.com / Admin@123');
  console.log('User:  user@rush.com / User@1234');
  console.log('Admin ID:', admin._id);

  await mongoose.disconnect();
}

seed().catch(console.error);
