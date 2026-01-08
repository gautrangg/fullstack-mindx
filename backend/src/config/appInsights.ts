import * as appInsights from 'applicationinsights';

export const initializeAppInsights = () => {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (!connectionString) {
    console.warn('⚠️  App Insights connection string not found - monitoring disabled');
    return null;
  }

  // Initialize App Insights
  appInsights.setup(connectionString)
    .setAutoDependencyCorrelation(true)  // Track dependencies automatically
    .setAutoCollectRequests(true)         // Track HTTP requests
    .setAutoCollectPerformance(true, true) // Track performance counters
    .setAutoCollectExceptions(true)       // Track exceptions
    .setAutoCollectDependencies(true)     // Track external dependencies
    .setAutoCollectConsole(true)          // Track console logs
    .setUseDiskRetryCaching(true)         // Retry on network failures
    .setSendLiveMetrics(false)            // Disable live metrics for cost savings
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C);

  appInsights.start();

  console.log('✅ Azure App Insights initialized');
  return appInsights.defaultClient;
};

export const getAppInsightsClient = () => {
  return appInsights.defaultClient;
};
