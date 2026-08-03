import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', type = 'button', ...rest }: ButtonProps) {
  const base =
    'rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50';
  return <button type={type} className={`${base} ${className}`.trim()} {...rest} />;
}
