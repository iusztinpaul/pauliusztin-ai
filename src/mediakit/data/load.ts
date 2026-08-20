import type { Dataset, YearData } from './types';
import { SNAPSHOT } from './snapshot';
import { PUBLISHED_ID, fetchDataset } from './sheet';

/**
 * Does this year carry anything worth rendering? The sheet holds a row per
 * planned year, so 2026 exists with only `ytd`/`through` set until the exports
 * land — that is a placeholder, not data.
 */
function hasData(y: YearData): boolean {
  const { linkedin: li, substack: ss } = y;
  return (
    li.endFollowers > 0 || ss.endFollowers > 0 ||
    li.totalImpressions > 0 || ss.totalTraffic > 0 ||
    li.followers.length > 0 || ss.followers.length > 0 ||
    li.monthly.length > 0 || ss.traffic.length > 0
  );
}

/**
 * Sheet years win; a year the sheet leaves empty keeps whatever the snapshot
 * shows for it, so an unfilled 2026 renders exactly as it does today rather
 * than flipping to zeroes. Snapshot-only years are preserved too.
 */
function mergeYears(sheetYears: YearData[], snapshotYears: YearData[]): YearData[] {
  const bySnapshot = new Map(snapshotYears.map((y) => [y.year, y]));
  const merged = sheetYears.map((y) => (hasData(y) ? y : bySnapshot.get(y.year) ?? y));
  const seen = new Set(merged.map((y) => y.year));
  for (const y of snapshotYears) if (!seen.has(y.year)) merged.push(y);
  return merged.sort((a, b) => a.year.localeCompare(b.year));
}

/**
 * The dataset for the page: the live sheet when it can be read, else the
 * snapshot baked from that same sheet at build time by
 * scripts/fetch-mediakit.ts. Any failure — outage, changed gid, a firewall
 * blocking docs.google.com — degrades to data that is current as of the last
 * deploy rather than to nothing.
 */
export async function loadDataset(): Promise<Dataset> {
  if (!PUBLISHED_ID) return SNAPSHOT;
  try {
    const live = await fetchDataset();
    return {
      lastUpdated: live.lastUpdated || SNAPSHOT.lastUpdated,
      years: mergeYears(live.years, SNAPSHOT.years),
    };
  } catch (err) {
    console.warn('[media-kit] Falling back to bundled snapshot:', err);
    return SNAPSHOT;
  }
}
