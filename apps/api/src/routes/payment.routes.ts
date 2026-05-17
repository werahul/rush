import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { env } from '../config/env';
import type { AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * Stripe payment intent structure
 * Requires STRIPE_SECRET_KEY in production
 */
router.post(
  '/stripe/create-intent',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { amount, orderId } = req.body;

    if (!env.STRIPE_SECRET_KEY) {
      sendSuccess(res, {
        mock: true,
        clientSecret: `mock_stripe_secret_${orderId}`,
        message: 'Stripe not configured — mock intent returned',
        amount,
      });
      return;
    }

    // Production: const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    // const intent = await stripe.paymentIntents.create({ amount: amount * 100, currency: 'inr', metadata: { orderId } });
    sendSuccess(res, { clientSecret: 'configure-stripe-key', amount });
  })
);

/**
 * Razorpay order structure
 * Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
 */
router.post(
  '/razorpay/create-order',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { amount, orderId } = req.body;

    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      sendSuccess(res, {
        mock: true,
        razorpayOrderId: `mock_rzp_${orderId}`,
        amount,
        currency: 'INR',
        keyId: 'mock_key',
        message: 'Razorpay not configured — mock order returned',
      });
      return;
    }

    sendSuccess(res, { razorpayOrderId: 'configure-razorpay-keys', amount });
  })
);

export default router;
