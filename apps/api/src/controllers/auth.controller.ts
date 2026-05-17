import { Response } from 'express';
import crypto from 'crypto';
import { User } from '../models';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  hashToken,
} from '../services/token.service';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already registered', 409);

  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    emailVerificationToken,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);

  sendSuccess(
    res,
    {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
    },
    201,
    undefined,
    'Account created successfully'
  );
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);

  sendSuccess(res, {
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
    accessToken,
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user.userId, { $unset: { refreshToken: 1 } });
  }
  clearAuthCookies(res);
  sendSuccess(res, null, 200, undefined, 'Logged out successfully');
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError('Refresh token required', 401);

  const payload = verifyRefreshToken(token);
  const user = await User.findById(payload.userId).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Invalid refresh token', 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);
  sendSuccess(res, { accessToken });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError('User not found', 404);
  sendSuccess(res, user);
});

export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    sendSuccess(res, null, 200, undefined, 'If email exists, reset link has been sent');
    return;
  }

  const { token, hashed } = generateResetToken();
  user.passwordResetToken = hashed;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  // TODO: Send email with token — structure ready for SMTP integration
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Password reset token for ${email}: ${token}`);
  }

  sendSuccess(res, null, 200, undefined, 'If email exists, reset link has been sent');
});

export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token, password } = req.body;
  const hashed = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new AppError('Invalid or expired reset token', 400);

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  sendSuccess(res, null, 200, undefined, 'Password reset successful');
});

export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.query;
  const user = await User.findOne({ emailVerificationToken: token as string });
  if (!user) throw new AppError('Invalid verification token', 400);

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  sendSuccess(res, null, 200, undefined, 'Email verified successfully');
});
