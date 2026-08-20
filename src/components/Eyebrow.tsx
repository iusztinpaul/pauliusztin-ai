import React from 'react';

export default function Eyebrow({
  children,
  center = false,
  className = '',
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <span className={`eyebrow ${center ? 'eyebrow--center' : ''} ${className}`}>
      {children}
    </span>
  );
}
