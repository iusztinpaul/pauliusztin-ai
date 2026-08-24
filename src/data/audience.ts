import { useEffect, useState } from 'react';
import { fetchTab, metrics } from '../mediakit/data/sheet';
import { AUDIENCE } from './audienceStats';

/**
 * The audience figures quoted in copy across the site — hero, navbar, CTAs.
 *
 * They come from the same published sheet the Media Kit reads, fetched on load
 * rather than baked in at build time. Before this, the numbers were frozen into
 * audienceStats.ts by `npm run prebuild` and only moved when something
 * redeployed the site, which meant a weekly cron job existed purely to keep
 * "44k+" honest. Reading the sheet directly retires that job: edit the sheet
 * and the site agrees on the next page load.
 *
 * Google's published-CSV endpoint sends CORS headers, so the browser can read
 * it without a proxy — unlike the Substack feed, which needs functions/api.
 *
 * Only the `summary` tab is read here, not the Media Kit's nine. Two numbers on
 * every page must not cost what one chart-heavy page costs.
 */
export interface Audience {
  linkedin: number;
  substack: number;
  combined: number;
  /** "154k+" — for inline copy. */
  combinedLabel: string;
  /** "44k+" — compact, for the navbar button. */
  substackLabel: string;
}

/** 154_546 -> "154k+", matching how the Media Kit KPIs round. */
const plusK = (n: number) => (n >= 1000 ? `${Math.floor(n / 1000)}k+` : String(n));

const shape = (linkedin: number, substack: number): Audience => ({
  linkedin,
  substack,
  combined: linkedin + substack,
  combinedLabel: plusK(linkedin + substack),
  substackLabel: plusK(substack),
});

/** Built at the last deploy. Rendered immediately, and kept if the sheet fails. */
export const BAKED: Audience = AUDIENCE;

const TIMEOUT_MS = 4000;

async function fetchLive(): Promise<Audience> {
  const m = metrics(await fetchTab('summary'));
  const linkedin = m.li_current_followers;
  const substack = m.ss_current_subscribers;
  // Guard on the values, not just on the request: a reachable sheet with an
  // emptied column would otherwise render "0k+" over a perfectly good snapshot.
  if (!linkedin || !substack) throw new Error('summary tab has no current audience');
  return shape(linkedin, substack);
}

/**
 * One request per page load however many components ask. Navbar, hero and the
 * CTA all want these numbers; without the shared promise they would each open
 * their own connection for the same eight-cell CSV.
 */
let inflight: Promise<Audience> | null = null;
export function loadAudience(): Promise<Audience> {
  inflight ??= Promise.race([
    fetchLive(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timed out')), TIMEOUT_MS),
    ),
  ]).catch(() => BAKED);
  return inflight;
}

/**
 * Renders the baked figures first, then swaps in the sheet's. The two are
 * normally identical, so there is nothing to see; when the sheet has moved on,
 * the label ticks up once, early, rather than the page sitting empty until the
 * network answers.
 */
export function useAudience(): Audience {
  const [audience, setAudience] = useState<Audience>(BAKED);

  useEffect(() => {
    let alive = true;
    loadAudience().then((live) => {
      if (alive) setAudience(live);
    });
    return () => {
      alive = false;
    };
  }, []);

  return audience;
}
