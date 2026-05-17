import { Response } from 'express';
import { User, Product, Order, Coupon } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthRequest } from '../middleware/auth';

export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalProducts, totalOrders, revenueAgg, recentOrders, lowStock] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'firstName lastName email').lean(),
      Product.find({ isActive: true, 'variants.stock': { $lte: 5 } })
        .select('name slug variants')
        .limit(10)
        .lean(),
    ]);

  const salesByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  sendSuccess(res, {
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      revenue30d: revenueAgg[0]?.total || 0,
    },
    salesByDay,
    recentOrders,
    lowStock,
  });
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const status = req.query.status as string | undefined;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, orders, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  });
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, message, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.timeline.push({
    status,
    message: message || `Order status updated to ${status}`,
    timestamp: new Date(),
  });
  await order.save();
  sendSuccess(res, order);
});

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);

  sendSuccess(res, users, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  });
});
