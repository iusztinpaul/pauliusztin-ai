import type { Dataset } from './types';
import { SNAPSHOT } from './snapshot';
import { PUBLISHED_ID, fetchDataset } from './sheet';
import { datasetIsSound } from './types';

/**
 * The dataset for the page: the live sheet when it can be read, else the
 * snapshot baked from that same sheet at build time by
 * scripts/fetch-mediakit.ts. Any failure — outage, changed gid, a firewall
 * blocking docs.google.com — degrades to data that is current as of the last
 * deploy rather than to nothing.
 *
 * A sheet that answers but carries nothing — or answers with columns that all
 * parse to zero — is treated as a failure too: it should show the last good
 * numbers, not a flat chart.
 */
/**
 * What the page renders immediately, before the sheet answers.
 *
 * Reading the sheet costs ~1.1s of round-trip latency for ~9 kB — a fixed
 * cost that a faster connection does not reduce, and one Google's cache
 * headers make us pay again on almost every visit (the redirect hop is
 * no-store). Blocking on it left the page spinning; this is the same
 * build-time data the fallback path uses, so showing it first costs nothing
 * and the live fetch only refines it.
 */
export const INITIAL_DATASET: Dataset = SNAPSHOT;

export async function loadDataset(): Promise<Dataset> {
  if (!PUBLISHED_ID) return SNAPSHOT;
  try {
    const live = await fetchDataset();
    if (!datasetIsSound(live)) throw new Error('sheet returned a zeroed series');
    return { ...live, lastUpdated: live.lastUpdated || SNAPSHOT.lastUpdated };
  } catch (err) {
    console.warn('[media-kit] Falling back to bundled snapshot:', err);
    return SNAPSHOT;
  }
}
