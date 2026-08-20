import { useInView } from '../../lib/useInView';

export interface BarItem {
  label: string;
  pct: number;
}

interface BarListProps {
  items: BarItem[];
  /** Suffix on the value, default "%". */
  unit?: string;
  /** Bar height in px. */
  size?: number;
}

/** Horizontal bars with a warm gradient fill that grow in when scrolled into view. */
export default function BarList({ items, unit = '%', size = 10 }: BarListProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const max = Math.max(...items.map((i) => i.pct), 1);

  return (
    <div ref={ref} className="space-y-3.5">
      {items.map((it, i) => (
        <div key={it.label} className="group">
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-brand-white">{it.label}</span>
            <span className="text-sm font-semibold tabular-nums text-brand-grey">
              {it.pct}
              {unit}
            </span>
          </div>
          <div
            className="w-full overflow-hidden rounded-full bg-brand-black1/25"
            style={{ height: size }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-out group-hover:brightness-110"
              style={{
                width: inView ? `${(it.pct / max) * 100}%` : '0%',
                transitionDelay: `${i * 90}ms`,
                background: 'linear-gradient(90deg, #e58925 0%, #d5342a 100%)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
