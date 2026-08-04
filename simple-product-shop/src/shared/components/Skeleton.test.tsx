import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/shared/components/Skeleton';

describe('Skeleton', () => {
  it('renders a pulsing placeholder', () => {
    render(<Skeleton />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.className).toContain('animate-pulse');
  });

  it('exposes a busy status to assistive technology', () => {
    render(<Skeleton />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveAccessibleName(/loading/i);
  });

  it('defaults to the text variant', () => {
    render(<Skeleton />);

    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-variant', 'text');
  });

  it.each([
    ['text', 'rounded'],
    ['rectangular', 'rounded-md'],
    ['circular', 'rounded-full'],
  ])('applies the %s variant', (variant, expectedClass) => {
    render(<Skeleton variant={variant as 'text' | 'rectangular' | 'circular'} />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-variant', variant);
    expect(skeleton.className).toContain(expectedClass);
  });

  it('accepts custom width and height', () => {
    render(<Skeleton width="120px" height="2rem" />);

    // jsdom resolves rem against the 16px root font size
    expect(screen.getByTestId('skeleton')).toHaveStyle({
      width: '120px',
      height: '32px',
    });
  });
});
