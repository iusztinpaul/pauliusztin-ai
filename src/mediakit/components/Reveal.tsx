import type { ReactNode } from 'react';
import { useInView } from '../lib/useInView';

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
}

/** Fades + slides its children up the first time they scroll into view. */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
