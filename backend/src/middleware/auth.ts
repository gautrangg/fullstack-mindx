import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // In real app, verify JWT here
  if (token.startsWith('mock-jwt-')) {
    next();
  } else {
    res.status(403).json({ error: 'Invalid token' });
  }
};