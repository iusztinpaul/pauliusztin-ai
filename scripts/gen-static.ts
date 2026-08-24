/**
 * Writes a real HTML file for every route, plus sitemap.xml and robots.txt.
 *
 * Runs after the build (npm postbuild), reading the route list from
 * src/routes.ts so there is one place that knows which pages exist.
 *
 * WHY FILES AND NOT _redirects. The obvious approach is a _redirects rule per
 * route rewriting to /index.html with status 200. It does not work on
 * Cloudflare Pages: it canonicalises /index.html to /, and that surfaces as a
 * 308 redirect, so every route bounced to the home page. Writing
 * dist/about/index.html instead means /about is simply a file that exists —
 * served 200, no rule, no redirect, nothing to canonicalise.
 *
 * It also keeps the deletion of the old Squarespace URLs working. Cloudflare
 * serves 404.html for any path with no matching file, so /events-library/* and
 * /courses-library/* get a genuine 404 rather than being kept alive as blank
 * 200s by a catch-all.
 *
 * Each file is a copy of index.html today, so every page still shares one
 * title and description. Now that they are separate files, per-page metadata
 * is a matter of editing each copy rather than a rebuild of the approach.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, SITE_ORIGIN } from '../src/routes.ts';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const shell = readFileSync(join(DIST, 'index.html'), 'utf8');
const today = new Date().toISOString().slice(0, 10);

const pages = ROUTES.filter((r) => r.path !== '/'); // '/' is dist/index.html already
for (const { path } of pages) {
  const dir = join(DIST, path.replace(/^\//, ''));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), shell);
}

const urls = ROUTES.map(
  (r) =>
    `  <url>\n    <loc>${SITE_ORIGIN}${r.path}</loc>\n` +
    `    <lastmod>${today}</lastmod>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
).join('\n');
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
);

console.log(`[static] ${pages.length} route files + sitemap.xml + robots.txt`);
