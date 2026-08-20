import { LineChart } from 'lucide-react';

export default function EmptyState({ year }: { year: string }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-black1/30 text-brand-orange">
        <LineChart size={22} />
      </div>
      <p className="text-lg font-semibold text-brand-white">No {year} data yet</p>
      <p className="max-w-md text-sm leading-relaxed text-brand-grey">
        Add your {year} numbers to the connected Google Sheet and they'll appear here
        automatically — no rebuild needed.
      </p>
    </div>
  );
}
