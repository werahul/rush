import { Response } from 'express';
import { Wishlist, Product } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthRequest } from '../middleware/auth';

async function getOrCreateWishlist(userId: string) {
  let wishlist = await Wishlist.findOne({ userId }).populate('products');
  if (!wishlist) wishlist = await Wishlist.create({ userId, products: [] });
  return wishlist;
}

export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOne({ userId: req.user!.userId }).populate({
    path: 'products',
    match: { isActive: true },
  });
  sendSuccess(res, wishlist?.products || []);
});

export const toggleWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  let wishlist = await Wishlist.findOne({ userId: req.user!.userId });
  if (!wishlist) wishlist = await Wishlist.create({ userId: req.user!.userId, products: [] });

  const index = wishlist.products.findIndex((p) => p.toString() === productId);
  let added = false;
  if (index > -1) {
    wishlist.products.splice(index, 1);
  } else {
    wishlist.products.push(productId);
    added = true;
  }
  await wishlist.save();

  sendSuccess(res, { added, productId }, 200, undefined, added ? 'Added to wishlist' : 'Removed from wishlist');
});
