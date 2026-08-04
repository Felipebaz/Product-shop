import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '@/features/auth/components/PasswordInput';

describe('PasswordInput', () => {
  it('renders a masked password input', () => {
    render(<PasswordInput value="" onChange={() => {}} />);

    const input = screen.getByLabelText('Password');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PasswordInput value="" onChange={onChange} />);

    await user.type(screen.getByLabelText('Password'), 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('toggles the password visibility', async () => {
    const user = userEvent.setup();
    render(<PasswordInput value="secret" onChange={() => {}} />);

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show/i }));
    expect(input).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /hide/i }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('does not render requirements by default', () => {
    render(<PasswordInput value="abc" onChange={() => {}} />);

    expect(screen.queryByText(/at least 12 characters/i)).not.toBeInTheDocument();
  });

  it('renders the requirement list when showRequirements is true', () => {
    render(<PasswordInput value="abc" onChange={() => {}} showRequirements />);

    expect(screen.getByText(/at least 12 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/number/i)).toBeInTheDocument();
    expect(screen.getByText(/special character/i)).toBeInTheDocument();
  });

  it('marks each requirement as met or unmet', () => {
    render(<PasswordInput value="abc" onChange={() => {}} showRequirements />);

    expect(screen.getByTestId('requirement-lowercase')).toHaveAttribute(
      'data-met',
      'true',
    );
    expect(screen.getByTestId('requirement-uppercase')).toHaveAttribute(
      'data-met',
      'false',
    );
  });

  it('shows the strength indicator for a non-empty password', () => {
    render(<PasswordInput value="Str0ng!Pass12" onChange={() => {}} showRequirements />);

    expect(screen.getByTestId('password-strength')).toHaveTextContent(/medium/i);
  });

  it('reports strong for a 16+ character valid password', () => {
    render(
      <PasswordInput value="Str0ng!Password#42" onChange={() => {}} showRequirements />,
    );

    expect(screen.getByTestId('password-strength')).toHaveTextContent(/strong/i);
  });
});
