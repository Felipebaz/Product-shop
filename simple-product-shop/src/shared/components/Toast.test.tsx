import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '@/shared/components/Toast';

afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('renders the message as an alert', () => {
    render(<Toast message="Added to cart" onClose={() => {}} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Added to cart');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it.each([
    ['success', 'bg-green'],
    ['error', 'bg-red'],
    ['info', 'bg-blue'],
  ])('uses the %s colour', (variant, expectedClass) => {
    render(
      <Toast
        message="Message"
        variant={variant as 'success' | 'error' | 'info'}
        onClose={() => {}}
      />,
    );

    expect(screen.getByRole('alert').className).toContain(expectedClass);
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Toast message="Added to cart" onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after 3 seconds', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast message="Added to cart" onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto-close before the duration elapses', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast message="Added to cart" onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(2999);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
