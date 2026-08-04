import { describe, it, expect } from 'vitest';

describe('vitest setup', () => {
  it('runs in a jsdom environment', () => {
    expect(typeof document).toBe('object');
  });

  it('registers jest-dom matchers', () => {
    expect(document.body).toBeInTheDocument();
  });
});
