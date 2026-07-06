import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-card)] overflow-hidden
        ${onClick ? 'cursor-pointer transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-out-soft)] hover:border-ink hover:shadow-[var(--shadow-pop)] hover:-translate-y-0.5 active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
