import type { Dataset } from './types';
import { SNAPSHOT } from './snapshot';
import { PUBLISHED_ID, fetchDataset } from './sheet';
import { datasetHasData } from './types';

/**
 * The dataset for the page: the live sheet when it can be read, else the
 * snapshot baked from that same sheet at build time by
 * scripts/fetch-mediakit.ts. Any failure — outage, changed gid, a firewall
 * blocking docs.google.com — degrades to data that is current as of the last
 * deploy rather than to nothing.
 *
 * A sheet that answers but carries nothing is treated as a failure too: an
 * empty grid should show the last good numbers, not zeroes.
 */
export async function loadDataset(): Promise<Dataset> {
  if (!PUBLISHED_ID) return SNAPSHOT;
  try {
    const live = await fetchDataset();
    if (!datasetHasData(live)) throw new Error('sheet returned no data');
    return { ...live, lastUpdated: live.lastUpdated || SNAPSHOT.lastUpdated };
  } catch (err) {
    console.warn('[media-kit] Falling back to bundled snapshot:', err);
    return SNAPSHOT;
  }
}
