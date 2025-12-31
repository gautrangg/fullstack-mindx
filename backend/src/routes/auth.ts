import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Use getter functions to ensure env vars are read at runtime, not at import time
const getEnv = () => ({
  CLIENT_ID: process.env.OPENID_CLIENT_ID || 'mindx-onboarding',
  CLIENT_SECRET: process.env.OPENID_CLIENT_SECRET || '',
  OPENID_PROVIDER: process.env.OPENID_PROVIDER || 'https://id-dev.mindx.edu.vn',
  CALLBACK_URI: process.env.CALLBACK_URI || 'http://localhost:3000/auth/callback',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
});

const getEndpoints = () => {
  const env = getEnv();
  return {
    AUTH_ENDPOINT: `${env.OPENID_PROVIDER}/auth`,
    TOKEN_ENDPOINT: `${env.OPENID_PROVIDER}/token`,
    USERINFO_ENDPOINT: `${env.OPENID_PROVIDER}/me`,
  };
};

let currentUser: any = null;

// Login - Get authorization URL
router.get('/login', (req: Request, res: Response) => {
  const env = getEnv();
  const endpoints = getEndpoints();
  const authUrl = `${endpoints.AUTH_ENDPOINT}?client_id=${env.CLIENT_ID}&redirect_uri=${encodeURIComponent(env.CALLBACK_URI)}&response_type=code&scope=openid profile email`;
  res.json({ authUrl });
});

// Callback - Handle OAuth redirect
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const env = getEnv();
    const endpoints = getEndpoints();
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${env.FRONTEND_URL}?error=no_code`);
    }

    // Exchange code for token
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code as string);
    params.append('redirect_uri', env.CALLBACK_URI);

    const auth = Buffer.from(`${env.CLIENT_ID}:${env.CLIENT_SECRET}`).toString('base64');

    const tokenResponse = await axios.post(endpoints.TOKEN_ENDPOINT, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      }
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(endpoints.USERINFO_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    currentUser = userResponse.data;

    // Redirect to frontend with auth data
    const userData = encodeURIComponent(JSON.stringify({
      token: access_token,
      user: currentUser
    }));

    console.log('[AUTH] Redirecting to:', `${env.FRONTEND_URL}?auth=${userData.substring(0, 50)}...`);
    res.redirect(`${env.FRONTEND_URL}?auth=${userData}`);
  } catch (error: any) {
    const env = getEnv();
    console.error('Authentication error:', error.response?.data || error.message);
    const errorDetail = error.response?.data?.error_description || error.message;
    res.redirect(`${env.FRONTEND_URL}?error=auth_failed&details=${encodeURIComponent(errorDetail)}`);
  }
});

// Get current user
router.get('/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json(currentUser);
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  currentUser = null;
  res.json({ message: 'Logged out' });
});

export default router;