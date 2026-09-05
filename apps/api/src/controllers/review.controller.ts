import { Response } from 'express';
import mongoose from 'mongoose';
import { Review, Product, Order } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

async function recalcProductRating(productId: string): Promise<void> {
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

export const getProductReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { productId: req.params.productId };
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  sendSuccess(res, reviews, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  });
});

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const existing = await Review.findOne({ userId: req.user!.userId, productId });
  if (existing) throw new AppError('You have already reviewed this product', 409);

  const isVerifiedPurchase = await Order.exists({
    userId: req.user!.userId,
    'items.productId': productId,
    status: 'delivered',
  });

  const review = await Review.create({
    userId: req.user!.userId,
    productId,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!isVerifiedPurchase,
  });

  await recalcProductRating(productId);

  sendSuccess(res, review, 201, undefined, 'Review submitted');
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);

  const isOwner = review.userId.toString() === req.user!.userId;
  if (!isOwner && req.user!.role !== 'admin') {
    throw new AppError('Not authorized to delete this review', 403);
  }

  const productId = review.productId.toString();
  await review.deleteOne();
  await recalcProductRating(productId);

  sendSuccess(res, null, 200, undefined, 'Review deleted');
});
