import { Response } from 'express';
import { Cart, Product } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await getOrCreateCart(req.user!.userId);
  sendSuccess(res, cart);
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, sku, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const variant = product.variants.find((v) => v.sku === sku);
  if (!variant) throw new AppError('Variant not found', 404);
  if (variant.stock < quantity) throw new AppError('Insufficient stock', 400);

  const cart = await getOrCreateCart(req.user!.userId);
  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
  const existingIndex = cart.items.findIndex((i) => i.sku === sku);

  if (existingIndex > -1) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > variant.stock) throw new AppError('Insufficient stock', 400);
    cart.items[existingIndex].quantity = newQty;
  } else {
    cart.items.push({
      productId: product._id,
      sku,
      name: product.name,
      slug: product.slug,
      image: primaryImage?.url || '',
      size: variant.size,
      color: variant.color,
      price: variant.price,
      quantity,
      maxStock: variant.stock,
    });
  }

  await cart.save();
  sendSuccess(res, cart, 200, undefined, 'Added to cart');
});

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sku, quantity } = req.body;
  const cart = await getOrCreateCart(req.user!.userId);
  const item = cart.items.find((i) => i.sku === sku);
  if (!item) throw new AppError('Item not in cart', 404);
  if (quantity < 1) {
    cart.set(
      'items',
      cart.items.filter((i) => i.sku !== sku)
    );
  } else {
    if (quantity > item.maxStock) throw new AppError('Insufficient stock', 400);
    item.quantity = quantity;
  }
  await cart.save();
  sendSuccess(res, cart);
});

export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await getOrCreateCart(req.user!.userId);
  cart.set(
    'items',
    cart.items.filter((i) => i.sku !== String(req.params.sku))
  );
  await cart.save();
  sendSuccess(res, cart);
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await getOrCreateCart(req.user!.userId);
  cart.set('items', []);
  await cart.save();
  sendSuccess(res, cart);
});
