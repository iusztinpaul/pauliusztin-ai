// ---------------------------------------------------------------------------
// Data model for the media kit.
//
// One fixed period — currently 1 Aug 2025 to 31 Jul 2026 — not a set of years.
// The sheet owns the dates (meta.period_start / period_end); nothing here
// assumes a calendar year, so moving the window is a sheet edit.
//
// Everything the site renders comes from a `Dataset`. snapshot.ts is the
// bundled fallback, baked from the same sheet at build time; load.ts hydrates
// this shape live so updates need no redeploy.
// ---------------------------------------------------------------------------

export interface FollowerPoint {
  /** ISO date of the week end, e.g. "2026-07-31". */
  date: string;
  /** Cumulative NEW followers gained since the start of the period. */
  newFollowers: number;
}

export interface DemographicItem {
  label: string;
  pct: number;
}

export interface MonthlyLinkedIn {
  month: string; // "Aug" ... "Jul"
  impressions: number;
  engagements: number;
}

export interface TrafficPoint {
  month: string; // "Aug" ... "Jul"
  traffic: number;
}

export interface LocationItem {
  /** Display label, e.g. "USA". */
  country: string;
  pct: number;
  /** Name as it appears in the world-atlas topojson, for choropleth matching. */
  atlasName: string;
  /** Subscriber count (used to shade the map on a log scale). */
  count?: number;
}

/**
 * Where the readers are *now* — a current snapshot, deliberately not tied to
 * the period. Demographics work the same way: nobody asks what the audience's
 * seniority mix was last August.
 */
export interface AudienceLocation {
  /** Number of countries with subscribers. */
  countries: number;
  /** Per-country breakdown, sorted by count desc. */
  items: LocationItem[];
}

export interface LinkedInStats {
  startFollowers: number;
  endFollowers: number;
  growthPct: number;
  followers: FollowerPoint[];
  jobTitle: DemographicItem[];
  seniority: DemographicItem[];
  industry: DemographicItem[];
  companySize: DemographicItem[];
  monthly: MonthlyLinkedIn[];
  totalImpressions: number;
  totalEngagements: number;
  /** The figure shown as the KPI; falls back to endFollowers when unset. */
  headlineAudience: number;
}

export interface SubstackStats {
  startFollowers: number;
  endFollowers: number;
  growthPct: number;
  followers: FollowerPoint[];
  traffic: TrafficPoint[];
  totalTraffic: number;
  location: LocationItem[];
  /** Subscribers is a different population from followers — see the sheet. */
  headlineAudience: number;
}

export interface Dataset {
  /** Human date the numbers were last refreshed, e.g. "August 2026". */
  lastUpdated: string;
  /** ISO period bounds from the sheet, used for the header label. */
  periodStart: string;
  periodEnd: string;
  linkedin: LinkedInStats;
  substack: SubstackStats;
}

export function linkedInHasData(li: LinkedInStats): boolean {
  return li.followers.length > 0 || li.jobTitle.length > 0 || li.totalImpressions > 0;
}

export function substackHasData(ss: SubstackStats): boolean {
  return ss.followers.length > 0 || ss.traffic.length > 0 || ss.headlineAudience > 0;
}

export function datasetHasData(d: Dataset): boolean {
  return linkedInHasData(d.linkedin) || substackHasData(d.substack);
}
