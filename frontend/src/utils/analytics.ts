import ReactGA from 'react-ga4';

let isInitialized = false;

export const initializeGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('⚠️  Google Analytics measurement ID not found - analytics disabled');
    return;
  }

  ReactGA.initialize(measurementId, {
    gaOptions: {
      debug_mode: import.meta.env.DEV,
      send_page_view: false // We'll handle this manually
    }
  });

  isInitialized = true;
  console.log('✅ Google Analytics initialized');
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (!isInitialized) return;

  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title || document.title
  });
};

// Track events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (!isInitialized) return;

  ReactGA.event({
    category,
    action,
    label,
    value
  });
};

// Track user login
export const trackLogin = (method: string, userId?: string) => {
  if (!isInitialized) return;

  ReactGA.event({
    category: 'User',
    action: 'Login',
    label: method
  });

  if (userId) {
    ReactGA.set({ userId });
  }
};

// Track user logout
export const trackLogout = () => {
  if (!isInitialized) return;

  ReactGA.event({
    category: 'User',
    action: 'Logout'
  });
};

// Track errors
export const trackError = (description: string, fatal: boolean = false) => {
  if (!isInitialized) return;

  ReactGA.event({
    category: 'Error',
    action: description,
    label: fatal ? 'Fatal' : 'Non-Fatal'
  });
};
