import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'danger' && 'bg-red-100 text-red-800',
        variant === 'warning' && 'bg-yellow-100 text-yellow-800',
        variant === 'neutral' && 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  );
}
