import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

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
      'GET /api/auth/login',
      'POST /api/auth/callback',
      'GET /api/auth/me',
      'POST /api/auth/logout',
      'GET /api/data/user-data'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  ✅ Server running on port ${PORT}         ║
║  http://localhost:${PORT}               ║
╚════════════════════════════════════════╝
  `);
});