import { Response } from 'express';
import type { ApiResponse, PaginationMeta } from '@rush/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta,
  message?: string
): void {
  const body: ApiResponse<T> = { success: true, data, message, meta };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: Record<string, string[]>
): void {
  const body: ApiResponse = { success: false, message, errors };
  res.status(statusCode).json(body);
}
