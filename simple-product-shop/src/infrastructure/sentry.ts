import * as Sentry from '@sentry/react';

const PROD_TRACES_SAMPLE_RATE = 0.1;
const DEV_TRACES_SAMPLE_RATE = 1.0;
const REPLAY_SESSION_SAMPLE_RATE = 0.1;
const REPLAY_ON_ERROR_SAMPLE_RATE = 1.0;

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn('Sentry DSN not configured - error tracking is disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_ENV || 'development',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: import.meta.env.PROD
      ? PROD_TRACES_SAMPLE_RATE
      : DEV_TRACES_SAMPLE_RATE,
    replaysSessionSampleRate: REPLAY_SESSION_SAMPLE_RATE,
    replaysOnErrorSampleRate: REPLAY_ON_ERROR_SAMPLE_RATE,
  });
}
