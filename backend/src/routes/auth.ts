import express, { Request, Response } from 'express';
import axios from 'axios';
import { trackAuthEvent } from '../middleware/telemetry';

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

// NOTE: In-memory session storage - NOT production-ready!
// TODO Week 2: Replace with Redis, database, or stateless JWT validation
// Current implementation will lose state on:
// - Server restart
// - Multiple pod deployment (Kubernetes scale > 1)
interface SessionData {
  token: string;
  user: any;
  expiresAt: number;
}

const sessions = new Map<string, SessionData>();
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Generate random session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Clean expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of sessions.entries()) {
    if (data.expiresAt < now) {
      sessions.delete(sessionId);
    }
  }
}, 60 * 60 * 1000); // Clean every hour

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

    // Create session with short ID instead of putting all data in URL
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
      token: access_token,
      user: userResponse.data,
      expiresAt: Date.now() + SESSION_EXPIRY
    });

    // Track successful login
    trackAuthEvent('LoginSuccess', {
      userId: userResponse.data.id || userResponse.data.sub,
      provider: 'mindx-openid'
    });

    // Redirect to frontend with only session ID (short URL)
    res.redirect(`${env.FRONTEND_URL}?session=${sessionId}`);
  } catch (error: any) {
    const env = getEnv();
    console.error('Authentication error:', error.response?.data || error.message);
    const errorDetail = error.response?.data?.error_description || error.message;

    // Track login failure
    trackAuthEvent('LoginFailed', {
      error: errorDetail,
      code: req.query.code as string || 'no_code'
    });

    res.redirect(`${env.FRONTEND_URL}?error=auth_failed&details=${encodeURIComponent(errorDetail)}`);
  }
});

// Get session data by session ID
router.get('/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const sessionData = sessions.get(sessionId);

  if (!sessionData) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  // Check if session expired
  if (sessionData.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return res.status(401).json({ error: 'Session expired' });
  }

  res.json({
    token: sessionData.token,
    user: sessionData.user
  });
});

// Get current user by token
router.get('/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find session by token
  let userFound = false;
  for (const [sessionId, sessionData] of sessions.entries()) {
    if (sessionData.token === token) {
      // Check expiry
      if (sessionData.expiresAt < Date.now()) {
        sessions.delete(sessionId);
        return res.status(401).json({ error: 'Session expired' });
      }
      userFound = true;
      return res.json(sessionData.user);
    }
  }

  if (!userFound) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    // Find and delete session by token
    for (const [sessionId, sessionData] of sessions.entries()) {
      if (sessionData.token === token) {
        // Track logout before deleting session
        trackAuthEvent('Logout', {
          userId: sessionData.user.id || sessionData.user.sub
        });
        sessions.delete(sessionId);
        break;
      }
    }
  }

  res.json({ message: 'Logged out' });
});

export default router;