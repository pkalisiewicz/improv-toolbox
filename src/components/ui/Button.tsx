import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<string, string> = {
  // The signature CTA — gold fill, ink border, hard offset shadow that collapses on press.
  primary:
    'bg-brand-500 text-ink border-2 border-ink font-bold shadow-[var(--shadow-hard)] ' +
    'hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
  // Soft gold tint — subordinate accent action.
  accent:
    'bg-brand-50 text-brand-700 border-2 border-brand-200 font-bold hover:bg-brand-100 active:scale-[0.97]',
  // Outline poster button.
  secondary:
    'bg-surface text-ink border-2 border-ink font-bold hover:bg-surface-3 active:scale-[0.97]',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-ink/[0.05] font-semibold active:scale-[0.97]',
  danger:
    'bg-red-500 text-white border-2 border-ink font-bold shadow-[var(--shadow-hard)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
};

const SIZE_CLASSES: Record<string, string> = {
  sm:  'px-3 py-1.5 text-sm rounded-[var(--radius-sm)] lg:px-4 lg:py-2 lg:text-base',
  md:  'px-4 py-2 text-sm rounded-[var(--radius-md)] lg:px-5 lg:py-2.5 lg:text-base',
  lg:  'px-5 py-3 text-base rounded-[var(--radius-md)] lg:px-6 lg:py-3.5 lg:text-lg',
  xl:  'px-6 py-4 text-lg rounded-[var(--radius-lg)] lg:px-7 lg:py-5 lg:text-xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center gap-2
        transition-[transform,background-color,box-shadow,filter] duration-150 ease-[var(--ease-out-soft)]
        cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-2)] focus-visible:ring-brand-500
        disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
