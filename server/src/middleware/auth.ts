import jwt from 'jsonwebtoken';
import type { NextFunction, Response } from 'express';
import { TOKEN_COOKIE } from '../config/cookie.js';
import type { AuthRequest, AuthUser } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.header('Authorization');
  const cookieToken = req.cookies?.[TOKEN_COOKIE] as string | undefined;
  const token = cookieToken || (header?.startsWith('Bearer ') ? header.slice(7) : undefined);

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = { id: decoded.id, name: decoded.name };
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
