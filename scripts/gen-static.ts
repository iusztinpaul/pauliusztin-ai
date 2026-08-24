/**
 * Writes a real HTML file for every route, each with its own title,
 * description and canonical URL, plus sitemap.xml and robots.txt.
 *
 * Runs after the build (npm postbuild), reading the route list from
 * src/routes.ts so there is one place that knows which pages exist.
 *
 * WHY FILES AND NOT _redirects. The obvious approach is a _redirects rule per
 * route rewriting to /index.html with status 200. It does not work on
 * Cloudflare Pages: it canonicalises /index.html to /, and that surfaces as a
 * 308 redirect, so every route bounced to the home page. Writing a file per
 * route instead means /about is simply a file that exists — served 200, no
 * rule, no redirect, nothing to canonicalise.
 *
 * WHY about.html AND NOT about/index.html. Cloudflare Pages picks a URL's
 * canonical form from the file layout, and always redirects the other form to
 * it. A directory index makes /about/ canonical, so /about 308s to it; a flat
 * file makes /about canonical, so /about/ 308s to it instead. The second is
 * the one we advertise — in the nav, in sitemap.xml and in the canonical tags
 * below — so it is the one that should answer without a redirect.
 *
 * It also keeps the deletion of the old Squarespace URLs working. Cloudflare
 * serves 404.html for any path with no matching file, so /events-library/* and
 * /courses-library/* get a genuine 404 rather than being kept alive as blank
 * 200s by a catch-all.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, SITE_ORIGIN } from '../src/routes.ts';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const today = new Date().toISOString().slice(0, 10);

/** Escape for an HTML text node or a double-quoted attribute. Titles carry &. */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Substitute once, or fail the build. Vite owns index.html's final shape, so a
 * pattern here could stop matching after an unrelated change — and the failure
 * mode is silent: every page ships with the shell's metadata and looks fine
 * until you notice months of search results all say the same thing.
 */
function sub(html: string, pattern: RegExp, replacement: string, what: string): string {
  if (!pattern.test(html)) throw new Error(`gen-static: no ${what} in index.html to replace`);
  return html.replace(pattern, replacement);
}

// Read before writing: the loop overwrites dist/index.html with the home page's
// own metadata, and dropping any canonical keeps a second run idempotent.
const shell = readFileSync(join(DIST, 'index.html'), 'utf8').replace(
  /\n?\s*<link rel="canonical"[^>]*>/g,
  '',
);

for (const { path, title, description } of ROUTES) {
  let html = sub(shell, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, 'title');
  html = sub(
    html,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(description)}" />\n` +
      `    <link rel="canonical" href="${SITE_ORIGIN}${path}" />`,
    'description',
  );
  // '/' is dist/index.html; every other route is a flat file beside it.
  writeFileSync(join(DIST, path === '/' ? 'index.html' : `${path.slice(1)}.html`), html);
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

console.log(`[static] ${ROUTES.length} pages with own metadata + sitemap.xml + robots.txt`);
