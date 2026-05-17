import { Response } from 'express';
import { User } from '../models';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user!.userId,
    { firstName, lastName, phone, avatar },
    { new: true, runValidators: true }
  ).select('-password');
  if (!user) throw new AppError('User not found', 404);
  sendSuccess(res, user);
});

export const addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError('User not found', 404);

  if (req.body.isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }
  user.addresses.push(req.body);
  await user.save();
  sendSuccess(res, user.addresses);
});

export const updateAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError('User not found', 404);

  const addressId = String(req.params.addressId);
  const address = user.addresses.id(addressId);
  if (!address) throw new AppError('Address not found', 404);

  Object.assign(address, req.body);
  await user.save();
  sendSuccess(res, user.addresses);
});

export const deleteAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError('User not found', 404);

  user.addresses.pull(String(req.params.addressId));
  await user.save();
  sendSuccess(res, user.addresses);
});
