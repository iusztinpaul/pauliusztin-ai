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

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'mediakit', 'data', 'snapshot.ts');

try {
  const dataset = await fetchDataset();
  if (!dataset.years.length) throw new Error('sheet returned no years');

  const body =
    "// AUTO-GENERATED from the published Media Kit sheet by scripts/fetch-mediakit.ts.\n" +
    "// Do not edit by hand — runs on build (prebuild) or `npm run fetch:mediakit`.\n" +
    "//\n" +
    "// This is the fallback rendered when the live sheet cannot be read; the page\n" +
    "// normally fetches the sheet itself on every load (see load.ts).\n" +
    "import type { Dataset } from './types';\n\n" +
    `export const SNAPSHOT: Dataset = ${JSON.stringify(dataset, null, 2)};\n`;

  writeFileSync(OUT, body);

  const years = dataset.years.map((y) => y.year).join(', ');
  const loc = dataset.years.at(-1)?.substack.location.length ?? 0;
  console.log(`[media-kit] baked snapshot: years ${years}, ${loc} countries, updated ${dataset.lastUpdated}`);
} catch (err) {
  console.warn(`[media-kit] could not refresh the snapshot (${(err as Error).message}); keeping the committed one`);
}
