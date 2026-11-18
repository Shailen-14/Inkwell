import type { Request } from 'express';

export interface AuthUser {
  id: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface ApiError {
  message: string;
}
