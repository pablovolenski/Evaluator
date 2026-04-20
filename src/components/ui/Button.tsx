import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, className, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-indigo-600 text-white hover:bg-indigo-700',
        variant === 'outline' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        variant === 'ghost' && 'text-gray-600 hover:bg-gray-100',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        size === 'sm' && 'px-3 py-1.5 text-sm gap-1.5',
        size === 'md' && 'px-4 py-2 text-sm gap-2',
        size === 'lg' && 'px-6 py-3 text-base gap-2',
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
});
