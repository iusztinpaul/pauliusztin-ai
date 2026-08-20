import type { ReactNode } from 'react';

interface ChartCardProps {
  title?: string;
  caption?: string;
  className?: string;
  children: ReactNode;
}

export default function ChartCard({ title, caption, className = '', children }: ChartCardProps) {
  return (
    <div className={`card card-static p-5 md:p-6 ${className}`}>
      {(title || caption) && (
        <div className="mb-4 text-center">
          {title && <p className="text-base font-bold text-brand-white">{title}</p>}
          {caption && <p className="mt-0.5 text-xs text-brand-grey">{caption}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
