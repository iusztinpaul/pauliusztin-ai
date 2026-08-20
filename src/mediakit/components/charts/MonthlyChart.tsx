import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BRAND, mix } from '../../lib/colors';
import { useInView } from '../../lib/useInView';
import { useIsMobile } from '../../lib/useIsMobile';
import ChartTooltip from './ChartTooltip';

export interface MonthlyDatum {
  month: string;
  value: number;
}

const compact = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k`;
  return `${n}`;
};

interface MonthlyChartProps {
  title?: string;
  data: MonthlyDatum[];
  /** Series label shown in the tooltip, e.g. "Impressions". Also used to key gradient ids. */
  name: string;
}

export default function MonthlyChart({ title, data, name }: MonthlyChartProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const mobile = useIsMobile();
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  // Each bar's top is shaded yellow (quiet) → orange (big); it then fades out
  // toward the baseline, the same soft gradient used on the growth charts.
  const shade = (v: number) => mix(BRAND.yellow, BRAND.orange, min === max ? 1 : (v - min) / (max - min));
  const base = `mbar-${name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      {title && <p className="mb-3 text-center text-sm font-semibold text-brand-grey">{title}</p>}
      <div ref={ref} className="h-[300px] w-full md:h-[260px]">
        {inView && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 22, right: 6, left: 6, bottom: 4 }}>
              <defs>
                {data.map((d, i) => {
                  const c = shade(d.value);
                  return (
                    <linearGradient key={i} id={`${base}-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={c} stopOpacity={0.08} />
                    </linearGradient>
                  );
                })}
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fill: BRAND.grey, fontSize: mobile ? 9 : 10.5 }}
                tickLine={false}
                axisLine={{ stroke: BRAND.black1, strokeOpacity: 0.4 }}
                interval={0}
              />
              <YAxis hide domain={[0, max * 1.18]} />
              <Tooltip
                cursor={{ fill: BRAND.black1, fillOpacity: 0.18 }}
                content={<ChartTooltip valueFormatter={(v) => v.toLocaleString('en-US')} />}
              />
              <Bar
                dataKey="value"
                name={name}
                radius={[5, 5, 0, 0]}
                maxBarSize={44}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={`url(#${base}-${i})`} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => compact(Number(v))}
                  fill={BRAND.grey}
                  fontSize={mobile ? 8.5 : 9.5}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
