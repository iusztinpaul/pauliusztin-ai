import type { DemographicItem } from '../../data/types';
import BarList from './BarList';

interface DemographicChartProps {
  title: string;
  items: DemographicItem[];
}

export default function DemographicChart({ title, items }: DemographicChartProps) {
  return (
    <div>
      <p className="mb-4 text-sm font-bold text-brand-white">{title}</p>
      <BarList items={items} />
    </div>
  );
}
