import { Response } from 'express';
import { Product } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

function buildSort(sort?: string): Record<string, 1 | -1> {
  switch (sort) {
    case 'price_asc':
      return { basePrice: 1 };
    case 'price_desc':
      return { basePrice: -1 };
    case 'rating':
      return { rating: -1 };
    case 'popular':
      return { reviewCount: -1 };
    default:
      return { createdAt: -1 };
  }
}

export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    brands,
    minRating,
    sort,
    page = 1,
    limit = 12,
    featured,
    newArrival,
  } = req.query as Record<string, unknown>;

  const filter: Record<string, unknown> = { isActive: true };

  if (category) filter.category = category;
  if (featured) filter.isFeatured = true;
  if (newArrival) filter.isNewArrival = true;
  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) (filter.basePrice as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.basePrice as Record<string, number>).$lte = Number(maxPrice);
  }
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (brands && Array.isArray(brands)) filter.brand = { $in: brands };
  if (sizes && Array.isArray(sizes)) filter['variants.size'] = { $in: sizes };
  if (colors && Array.isArray(colors)) filter['variants.color'] = { $in: colors };
  if (search) filter.$text = { $search: String(search) };

  const skip = (Number(page) - 1) * Number(limit);
  const sortOption = buildSort(sort as string | undefined);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / Number(limit));

  sendSuccess(res, products, 200, {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages,
    hasNext: Number(page) < totalPages,
    hasPrev: Number(page) > 1,
  });
});

export const getProductBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, product);
});

export const getFeaturedProducts = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  sendSuccess(res, products);
});

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.create(req.body);
  sendSuccess(res, product, 201);
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, product);
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, null, 200, undefined, 'Product deactivated');
});
