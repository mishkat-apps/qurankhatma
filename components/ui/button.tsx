import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, tone = 'primary', size = 'md', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-8 py-4 text-base',
        tone === 'primary' && 'bg-[var(--accent)] text-white shadow-lg shadow-emerald-900/15 hover:bg-[var(--accent-strong)]',
        tone === 'secondary' && 'bg-white/80 text-[var(--foreground)] ring-1 ring-[var(--line)] hover:bg-white',
        tone === 'ghost' && 'bg-transparent text-[var(--accent-strong)] hover:bg-white/60',
        tone === 'danger' && 'bg-[var(--danger)] text-white hover:opacity-90',
        className,
      )}
      {...props}
    />
  );
});

