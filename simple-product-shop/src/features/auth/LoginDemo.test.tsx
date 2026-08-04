import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { LoginDemo } from '@/features/auth/LoginDemo';

const DEMO_EMAIL = 'demo@example.com';
const WRONG_EMAIL = 'wrong@example.com';
const VALID_PASSWORD = 'Str0ng!Pass12';

const emailInput = () => screen.getByLabelText(/email/i);
const passwordInput = () => screen.getByLabelText('Password');
const submitButton = () => screen.getByRole('button', { name: /sign in/i });

async function fillForm(user: UserEvent, email: string, password: string) {
  await user.type(emailInput(), email);
  await user.type(passwordInput(), password);
}

async function clearForm(user: UserEvent) {
  await user.clear(emailInput());
  await user.clear(passwordInput());
}

describe('LoginDemo', () => {
  it('renders email and password inputs', () => {
    render(<LoginDemo />);

    expect(emailInput()).toBeInTheDocument();
    expect(passwordInput()).toBeInTheDocument();
  });

  it('disables submit while the form is invalid', async () => {
    const user = userEvent.setup();
    render(<LoginDemo />);

    expect(submitButton()).toBeDisabled();

    await fillForm(user, 'not-an-email', VALID_PASSWORD);
    expect(submitButton()).toBeDisabled();

    await clearForm(user);
    await fillForm(user, DEMO_EMAIL, 'weak');
    expect(submitButton()).toBeDisabled();
  });

  it('enables submit once email and password are valid', async () => {
    const user = userEvent.setup();
    render(<LoginDemo />);

    await fillForm(user, DEMO_EMAIL, VALID_PASSWORD);

    expect(submitButton()).toBeEnabled();
  });

  it('shows a success message for the demo account', async () => {
    const user = userEvent.setup();
    render(<LoginDemo />);

    await fillForm(user, DEMO_EMAIL, VALID_PASSWORD);
    await user.click(submitButton());

    expect(await screen.findByRole('status')).toHaveTextContent(/welcome/i);
    expect(screen.getByRole('status')).toHaveTextContent(DEMO_EMAIL);
  });

  it('shows invalid credentials with the remaining attempts', async () => {
    const user = userEvent.setup();
    render(<LoginDemo />);

    await fillForm(user, WRONG_EMAIL, VALID_PASSWORD);
    await user.click(submitButton());

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid credentials/i);
    expect(alert).toHaveTextContent(/2 attempts remaining/i);
  });

  it('locks the form after 3 failed attempts', async () => {
    const user = userEvent.setup();
    render(<LoginDemo />);

    // Attempt 1
    await fillForm(user, WRONG_EMAIL, VALID_PASSWORD);
    await user.click(submitButton());

    // Attempt 2
    await clearForm(user);
    await fillForm(user, WRONG_EMAIL, VALID_PASSWORD);
    await user.click(submitButton());

    // Attempt 3 - the form locks here, so the fields are not cleared afterwards
    await clearForm(user);
    await fillForm(user, WRONG_EMAIL, VALID_PASSWORD);
    await user.click(submitButton());

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/too many failed attempts/i);
    expect(emailInput()).toBeDisabled();
    expect(passwordInput()).toBeDisabled();
    expect(submitButton()).toBeDisabled();
  });
});
