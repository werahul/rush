import type { Order, Product } from '@rush/shared';
import { PAGE_IMAGES, PRODUCT_IMAGES, productImageSet } from './images';

const now = new Date().toISOString();

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'mock-1',
    name: 'RUSH Oversized Street Tee',
    slug: 'rush-oversized-street-tee',
    description:
      'Premium heavyweight cotton oversized tee with minimal RUSH branding. Perfect for everyday street style.',
    shortDescription: 'Heavyweight oversized cotton tee',
    category: 'mens-wear',
    brand: 'RUSH',
    tags: ['tee', 'oversized', 'streetwear'],
    images: productImageSet(PRODUCT_IMAGES.tee, PRODUCT_IMAGES.teeAlt),
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
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-2',
    name: 'RUSH Pro Gym Compression Set',
    slug: 'rush-pro-gym-compression-set',
    description:
      'High-performance 4-way stretch compression top and joggers set. Moisture-wicking, anti-odor fabric built for intense workouts.',
    shortDescription: 'Performance compression gym set',
    category: 'gym-outfits',
    brand: 'RUSH',
    tags: ['gym', 'compression', 'activewear'],
    images: productImageSet(PRODUCT_IMAGES.gymSet, PRODUCT_IMAGES.gymSetAlt),
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
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-3',
    name: 'RUSH Essential Cargo Joggers',
    slug: 'rush-essential-cargo-joggers',
    description:
      'Relaxed-fit cargo joggers with tapered ankle and multiple utility pockets. Street-ready comfort.',
    shortDescription: 'Relaxed cargo joggers',
    category: 'mens-wear',
    brand: 'RUSH',
    tags: ['joggers', 'cargo', 'streetwear'],
    images: productImageSet(PRODUCT_IMAGES.joggers, PRODUCT_IMAGES.joggersAlt),
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
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-4',
    name: 'RUSH Crossbody Utility Bag',
    slug: 'rush-crossbody-utility-bag',
    description:
      'Water-resistant crossbody bag with adjustable strap and hidden zip pocket. Minimal RUSH deboss.',
    shortDescription: 'Water-resistant crossbody bag',
    category: 'accessories',
    brand: 'RUSH',
    tags: ['bag', 'accessories'],
    images: productImageSet(PRODUCT_IMAGES.bag, PRODUCT_IMAGES.bagAlt),
    variants: [
      { sku: 'RCB-BLK-OS', size: 'OS', color: 'Black', colorHex: '#000000', stock: 40, price: 1299 },
    ],
    basePrice: 1299,
    compareAtPrice: 1699,
    rating: 4.6,
    reviewCount: 42,
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-5',
    name: 'RUSH Monochrome Hoodie',
    slug: 'rush-monochrome-hoodie',
    description: 'Heavy fleece hoodie with kangaroo pocket and tonal embroidery. Street essential.',
    shortDescription: 'Heavy fleece street hoodie',
    category: 'mens-wear',
    brand: 'RUSH',
    tags: ['hoodie', 'streetwear'],
    images: productImageSet(PRODUCT_IMAGES.hoodie, PRODUCT_IMAGES.hoodieAlt),
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
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-6',
    name: 'RUSH Training Shorts',
    slug: 'rush-training-shorts',
    description: 'Lightweight training shorts with liner and zip pocket. Built for the gym floor.',
    shortDescription: 'Lightweight gym training shorts',
    category: 'gym-outfits',
    brand: 'RUSH',
    tags: ['shorts', 'gym'],
    images: productImageSet(PRODUCT_IMAGES.shorts, PRODUCT_IMAGES.shortsAlt),
    variants: [
      { sku: 'RTS-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', stock: 60, price: 999 },
      { sku: 'RTS-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', stock: 55, price: 999 },
    ],
    basePrice: 999,
    rating: 4.4,
    reviewCount: 37,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-7',
    name: 'RUSH Performance Tank',
    slug: 'rush-performance-tank',
    description: 'Breathable mesh-back gym tank with dropped armholes. Engineered for maximum mobility.',
    shortDescription: 'Mesh-back gym tank',
    category: 'gym-outfits',
    brand: 'RUSH',
    tags: ['tank', 'gym', 'summer'],
    images: productImageSet(PRODUCT_IMAGES.tank, PRODUCT_IMAGES.tankAlt),
    variants: [
      { sku: 'RPT-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', stock: 60, price: 699 },
      { sku: 'RPT-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', stock: 75, price: 699 },
    ],
    basePrice: 699,
    compareAtPrice: 999,
    rating: 4.4,
    reviewCount: 56,
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-8',
    name: 'RUSH Snapback Cap',
    slug: 'rush-snapback-cap',
    description: 'Structured 6-panel snapback with embroidered RUSH logo. One size fits all.',
    shortDescription: 'Embroidered snapback cap',
    category: 'accessories',
    brand: 'RUSH',
    tags: ['cap', 'hat', 'accessories'],
    images: productImageSet(PRODUCT_IMAGES.cap, PRODUCT_IMAGES.capAlt),
    variants: [
      { sku: 'RSC-BLK-OS', size: 'OS', color: 'Black', colorHex: '#000000', stock: 120, price: 599 },
    ],
    basePrice: 599,
    rating: 4.2,
    reviewCount: 31,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    _id: 'order-mock-1',
    orderNumber: 'RUSH-10001',
    userId: 'user-mock',
    items: [
      {
        productId: 'mock-1',
        name: 'RUSH Oversized Street Tee',
        slug: 'rush-oversized-street-tee',
        image: MOCK_PRODUCTS[0].images[0].url,
        sku: 'RST-BLK-M',
        size: 'M',
        color: 'Black',
        quantity: 2,
        price: 899,
      },
    ],
    shippingAddress: {
      label: 'Home',
      fullName: 'Demo User',
      phone: '+919876543210',
      line1: '42 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
    subtotal: 1798,
    discount: 0,
    tax: 324,
    shipping: 99,
    total: 2221,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentProvider: 'razorpay',
    trackingNumber: 'RUSHTRK123456',
    timeline: [
      { status: 'pending', message: 'Order placed', timestamp: now },
      { status: 'confirmed', message: 'Order confirmed', timestamp: now },
      { status: 'processing', message: 'Being prepared', timestamp: now },
      { status: 'shipped', message: 'Shipped via BlueDart', timestamp: now },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

export function filterMockProducts(filters?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}): Product[] {
  let items = [...MOCK_PRODUCTS];

  if (filters?.category) {
    items = items.filter((p) => p.category === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters?.minPrice != null) {
    items = items.filter((p) => p.basePrice >= filters.minPrice!);
  }
  if (filters?.maxPrice != null) {
    items = items.filter((p) => p.basePrice <= filters.maxPrice!);
  }
  if (filters?.isFeatured) {
    items = items.filter((p) => p.isFeatured);
  }
  if (filters?.isNewArrival) {
    items = items.filter((p) => p.isNewArrival);
  }

  if ((filters as { limit?: number })?.limit) {
    items = items.slice(0, (filters as { limit?: number }).limit);
  }

  switch (filters?.sort) {
    case 'price_asc':
      items.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'price_desc':
      items.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case 'rating':
      items.sort((a, b) => b.rating - a.rating);
      break;
    default:
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return items;
}

export function getMockProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
