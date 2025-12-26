import express, { Request, Response } from 'express';
import { User, AuthResponse } from '../types';

const router = express.Router();

// Store current user in memory (temp)
let currentUser: User | null = null;

// Login endpoint - returns OpenID redirect URL
router.get('/login', (req: Request, res: Response) => {
  const clientId = process.env.OPENID_CLIENT_ID || 'your-client-id';
  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/callback`;
  
  const authUrl = `https://id-dev.mindx.edu.vn/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
  
  res.json({ authUrl, message: 'Redirect to this URL for login' });
});

// Callback endpoint - handles OpenID response
router.post('/callback', (req: Request, res: Response) => {
  try {
    // In real app, exchange code for token with OpenID provider
    // For now, mock the response
    
    const mockUser: User = {
      id: '123',
      name: 'Test User',
      email: 'test@mindx.edu.vn',
      avatar: 'https://via.placeholder.com/150'
    };
    
    const mockToken = `mock-jwt-${Date.now()}`;
    
    currentUser = mockUser;
    
    const response: AuthResponse = {
      token: mockToken,
      user: mockUser
    };
    
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: 'Authentication failed' });
  }
});

// Get current user (protected)
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json(currentUser);
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  currentUser = null;
  res.json({ message: 'Logged out successfully' });
});

export default router;