import { useId, useState, type FormEvent } from 'react';
import * as Sentry from '@sentry/react';
import { validatePassword } from '@/shared/utils';
import { Button } from '@/shared/components';
import { PasswordInput } from './components/PasswordInput';

const DEMO_EMAIL = 'demo@example.com';
const DEMO_USER_ID = 'demo-user-123';
const MAX_ATTEMPTS = 3;
// Dot excluded from the domain classes so the pattern cannot backtrack (ReDoS-safe)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

type Status = 'idle' | 'success' | 'error' | 'locked';

export function LoginDemo() {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<Status>('idle');

  const isLocked = status === 'locked';
  const isEmailValid = EMAIL_PATTERN.test(email);
  const isPasswordValid = validatePassword(password).isValid;
  const canSubmit = isEmailValid && isPasswordValid && !isLocked;
  const remaining = MAX_ATTEMPTS - attempts;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    if (email === DEMO_EMAIL) {
      Sentry.setUser({ id: DEMO_USER_ID, email });
      setStatus('success');
      return;
    }

    Sentry.setUser(null);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setStatus(nextAttempts >= MAX_ATTEMPTS ? 'locked' : 'error');
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Login demo"
      className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-lg font-semibold">Login demo</h2>
      <p className="text-xs text-gray-500">
        Use <code>{DEMO_EMAIL}</code> with a valid password to sign in.
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor={emailId} className="text-sm font-medium">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          value={email}
          disabled={isLocked}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        {/* A span, not a label: PasswordInput already labels its own input */}
        <span className="text-sm font-medium">Password</span>
        <PasswordInput
          value={password}
          onChange={setPassword}
          showRequirements
          disabled={isLocked}
        />
      </div>

      <Button type="submit" disabled={!canSubmit}>
        Sign in
      </Button>

      {status === 'success' && (
        <p role="status" className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">
          Welcome, {email}!
        </p>
      )}

      {status === 'error' && (
        <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          Invalid credentials. {remaining} {remaining === 1 ? 'attempt' : 'attempts'}{' '}
          remaining.
        </p>
      )}

      {isLocked && (
        <p role="alert" className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          Too many failed attempts. The form is locked.
        </p>
      )}
    </form>
  );
}
