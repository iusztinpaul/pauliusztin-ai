/**
 * Bakes src/mediakit/data/snapshot.ts from the published Media Kit sheet.
 *
 * This is the fallback the page renders when the live sheet cannot be read —
 * an outage, a tab whose gid changed, or a visitor behind a firewall blocking
 * docs.google.com. Baking it on every build keeps that fallback current as of
 * the last deploy instead of whenever someone last hand-edited it.
 *
 * It imports the same sheet.ts the browser uses, so the tab list, gids, CSV
 * parsing and assembly are defined once. A schema change cannot desync the two.
 *
 * Resilient by design: on ANY failure it leaves the committed snapshot alone
 * and exits 0, so a Google outage can never break a deploy.
 *
 *   npm run fetch:mediakit      (also runs via prebuild)
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchDataset } from '../src/mediakit/data/sheet.ts';
import { datasetIsSound } from '../src/mediakit/data/types.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'mediakit', 'data', 'snapshot.ts');
const STATS_OUT = join(ROOT, 'src', 'data', 'audienceStats.ts');

/** 154_546 -> "154k+", matching how the Media Kit KPIs round. */
const plusK = (n: number) => (n >= 1000 ? `${Math.floor(n / 1000)}k+` : String(n));

try {
  const { data: dataset, failed } = await fetchDataset();
  // The page can serve a partial read by patching the gaps from the snapshot.
  // Baking one cannot: it would write those patched-in values back as the new
  // snapshot, quietly promoting stale data to the fallback everything else
  // depends on. Better to keep the committed one and say why.
  if (failed.length) {
    throw new Error(`unreadable tab(s): ${failed.join(', ')}`);
  }
  if (!datasetIsSound(dataset)) {
    const zeroed = [
      dataset.linkedin.followers.some((p) => p.added > 0) ? null : 'linkedin',
      dataset.substack.subscribers.some((p) => p.added > 0) ? null : 'substack',
    ].filter(Boolean);
    throw new Error(`zeroed series: ${zeroed.join(', ')}`);
  }

  const body =
    "// AUTO-GENERATED from the published Media Kit sheet by scripts/fetch-mediakit.ts.\n" +
    "// Do not edit by hand — runs on build (prebuild) or `npm run fetch:mediakit`.\n" +
    "//\n" +
    "// This is the fallback rendered when the live sheet cannot be read; the page\n" +
    "// normally fetches the sheet itself on every load (see load.ts).\n" +
    "import type { Dataset } from './types';\n\n" +
    `export const SNAPSHOT: Dataset = ${JSON.stringify(dataset, null, 2)};\n`;

  writeFileSync(OUT, body);

  // Headline audience figures quoted across the site (hero, navbar, CTAs).
  // Generated so they track the sheet instead of drifting as hand-typed strings.
  //
  // These are the sheet's *present-day* figures, not the media kit's period-end
  // ones: "join 44k+ subscribers" is a claim about today, and the two diverge
  // as soon as the window closes.
  const { linkedin, substack } = dataset.current;
  const combined = linkedin + substack;
  writeFileSync(
    STATS_OUT,
    "// AUTO-GENERATED from the published Media Kit sheet by scripts/fetch-mediakit.ts.\n" +
      "// Do not edit by hand — runs on build (prebuild) or `npm run fetch:mediakit`.\n" +
      "// The audience figures quoted in copy across the site.\n" +
      "export const AUDIENCE = {\n" +
      `  /** Latest LinkedIn followers, e.g. ${linkedin.toLocaleString('en-US')}. */\n` +
      `  linkedin: ${linkedin},\n` +
      `  /** Latest Substack subscribers. */\n` +
      `  substack: ${substack},\n` +
      `  /** Both platforms combined. */\n` +
      `  combined: ${combined},\n` +
      `  /** "${plusK(combined)}" — for inline copy. */\n` +
      `  combinedLabel: '${plusK(combined)}',\n` +
      `  /** "${plusK(substack)}" — compact, for the navbar button. */\n` +
      `  substackLabel: '${plusK(substack)}',\n` +
      "} as const;\n",
  );

  const loc = dataset.substack.location.length;
  console.log(`[media-kit] baked snapshot: ${dataset.periodStart} → ${dataset.periodEnd}, ${loc} countries, updated ${dataset.lastUpdated}`);
  console.log(`[media-kit] baked audience stats: ${plusK(combined)} combined (LI ${linkedin.toLocaleString('en-US')} + SS ${substack.toLocaleString('en-US')})`);
} catch (err) {
  console.warn(`[media-kit] could not refresh the snapshot (${(err as Error).message}); keeping the committed one`);
}
