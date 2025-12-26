import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected endpoint - get user's data
router.get('/user-data', authenticateToken, (req: Request, res: Response) => {
  res.json({
    id: 1,
    title: 'Welcome to Your Dashboard',
    description: 'This is protected data - you can only see this when logged in',
    features: ['User Authentication', 'Protected Routes', 'Data Fetching'],
    lastLogin: new Date().toISOString()
  });
});

export default router;