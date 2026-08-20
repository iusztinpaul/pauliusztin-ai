interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  labelFormatter?: (label: string | number) => string;
  valueFormatter?: (value: number) => string;
}

const defaultFmt = (v: number) => v.toLocaleString('en-US');

export default function ChartTooltip({
  active,
  label,
  payload,
  labelFormatter,
  valueFormatter = defaultFmt,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-brand-black1/60 bg-brand-black3/95 px-3.5 py-2.5 shadow-xl backdrop-blur-sm">
      {label !== undefined && label !== '' && (
        <p className="mb-1 text-xs font-medium text-brand-grey">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-sm font-semibold text-brand-white">
          {entry.color && (
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
          )}
          {entry.name && <span className="text-brand-grey font-normal">{entry.name}:</span>}
          {typeof entry.value === 'number' ? valueFormatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}
