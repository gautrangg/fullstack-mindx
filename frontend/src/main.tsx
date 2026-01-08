import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeAppInsights } from './utils/appInsights'
import { initializeGA } from './utils/analytics'

// Initialize monitoring and analytics
initializeAppInsights();
initializeGA();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
