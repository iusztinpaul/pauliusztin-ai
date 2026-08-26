import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SeriesPoint } from '../../data/types';
import { BRAND } from '../../lib/colors';
import { useIsMobile } from '../../lib/useIsMobile';
import ChartTooltip from './ChartTooltip';
import CountUp from '../CountUp';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(d: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return d;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}`;
}

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`);
const full = (n: number) => Math.round(n).toLocaleString('en-US');

interface GrowthChartProps {
  points: SeriesPoint[];
  startValue: number;
  endValue: number;
  growthPct: number;
  unitLabel: string;
  periodLabel: string;
  gradientId: string;
}

export default function GrowthChart({
  points,
  startValue,
  endValue,
  growthPct,
  unitLabel,
  periodLabel,
  gradientId,
}: GrowthChartProps) {
  const mobile = useIsMobile();
  // Fewer date ticks on a phone so the labels stop colliding.
  // One more label fits on a phone now the plot is full width.
  const interval = Math.max(0, Math.floor(points.length / (mobile ? 4 : 7)));
  const last = points[points.length - 1];

  return (
    <div>
      {/* Headline stats — readable without hovering. No flex-wrap + tabular-nums
          so the count-up can't bump a block onto a second line mid-animation;
          numbers shrink a step on phones so both blocks stay on one line. */}
      <div className="mb-6 flex items-end justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-3xl font-extrabold leading-none gradient-text tabular-nums sm:text-4xl md:text-5xl">
            <CountUp value={growthPct} format={(n) => `+${n.toFixed(0)}%`} />
          </p>
          <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-brand-grey sm:whitespace-nowrap">
            {periodLabel} growth
          </p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-2xl font-extrabold leading-none text-brand-white tabular-nums sm:text-3xl md:text-4xl">
            <CountUp value={endValue} format={full} />
          </p>
          <p className="mt-1.5 text-xs text-brand-grey sm:whitespace-nowrap">
            {unitLabel} · from {full(startValue)}
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 16, right: 4, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND.orange} stopOpacity={0.5} />
                <stop offset="100%" stopColor={BRAND.red} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BRAND.black1} strokeOpacity={0.25} vertical={false} />
            <XAxis
              dataKey="date"
              // The end labels centre on the first and last points, so without
              // this the opening date sat half outside the card. Insets the
              // data rather than the axis, so the grid still spans full width.
              padding={{ left: 18, right: 14 }}
              tickFormatter={fmtDate}
              interval={interval}
              tick={{ fill: BRAND.grey, fontSize: mobile ? 10 : 11 }}
              tickLine={false}
              axisLine={{ stroke: BRAND.black1, strokeOpacity: 0.4 }}
              minTickGap={mobile ? 16 : 8}
            />
            {/* mirror draws the value labels inside the plot instead of in a
                44px gutter beside it, so the chart spans the same width as the
                figures above it. dy lifts each label clear of its gridline. */}
            <YAxis
              tickFormatter={compact}
              tick={{ fill: BRAND.grey, fontSize: 11, dy: -7 }}
              tickLine={false}
              axisLine={false}
              width={30}
              mirror
            />
            <Tooltip
              cursor={{ stroke: BRAND.orange, strokeOpacity: 0.4 }}
              content={
                <ChartTooltip
                  labelFormatter={(l) => fmtDate(String(l))}
                  valueFormatter={(v) => `+${v.toLocaleString('en-US')} (${(startValue + v).toLocaleString('en-US')} total)`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="added"
              name="New followers"
              stroke={BRAND.orange}
              strokeWidth={2.75}
              fill={`url(#${gradientId})`}
              animationDuration={1400}
              activeDot={{ r: 4, fill: BRAND.orange, stroke: BRAND.black3, strokeWidth: 2 }}
            />
            {last && (
              <ReferenceDot
                x={last.date}
                y={last.added}
                r={5}
                fill={BRAND.orange}
                stroke={BRAND.black3}
                strokeWidth={2.5}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
