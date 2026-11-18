import type { CookieOptions } from 'express';

export const TOKEN_COOKIE = 'inkwell_token';

const isProduction = process.env.NODE_ENV === 'production';
const secure = process.env.COOKIE_SECURE === 'true' || isProduction;
const sameSite =
  (process.env.COOKIE_SAME_SITE as 'lax' | 'none' | 'strict') || (isProduction ? 'none' : 'lax');

const baseOptions: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  path: '/',
};

export const cookieOptions: CookieOptions = {
  ...baseOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearCookieOptions: CookieOptions = { ...baseOptions };
