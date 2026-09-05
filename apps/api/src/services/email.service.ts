import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    logger.warn(`RESEND_API_KEY not set — skipping email to ${to}: ${subject}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    logger.error('Failed to send email', error);
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
  await send(
    email,
    'Reset your RUSH password',
    `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Reset your password</h2>
      <p>We received a request to reset your RUSH account password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px">Reset Password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>`
  );
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;
  await send(
    email,
    'Verify your RUSH account',
    `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Welcome to RUSH</h2>
      <p>Please verify your email address to complete your account setup.</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px">Verify Email</a></p>
    </div>`
  );
}
