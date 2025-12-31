import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (only in development)
// In production (K8s), env vars are injected by deployment
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

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

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});