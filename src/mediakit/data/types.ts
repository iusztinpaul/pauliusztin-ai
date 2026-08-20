// ---------------------------------------------------------------------------
// Data model for the media kit.
//
// Everything the site renders comes from a `Dataset`. The snapshot in
// `snapshot.ts` is the bundled fallback; `load.ts` can instead hydrate this
// same shape from a published Google Sheet so updates need no redeploy.
// ---------------------------------------------------------------------------


export interface FollowerPoint {
  /** ISO-ish date label shown on the x-axis, e.g. "2025-01-15". */
  date: string;
  /** Cumulative NEW followers gained since the start of the period. */
  newFollowers: number;
}

export interface DemographicItem {
  label: string;
  pct: number;
}

export interface MonthlyLinkedIn {
  month: string; // "Jan" ... "Dec"
  impressions: number;
  engagements: number;
}

export interface TrafficPoint {
  month: string; // "Jan" ... "Dec"
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
 * Current global audience snapshot (decoupled from the year toggle — location
 * is a "where are my readers now" snapshot, not a per-year total). Generated
 * from a Substack CSV by scripts/build-audience-location.mjs.
 */
export interface AudienceLocation {
  /** ISO date the snapshot was exported. */
  updated: string;
  /** Total subscribers across all countries (incl. ones the map can't draw). */
  total: number;
  /** Number of countries with subscribers. */
  countries: number;
  /** Per-country breakdown, sorted by count desc. */
  items: LocationItem[];
}

export interface LinkedInYear {
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
}

export interface SubstackYear {
  startFollowers: number;
  endFollowers: number;
  growthPct: number;
  followers: FollowerPoint[];
  traffic: TrafficPoint[];
  totalTraffic: number;
  totalSubscribers: number;
  location: LocationItem[];
}

export interface YearData {
  year: string; // "2025", "2026"
  /** True when the period only covers part of the year (e.g. 2026 mid-year). */
  ytd: boolean;
  /** Last covered month for a YTD period, e.g. "Jun". */
  through?: string;
  linkedin: LinkedInYear;
  substack: SubstackYear;
}

export interface Dataset {
  /** Human date the numbers were last refreshed. */
  lastUpdated: string;
  /** Years present, oldest → newest. */
  years: YearData[];
}

/** A LinkedIn year carries data when it has a follower curve or demographics. */
export function linkedInHasData(li: LinkedInYear): boolean {
  return li.followers.length > 0 || li.jobTitle.length > 0 || li.totalImpressions > 0;
}

export function substackHasData(ss: SubstackYear): boolean {
  return ss.followers.length > 0 || ss.traffic.length > 0 || ss.totalSubscribers > 0;
}

export function yearHasData(y: YearData): boolean {
  return linkedInHasData(y.linkedin) || substackHasData(y.substack);
}
