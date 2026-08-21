import type { Dataset } from './types';
import { SNAPSHOT } from './snapshot';
import { PUBLISHED_ID, fetchDataset } from './sheet';
import { datasetIsSound } from './types';

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

/**
 * Which fields each tab is behind, so an unreadable one can be filled from the
 * snapshot without discarding the eight that were read fine.
 *
 * Keep in step with assemble() in sheet.ts: a field added there and missed here
 * degrades to whatever assemble() produced from zero rows — an empty array or a
 * zero — rather than to its last known value.
 */
const RESTORE: Record<string, (live: Dataset, snap: Dataset) => void> = {
  meta: (l, s) => {
    l.lastUpdated = s.lastUpdated;
    l.periodStart = s.periodStart;
    l.periodEnd = s.periodEnd;
  },
  summary: (l, s) => {
    l.linkedin.startFollowers = s.linkedin.startFollowers;
    l.linkedin.endFollowers = s.linkedin.endFollowers;
    l.linkedin.growthPct = s.linkedin.growthPct;
    l.linkedin.totalImpressions = s.linkedin.totalImpressions;
    l.linkedin.totalEngagements = s.linkedin.totalEngagements;
    l.substack.startSubscribers = s.substack.startSubscribers;
    l.substack.endSubscribers = s.substack.endSubscribers;
    l.substack.growthPct = s.substack.growthPct;
    l.substack.totalTraffic = s.substack.totalTraffic;
    l.substack.surveyResponses = s.substack.surveyResponses;
    l.current = s.current;
  },
  li_followers: (l, s) => { l.linkedin.followers = s.linkedin.followers; },
  li_monthly: (l, s) => { l.linkedin.monthly = s.linkedin.monthly; },
  li_demographics: (l, s) => {
    l.linkedin.jobTitle = s.linkedin.jobTitle;
    l.linkedin.seniority = s.linkedin.seniority;
    l.linkedin.industry = s.linkedin.industry;
    l.linkedin.companySize = s.linkedin.companySize;
  },
  ss_subscribers: (l, s) => { l.substack.subscribers = s.substack.subscribers; },
  ss_traffic: (l, s) => { l.substack.traffic = s.substack.traffic; },
  ss_location: (l, s) => { l.substack.location = s.substack.location; },
  ss_demographics: (l, s) => {
    l.substack.jobTitle = s.substack.jobTitle;
    l.substack.seniority = s.substack.seniority;
    l.substack.industry = s.substack.industry;
    l.substack.companyType = s.substack.companyType;
  },
};

/**
 * The dataset for the page: the live sheet where it can be read, the snapshot
 * baked from that same sheet at build time everywhere it cannot.
 *
 * The fallback is per tab. Nine tabs are published and their gids have already
 * changed once, so losing one is the likely failure — a renamed tab, a gid
 * repointed by a re-upload. Falling back wholesale on that would swap eight
 * good tabs for build-time data and render a page that looks entirely normal,
 * which is the worst way to be wrong. One stale panel is both smaller and
 * easier to spot.
 *
 * A sheet that answers with columns that all parse to zero is still treated as
 * a total failure — datasetIsSound tests values, not row counts.
 */
export async function loadDataset(): Promise<Dataset> {
  if (!PUBLISHED_ID) return SNAPSHOT;
  try {
    const { data, failed } = await fetchDataset();
    failed.forEach((tab) => RESTORE[tab]?.(data, SNAPSHOT));
    if (failed.length) {
      console.warn(
        `[media-kit] Could not read: ${failed.join(', ')}. ` +
          'Showing the bundled snapshot for those, the live sheet for the rest.',
      );
    }
    if (!datasetIsSound(data)) throw new Error('sheet returned a zeroed series');
    return { ...data, lastUpdated: data.lastUpdated || SNAPSHOT.lastUpdated };
  } catch (err) {
    console.warn('[media-kit] Falling back to bundled snapshot:', err);
    return SNAPSHOT;
  }
}
