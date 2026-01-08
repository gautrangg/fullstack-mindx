import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST (only in development)
// In production (K8s), env vars are injected by deployment
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

// Initialize App Insights BEFORE Express (critical!)
import { initializeAppInsights, getAppInsightsClient } from './config/appInsights';
const appInsightsClient = initializeAppInsights();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import testRoutes from './routes/test';
import { telemetryMiddleware } from './middleware/telemetry';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(telemetryMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);
app.use(testRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'MindX Full Stack API',
    endpoints: [
      'GET /health',
      'GET /auth/login',
      'GET /auth/callback',
      'GET /auth/me',
      'POST /auth/logout',
      'GET /data/user-data'
    ]
  });
});

// Error tracking middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (appInsightsClient) {
    appInsightsClient.trackException({
      exception: err,
      properties: {
        route: req.path,
        method: req.method,
        user: (req as any).user?.id
      }
    });
  }

  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});