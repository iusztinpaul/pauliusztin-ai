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

export interface SeriesPoint {
  /** ISO date of the week end, e.g. "2026-07-31". */
  date: string;
  /** Cumulative arrivals since the start of the period — followers for
   *  LinkedIn, subscribers for Substack. Net of churn on both. */
  added: number;
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
  followers: SeriesPoint[];
  jobTitle: DemographicItem[];
  seniority: DemographicItem[];
  industry: DemographicItem[];
  companySize: DemographicItem[];
  monthly: MonthlyLinkedIn[];
  totalImpressions: number;
  totalEngagements: number;
}

/**
 * Substack is reported in *subscribers* throughout — the population a sponsor
 * actually reaches. Followers are a different, larger set (people who follow
 * without taking the email), and mixing the two put a subscriber headline on
 * top of a follower chart. The sheet no longer carries the follower series.
 */
export interface SubstackStats {
  startSubscribers: number;
  endSubscribers: number;
  growthPct: number;
  subscribers: SeriesPoint[];
  traffic: TrafficPoint[];
  totalTraffic: number;
  location: LocationItem[];
}

/**
 * Present-day figures, as of the last sheet refresh — not period figures.
 *
 * The media kit describes a closed window (its numbers stop at periodEnd and
 * never move again), but the copy elsewhere on the site — "join 44k+
 * subscribers" — is a live claim about today. Those are different numbers the
 * moment the window closes, so the sheet carries both.
 */
export interface CurrentAudience {
  linkedin: number;
  substack: number;
}

export interface Dataset {
  /** Human date the numbers were last refreshed, e.g. "August 2026". */
  lastUpdated: string;
  /** ISO period bounds from the sheet, used for the header label. */
  periodStart: string;
  periodEnd: string;
  linkedin: LinkedInStats;
  substack: SubstackStats;
  /** Drives site-wide copy via scripts/fetch-mediakit.ts, not the media kit. */
  current: CurrentAudience;
}

// These test values, not row counts. A tab that is present but reads as zeroes
// — a renamed column, a gid now pointing at a different shape — is a failure,
// and should show the last good numbers or an empty state, never a flat chart.
export function linkedInHasData(li: LinkedInStats): boolean {
  return li.endFollowers > 0 || li.totalImpressions > 0 || li.jobTitle.length > 0;
}

export function substackHasData(ss: SubstackStats): boolean {
  return ss.endSubscribers > 0 || ss.totalTraffic > 0 || ss.subscribers.some((p) => p.added > 0);
}

export function datasetHasData(d: Dataset): boolean {
  return linkedInHasData(d.linkedin) || substackHasData(d.substack);
}

/**
 * Both growth series carry real numbers.
 *
 * Stricter than datasetHasData, and the check worth trusting: a tab can answer
 * with the right shape and the wrong columns — rename a column, repoint a gid —
 * and every row parses to zero. That reads as "data" by row count while
 * rendering a flat chart, so it must never reach the page or overwrite the
 * baked snapshot. Assumes a fully populated window; if the period is ever moved
 * forward, both series start empty and the snapshot holds until they fill.
 */
export function datasetIsSound(d: Dataset): boolean {
  return (
    d.linkedin.followers.some((p) => p.added > 0) &&
    d.substack.subscribers.some((p) => p.added > 0)
  );
}
