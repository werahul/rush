import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type TokenPayload } from '../services/token.service';
import { sendError } from '../utils/apiResponse';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: TokenPayload & { id: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.accessToken;

    if (!token) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select('_id role');
    if (!user) {
      sendError(res, 'User not found', 401);
      return;
    }

    req.user = { ...payload, id: payload.userId };
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.accessToken;
    if (token) {
      const payload = verifyAccessToken(token);
      req.user = { ...payload, id: payload.userId };
    }
  } catch {
    // optional — continue without user
  }
  next();
};

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }
    next();
  };
