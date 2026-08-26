/**
 * Serves the Decoding AI "Latest" and "Top" posts to the browser.
 *
 * This exists purely because Substack sends no Access-Control-Allow-Origin on
 * /feed or /api/v1/archive, so the page cannot read them directly. The parsing
 * mirrors scripts/fetch-articles.mjs, which bakes the same shapes at build time
 * as the fallback — keep the two in step if a feed shape changes.
 *
 * On Cloudflare Pages the path is the route: this file answers /api/articles,
 * which is where src/data/articles.ts looks by default. Set
 * VITE_ARTICLES_ENDPOINT to override it, or to empty to skip the call and serve
 * the build-time snapshots alone.
 *
 * SURVIVING SUBSTACK'S RATE LIMIT. Substack throttles by IP, and Cloudflare's
 * egress addresses are shared across its whole customer base, so a request that
 * always succeeds from a laptop intermittently comes back 429 from the edge —
 * observed on the first deploy, succeeding on the retry seconds later. Three
 * things blunt that, in increasing order of how much they actually matter:
 * a browser User-Agent, one retry, and keeping the last good response to serve
 * when both attempts fail. The last is the real fix: the feed changes weekly,
 * so a copy from an hour ago is not meaningfully staler than a live read.
 *
 * The handler itself is a Web-standard fetch function, so it also runs
 * unmodified elsewhere — Vercel Edge (`export default handler`), Netlify Edge,
 * Deno Deploy (`Deno.serve(handler)`). Only the adapter at the bottom is
 * Cloudflare-specific, and the caching degrades to "no cache" off Cloudflare
 * rather than failing.
 */

const COUNT = 3;
const PUBLICATION = 'https://www.decodingai.com';

/**
 * Substack serves the feed to browsers and throttles what looks automated. This
 * is a low-volume read of a public feed belonging to the site making the
 * request — at most four upstream hits an hour, given the caching below.
 */
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** One retry only: the client gives up at 4s, and a stale copy beats a slow one. */
const RETRIES = 1;
const RETRY_DELAY_MS = 600;

/** Cache at the edge: the feed changes weekly, so a browser hit need not be a Substack hit. */
const CACHE_SECONDS = 900;
/** How long a good response stays available to serve when Substack refuses. */
const KEEP_SECONDS = 86400;

interface Article {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface Ctx {
  waitUntil?(promise: Promise<unknown>): void;
}

const decode = (s: string): string =>
  (s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch, retrying only what a retry can fix. A 429 or a 5xx is Substack being
 * momentarily unwilling; a 404 is an answer, and repeating it just spends the
 * client's timeout budget.
 */
async function fetchUpstream(url: string, accept: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: accept } });
    if (res.ok) return res;
    if (attempt >= RETRIES || (res.status !== 429 && res.status < 500)) {
      throw new Error(`HTTP ${res.status}`);
    }
    await sleep(RETRY_DELAY_MS);
  }
}

/** Newest posts, from the standard RSS feed. */
async function fetchLatest(): Promise<Article[]> {
  const between = (block: string, name: string): string => {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
    return m ? m[1] : '';
  };
  const res = await fetchUpstream(`${PUBLICATION}/feed`, 'application/rss+xml, application/xml, text/xml');
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, COUNT).map((m) => {
    const block = m[1];
    const enclosure = block.match(/<enclosure[^>]*url="([^"]+)"/);
    return {
      title: decode(between(block, 'title')),
      description: decode(between(block, 'description')),
      image: enclosure ? enclosure[1] : '',
      link: decode(between(block, 'link')),
    };
  });
}

/** Most-popular posts. RSS is chronological only, so this needs the archive API. */
async function fetchTop(): Promise<Article[]> {
  const res = await fetchUpstream(
    `${PUBLICATION}/api/v1/archive?sort=top&limit=${COUNT}`,
    'application/json',
  );
  const posts = await res.json();
  return (Array.isArray(posts) ? posts : []).slice(0, COUNT).map((p) => ({
    title: decode(p.title),
    description: decode(p.subtitle || p.search_engine_description || ''),
    image: p.cover_image || '',
    link: p.canonical_url || `${PUBLICATION}/p/${p.slug}`,
  }));
}

/** Cloudflare's shared edge cache, or null anywhere that has no such thing. */
function edgeCache(): Cache | null {
  try {
    const c = (globalThis as { caches?: { default?: Cache } }).caches;
    return c?.default ?? null;
  } catch {
    return null;
  }
}

const json = (body: string, cacheControl: string, source: string) =>
  new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheControl,
      // Which path answered, so a 429 spell is visible from outside without
      // reading logs: `curl -sI .../api/articles | grep x-articles`.
      'X-Articles-Source': source,
    },
  });

async function handler(request: Request, ctx: Ctx = {}): Promise<Response> {
  const mode = new URL(request.url).searchParams.get('mode') === 'top' ? 'top' : 'latest';
  const cache = edgeCache();
  // Keyed off this origin rather than a synthetic host so the entry is scoped
  // to the deployment that wrote it — previews cannot poison production.
  const key = new Request(new URL(`/api/articles?mode=${mode}`, request.url).toString());

  try {
    const items = mode === 'top' ? await fetchTop() : await fetchLatest();
    if (!items.length || !items[0].title || !items[0].link) throw new Error('no items parsed');
    const body = JSON.stringify(items);

    if (cache) {
      const keep = json(body, `public, max-age=${KEEP_SECONDS}`, 'live');
      const write = cache.put(key, keep);
      // waitUntil lets the response leave before the write finishes; without it
      // (or off Cloudflare) the await simply costs a few milliseconds.
      if (ctx.waitUntil) ctx.waitUntil(write);
      else await write;
    }

    return json(
      body,
      `public, max-age=300, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
      'live',
    );
  } catch (err) {
    // Substack refused. The last good read is a better answer than an error:
    // the client would otherwise fall back to a snapshot baked at deploy time,
    // which is older than this.
    const last = await cache?.match(key);
    if (last) {
      return json(await last.text(), 'public, max-age=60', 'stale');
    }
    // 502 rather than an empty list: the client keeps its baked snapshot on a
    // non-OK response, which is the correct outcome — an empty 200 would wipe
    // the panel.
    return Response.json(
      { error: `could not read ${mode} posts: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}

/**
 * Cloudflare Pages entry point. Pages calls onRequest with a context object and
 * routes by file path, so this file — and only this name — is what makes
 * /api/articles exist. Typed inline rather than via @cloudflare/workers-types:
 * two properties are all this needs, and functions/ is outside tsconfig's `src`.
 */
export const onRequest = (context: {
  request: Request;
  waitUntil?(promise: Promise<unknown>): void;
}): Promise<Response> => handler(context.request, { waitUntil: context.waitUntil?.bind(context) });

export default handler;
