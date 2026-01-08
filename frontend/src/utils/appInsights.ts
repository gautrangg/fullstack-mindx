import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

let reactPlugin: ReactPlugin | null = null;
let appInsights: ApplicationInsights | null = null;

export const initializeAppInsights = () => {
  const connectionString = import.meta.env.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (!connectionString) {
    console.warn('⚠️  App Insights connection string not found - frontend monitoring disabled');
    return { reactPlugin: null, appInsights: null };
  }

  reactPlugin = new ReactPlugin();
  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: true,
      extensions: [reactPlugin],
      extensionConfig: {
        [reactPlugin.identifier]: {
          debug: import.meta.env.DEV
        }
      }
    }
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView();

  console.log('✅ Frontend App Insights initialized');
  return { reactPlugin, appInsights };
};

export const getAppInsights = () => appInsights;
export const getReactPlugin = () => reactPlugin;
