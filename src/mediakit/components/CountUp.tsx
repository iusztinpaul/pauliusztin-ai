import { useEffect, useRef, useState } from 'react';
import { useInView } from '../lib/useInView';

interface CountUpProps {
  value: number;
  format: (n: number) => string;
  durationMs?: number;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates a number from 0 → value when it scrolls into view. */
export default function CountUp({ value, format, durationMs = 1100 }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / durationMs);
      setDisplay(value * easeOut(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs]);

  return <span ref={ref}>{format(display)}</span>;
}
