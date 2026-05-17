import { Response } from 'express';
import { Cart, Order, Product, Coupon } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

const TAX_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

function generateOrderNumber(): string {
  const date = new Date();
  const prefix = `RUSH${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random}`;
}

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shippingAddress, couponCode, paymentProvider = 'cod' } = req.body;

  const cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400);

  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new AppError(`Product ${item.name} no longer available`, 400);
    const variant = product.variants.find((v) => v.sku === item.sku);
    if (!variant || variant.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${item.name}`, 400);
    }
    subtotal += item.price * item.quantity;
    orderItems.push({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      sku: item.sku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    });
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
    if (!coupon) throw new AppError('Invalid coupon', 400);
    if (coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon usage limit reached', 400);
    if (subtotal < coupon.minOrderAmount) {
      throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);
    }
    discount =
      coupon.discountType === 'percentage'
        ? Math.min(
            (subtotal * coupon.discountValue) / 100,
            coupon.maxDiscount || Infinity
          )
        : coupon.discountValue;
    coupon.usedCount += 1;
    await coupon.save();
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const total = taxableAmount + tax + shipping;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    userId: req.user!.userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    couponCode,
    paymentProvider,
    status: 'pending',
    paymentStatus: paymentProvider === 'cod' ? 'pending' : 'pending',
    timeline: [
      { status: 'pending', message: 'Order placed successfully', timestamp: new Date() },
    ],
  });

  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.productId, 'variants.sku': item.sku },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );
  }

  cart.set('items', []);
  await cart.save();

  sendSuccess(res, order, 201, undefined, 'Order placed successfully');
});

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ userId: req.user!.userId }),
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

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user!.userId,
  }).lean();
  if (!order) throw new AppError('Order not found', 404);
  sendSuccess(res, order);
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user!.userId,
  });
  if (!order) throw new AppError('Order not found', 404);
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }

  order.status = 'cancelled';
  order.cancelReason = req.body.reason;
  order.timeline.push({
    status: 'cancelled',
    message: 'Order cancelled by customer',
    timestamp: new Date(),
  });
  await order.save();

  sendSuccess(res, order, 200, undefined, 'Order cancelled');
});
