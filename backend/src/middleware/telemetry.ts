import { Request, Response, NextFunction } from 'express';
import { getAppInsightsClient } from '../config/appInsights';

export const trackAuthEvent = (eventName: string, properties?: Record<string, string>) => {
  const client = getAppInsightsClient();
  if (client) {
    client.trackEvent({
      name: `Auth_${eventName}`,
      properties: {
        ...properties,
        timestamp: new Date().toISOString()
      }
    });
  }
};

export const trackAPIMetric = (metricName: string, value: number, properties?: Record<string, string>) => {
  const client = getAppInsightsClient();
  if (client) {
    client.trackMetric({
      name: metricName,
      value,
      properties
    });
  }
};

// Middleware to track API response times
export const telemetryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    trackAPIMetric('API_ResponseTime', duration, {
      route: req.path,
      method: req.method,
      statusCode: res.statusCode.toString()
    });
  });

  next();
};
