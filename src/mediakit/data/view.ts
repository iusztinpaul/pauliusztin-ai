import type { Dataset } from './types';
import { datasetHasData, linkedInHasData, substackHasData } from './types';

/** "2025-08-01" + "2026-07-31" → "Aug 2025 – Jul 2026". */
export function periodLabel(d: Dataset): string {
  const fmt = (iso: string) => {
    const [y, m] = iso.split('-');
    const name = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m) - 1];
    return name ? `${name} ${y}` : iso;
  };
  if (!d.periodStart || !d.periodEnd) return '';
  return `${fmt(d.periodStart)} – ${fmt(d.periodEnd)}`;
}

export interface ResolvedView {
  label: string;
  data: Dataset;
  hasLinkedIn: boolean;
  hasSubstack: boolean;
  hasData: boolean;
}

export function resolveView(dataset: Dataset): ResolvedView {
  return {
    label: periodLabel(dataset),
    data: dataset,
    hasLinkedIn: linkedInHasData(dataset.linkedin),
    hasSubstack: substackHasData(dataset.substack),
    hasData: datasetHasData(dataset),
  };
}

export interface Kpi {
  label: string;
  value: string;
  /** When set, the card count-ups this number using `format`. */
  raw?: number;
  format?: (n: number) => string;
  sub?: string;
}

const compact = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}k`;
  return n.toLocaleString('en-US');
};

const full = (n: number): string => n.toLocaleString('en-US');

/** Floor to thousands with a "+" — e.g. 128,153 → "128k+". */
const plusK = (n: number): string => (n >= 1_000 ? `${Math.floor(n / 1_000)}k+` : full(n));

export function computeKpis(view: ResolvedView): Kpi[] {
  if (!view.hasData) {
    return [
      { label: 'Combined Audience', value: '—', sub: 'All Platforms' },
      { label: 'Reach', value: '—', sub: 'Impressions + Views' },
      { label: 'LinkedIn Followers', value: '—' },
      { label: 'Substack Subscribers', value: '—' },
    ];
  }
  const { linkedin: li, substack: ss } = view.data;
  const liAudience = li.endFollowers;
  const ssAudience = ss.endSubscribers;
  const audience = liAudience + ssAudience;
  const reach = li.totalImpressions + ss.totalTraffic;
  const growthSub = (g: number) => (g > 0 ? `+${g.toFixed(0)}% Growth` : undefined);

  return [
    { label: 'Combined Audience', value: plusK(audience), raw: audience, format: plusK, sub: 'All Platforms' },
    { label: 'Reach', value: compact(reach), raw: reach, format: compact, sub: 'Impressions + Views' },
    { label: 'LinkedIn Followers', value: plusK(liAudience), raw: liAudience, format: plusK, sub: growthSub(li.growthPct) },
    { label: 'Substack Subscribers', value: plusK(ssAudience), raw: ssAudience, format: plusK, sub: growthSub(ss.growthPct) },
  ];
}
