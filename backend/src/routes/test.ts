import express, { Request, Response } from 'express';
import { getAppInsightsClient } from '../config/appInsights';

const router = express.Router();

// Only enable in non-production
if (process.env.NODE_ENV !== 'production') {
  // Test error tracking
  router.get('/test/error', (req: Request, res: Response) => {
    throw new Error('Test error for App Insights');
  });

  // Test custom event
  router.get('/test/event', (req: Request, res: Response) => {
    const client = getAppInsightsClient();
    if (client) {
      client.trackEvent({
        name: 'TestEvent',
        properties: { source: 'manual-test' }
      });
      client.flush();
    }
    res.json({ message: 'Event tracked successfully' });
  });

  // Test metric
  router.get('/test/metric', (req: Request, res: Response) => {
    const client = getAppInsightsClient();
    if (client) {
      client.trackMetric({
        name: 'TestMetric',
        value: Math.random() * 100
      });
      client.flush();
    }
    res.json({ message: 'Metric tracked successfully' });
  });
}

export default router;
