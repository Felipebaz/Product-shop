import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSentry } from './infrastructure/sentry'
import { SentryErrorBoundary } from './infrastructure/SentryErrorBoundary'
import './index.css'
import App from './App.tsx'

// Initialise Sentry before anything else so early errors are captured
initSentry()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryErrorBoundary>
      <App />
    </SentryErrorBoundary>
  </StrictMode>,
)
