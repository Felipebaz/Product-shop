export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: PasswordStrength;
}

export const PASSWORD_RULES = {
  MIN_LENGTH: 12,
  STRONG_LENGTH: 16,
  SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`';]/,
} as const;

export interface PasswordRequirement {
  key: string;
  label: string;
  message: string;
  test: (password: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    key: 'length',
    label: `At least ${PASSWORD_RULES.MIN_LENGTH} characters`,
    message: `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters`,
    test: (p) => p.length >= PASSWORD_RULES.MIN_LENGTH,
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    message: 'Password must contain an uppercase letter',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    key: 'lowercase',
    label: 'One lowercase letter',
    message: 'Password must contain a lowercase letter',
    test: (p) => /[a-z]/.test(p),
  },
  {
    key: 'number',
    label: 'One number',
    message: 'Password must contain a number',
    test: (p) => /\d/.test(p),
  },
  {
    key: 'special',
    label: 'One special character',
    message: 'Password must contain a special character',
    test: (p) => PASSWORD_RULES.SPECIAL_CHARS.test(p),
  },
];

function getStrength(password: string, isValid: boolean): PasswordStrength {
  if (!isValid) return 'weak';
  if (password.length >= PASSWORD_RULES.STRONG_LENGTH) return 'strong';
  return 'medium';
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors = PASSWORD_REQUIREMENTS.filter((rule) => !rule.test(password)).map(
    (rule) => rule.message,
  );
  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    strength: getStrength(password, isValid),
  };
}
