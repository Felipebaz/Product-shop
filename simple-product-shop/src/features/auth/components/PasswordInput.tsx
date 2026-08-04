import { useState } from 'react';
import { PASSWORD_REQUIREMENTS, validatePassword } from '@/shared/utils';
import type { PasswordStrength } from '@/shared/utils';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  showRequirements?: boolean;
  disabled?: boolean;
}

const STRENGTH_STYLES: Record<PasswordStrength, { bar: string; text: string; width: string }> =
  {
    weak: { bar: 'bg-red-500', text: 'text-red-600', width: 'w-1/3' },
    medium: { bar: 'bg-yellow-500', text: 'text-yellow-600', width: 'w-2/3' },
    strong: { bar: 'bg-green-600', text: 'text-green-700', width: 'w-full' },
  };

export function PasswordInput({
  value,
  onChange,
  showRequirements = false,
  disabled = false,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { strength } = validatePassword(value);
  const styles = STRENGTH_STYLES[strength];

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          aria-label="Password"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="button"
          aria-label={isVisible ? 'Hide' : 'Show'}
          disabled={disabled}
          onClick={() => setIsVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-sm text-gray-600 hover:text-gray-900"
        >
          {isVisible ? '🙈' : '👁️'}
        </button>
      </div>

      {showRequirements && (
        <>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded bg-gray-200">
              <div
                className={`h-full rounded ${styles.bar} ${styles.width}`}
                aria-hidden="true"
              />
            </div>
            <span
              data-testid="password-strength"
              className={`text-xs font-medium capitalize ${styles.text}`}
            >
              {strength}
            </span>
          </div>

          <ul className="flex flex-col gap-0.5 text-xs">
            {PASSWORD_REQUIREMENTS.map((requirement) => {
              const met = requirement.test(value);
              return (
                <li
                  key={requirement.key}
                  data-testid={`requirement-${requirement.key}`}
                  data-met={met}
                  className={met ? 'text-green-700' : 'text-red-600'}
                >
                  <span aria-hidden="true">{met ? '✓' : '✗'}</span> {requirement.label}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
