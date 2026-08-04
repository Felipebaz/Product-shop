import { useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
}

export const TOAST_DURATION_MS = 3000;

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

export function Toast({
  message,
  variant = 'success',
  duration = TOAST_DURATION_MS,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${VARIANT_CLASSES[variant]}`}
    >
      <span className="text-sm">{message}</span>
      <button
        type="button"
        aria-label="Close notification"
        onClick={onClose}
        className="ml-auto text-lg leading-none opacity-80 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
