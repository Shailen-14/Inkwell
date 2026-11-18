import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { clearCookieOptions, cookieOptions, TOKEN_COOKIE } from '../config/cookie.js';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';

const makeToken = (id: string, name: string): string =>
  jwt.sign({ id, name }, JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user: { _id: unknown; name: string; email: string }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as Record<string, unknown>;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      password.length < 6
    ) {
      res.status(400).json({
        message: 'Name, email and a password of at least 6 characters are required',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = makeToken(String(user._id), user.name);
    res.cookie(TOKEN_COOKIE, token, cookieOptions);

    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as Record<string, unknown>;

    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = makeToken(String(user._id), user.name);
    res.cookie(TOKEN_COOKIE, token, cookieOptions);

    res.json({ user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(TOKEN_COOKIE, clearCookieOptions);
  res.clearCookie('inkwell-auth', { path: '/' });
  res.json({ message: 'Logged out' });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.[TOKEN_COOKIE] as string | undefined;
    if (!token) {
      res.json({ user: null });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    res.json({ user: user ? publicUser(user) : null });
  } catch {
    res.json({ user: null });
  }
};
