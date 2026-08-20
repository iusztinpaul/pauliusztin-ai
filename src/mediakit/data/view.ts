import type { Dataset, YearData } from './types';
import { linkedInHasData, substackHasData, yearHasData } from './types';

export const LIFETIME = 'lifetime';

export interface ResolvedView {
  key: string;
  /** Pretty label for the selected view, e.g. "2026 YTD (through Jun)". */
  label: string;
  data: YearData;
  hasLinkedIn: boolean;
  hasSubstack: boolean;
  hasData: boolean;
  /** True when the period is partial (YTD) — used to caption charts. */
  partial: boolean;
}

export function yearLabel(y: YearData): string {
  return y.ytd ? `${y.year} YTD${y.through ? ` (through ${y.through})` : ''}` : y.year;
}

/** Stitch per-year cumulative-new-follower curves into one continuous line. */
function stitchFollowers(years: YearData[], pick: (y: YearData) => YearData['linkedin'] | YearData['substack']) {
  let offset = 0;
  const out: { date: string; newFollowers: number }[] = [];
  for (const y of years) {
    const curve = pick(y).followers;
    for (const p of curve) out.push({ date: p.date, newFollowers: p.newFollowers + offset });
    if (curve.length) offset += curve[curve.length - 1].newFollowers;
  }
  return out;
}

function prefixMonths<T extends { month: string }>(rows: T[], year: string, multiYear: boolean): T[] {
  if (!multiYear) return rows;
  const yy = year.slice(-2);
  return rows.map((r) => ({ ...r, month: `${r.month} '${yy}` }));
}

function buildLifetime(years: YearData[]): YearData {
  const dataYears = years.filter(yearHasData);
  const liYears = dataYears.filter((y) => linkedInHasData(y.linkedin));
  const ssYears = dataYears.filter((y) => substackHasData(y.substack));
  const multiLi = liYears.length > 1;
  const multiSs = ssYears.length > 1;

  const latestLi = liYears[liYears.length - 1]?.linkedin;
  const latestSs = ssYears[ssYears.length - 1]?.substack;
  const firstLi = liYears[0]?.linkedin;
  const firstSs = ssYears[0]?.substack;

  const liStart = firstLi?.startFollowers ?? 0;
  const liEnd = latestLi?.endFollowers ?? 0;
  const ssStart = firstSs?.startFollowers ?? 0;
  const ssEnd = latestSs?.endFollowers ?? 0;

  return {
    year: 'Lifetime',
    ytd: false,
    linkedin: {
      startFollowers: liStart,
      endFollowers: liEnd,
      growthPct: liStart ? ((liEnd - liStart) / liStart) * 100 : 0,
      followers: stitchFollowers(liYears, (y) => y.linkedin),
      jobTitle: latestLi?.jobTitle ?? [],
      seniority: latestLi?.seniority ?? [],
      industry: latestLi?.industry ?? [],
      companySize: latestLi?.companySize ?? [],
      monthly: liYears.flatMap((y) => prefixMonths(y.linkedin.monthly, y.year, multiLi)),
      totalImpressions: liYears.reduce((s, y) => s + y.linkedin.totalImpressions, 0),
      totalEngagements: liYears.reduce((s, y) => s + y.linkedin.totalEngagements, 0),
    },
    substack: {
      startFollowers: ssStart,
      endFollowers: ssEnd,
      growthPct: ssStart ? ((ssEnd - ssStart) / ssStart) * 100 : 0,
      followers: stitchFollowers(ssYears, (y) => y.substack),
      traffic: ssYears.flatMap((y) => prefixMonths(y.substack.traffic, y.year, multiSs)),
      totalTraffic: ssYears.reduce((s, y) => s + y.substack.totalTraffic, 0),
      totalSubscribers: latestSs?.totalSubscribers ?? 0,
      location: latestSs?.location ?? [],
    },
  };
}

export function resolveView(dataset: Dataset, key: string): ResolvedView {
  const data = key === LIFETIME ? buildLifetime(dataset.years) : dataset.years.find((y) => y.year === key) ?? dataset.years[0];
  const label = key === LIFETIME ? 'Lifetime' : yearLabel(data);
  return {
    key,
    label,
    data,
    hasLinkedIn: linkedInHasData(data.linkedin),
    hasSubstack: substackHasData(data.substack),
    hasData: yearHasData(data),
    partial: data.ytd,
  };
}

/**
 * Years to offer in the toggle: the two most recent years present in the data,
 * plus a Lifetime option. Earlier years are "archived" — hidden from the toggle
 * to keep it from piling up, but their numbers are still aggregated into
 * Lifetime (see buildLifetime, which reads every year in the dataset).
 */
export function viewOptions(dataset: Dataset): { key: string; label: string }[] {
  const recent = [...dataset.years]
    .sort((a, b) => Number(a.year) - Number(b.year))
    .slice(-2);
  const years = recent.map((y) => ({ key: y.year, label: yearLabel(y) }));
  return [...years, { key: LIFETIME, label: 'Lifetime' }];
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
      { label: view.partial ? 'Reach YTD' : 'Annual Reach', value: '—', sub: 'Impressions + Views' },
      { label: 'LinkedIn Followers', value: '—' },
      { label: 'Substack Subscribers', value: '—' },
    ];
  }
  const { linkedin: li, substack: ss } = view.data;
  const audience = li.endFollowers + ss.totalSubscribers;
  const reach = li.totalImpressions + ss.totalTraffic;
  const reachLabel = view.partial ? 'Reach YTD' : view.key === LIFETIME ? 'Total Reach' : 'Annual Reach';
  const growthSub = (g: number) => (g > 0 ? `+${g.toFixed(0)}% Growth` : undefined);

  return [
    { label: 'Combined Audience', value: plusK(audience), raw: audience, format: plusK, sub: 'All Platforms' },
    { label: reachLabel, value: compact(reach), raw: reach, format: compact, sub: 'Impressions + Views' },
    { label: 'LinkedIn Followers', value: plusK(li.endFollowers), raw: li.endFollowers, format: plusK, sub: growthSub(li.growthPct) },
    { label: 'Substack Subscribers', value: plusK(ss.totalSubscribers), raw: ss.totalSubscribers, format: plusK, sub: growthSub(ss.growthPct) },
  ];
}
