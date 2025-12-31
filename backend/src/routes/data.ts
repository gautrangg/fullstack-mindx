import express, { Request, Response } from 'express';

const router = express.Router();

// Protected route - get user data
router.get('/user-data', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Return data matching the Dashboard interface
  res.json({
    data: {
      id: 1,
      title: 'Welcome to Your Dashboard',
      description: 'This is your protected user data. You have successfully authenticated using OpenID Connect and can now access secure resources.',
      features: [
        'Secure Authentication',
        'Protected API Routes',
        'User Profile Management',
        'Real-time Data Access',
        'Session Management'
      ],
      lastLogin: new Date().toISOString()
    }
  });
});

export default router;