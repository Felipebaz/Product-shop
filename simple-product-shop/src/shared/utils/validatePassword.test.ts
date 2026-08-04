import { describe, it, expect } from 'vitest';
import { validatePassword } from './validatePassword';

const VALID_MEDIUM = 'Str0ng!Pass12'; // 13 chars
const VALID_STRONG = 'Str0ng!Password#42'; // 18 chars

describe('validatePassword', () => {
  it.each([
    ['is shorter than 12 characters', 'Sh0rt!Pass', 'at least 12 characters'],
    ['has no uppercase letter', 'str0ng!password', 'an uppercase letter'],
    ['has no lowercase letter', 'STR0NG!PASSWORD', 'a lowercase letter'],
    ['has no number', 'Strong!Password', 'a number'],
    ['has no special character', 'Str0ngPassword1', 'a special character'],
  ])('fails when the password %s', (_case, input, expectedError) => {
    const result = validatePassword(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.join('\n')).toContain(expectedError);
  });

  it('reports every broken rule at once', () => {
    const result = validatePassword('abc');

    expect(result.errors).toHaveLength(4);
    expect(result.errors).toEqual([
      'Password must be at least 12 characters',
      'Password must contain an uppercase letter',
      'Password must contain a number',
      'Password must contain a special character',
    ]);
  });

  it('rates an invalid password as weak', () => {
    expect(validatePassword('abc').strength).toBe('weak');
    expect(validatePassword('Sh0rt!Pass').strength).toBe('weak');
  });

  it('rates a valid password of 12-15 characters as medium', () => {
    expect(validatePassword(VALID_MEDIUM).strength).toBe('medium');
    expect(validatePassword('Str0ng!Pass1').strength).toBe('medium'); // 12
    expect(validatePassword('Str0ng!Pass1234').strength).toBe('medium'); // 15
  });

  it('rates a valid password of 16+ characters as strong', () => {
    expect(validatePassword(VALID_STRONG).strength).toBe('strong');
    expect(validatePassword('Str0ng!Pass12345').strength).toBe('strong'); // 16
  });

  it('returns isValid true with no errors for a valid password', () => {
    const result = validatePassword(VALID_MEDIUM);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
