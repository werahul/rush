import { Response } from 'express';
import { Coupon } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

export const validateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiresAt: { $gt: new Date() },
  });

  if (!coupon) throw new AppError('Invalid coupon code', 404);
  if (coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon expired', 400);
  if (subtotal < coupon.minOrderAmount) {
    throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);
  }

  const discount =
    coupon.discountType === 'percentage'
      ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity)
      : coupon.discountValue;

  sendSuccess(res, { coupon, discount });
});

export const getCoupons = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const coupons = await Coupon.find({ isActive: true }).lean();
  sendSuccess(res, coupons);
});

export const createCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.create(req.body);
  sendSuccess(res, coupon, 201);
});
