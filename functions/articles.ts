/**
 * Serves the Decoding AI "Latest" and "Top" posts to the browser.
 *
 * This exists purely because Substack sends no Access-Control-Allow-Origin on
 * /feed or /api/v1/archive, so the page cannot read them directly. The parsing
 * mirrors scripts/fetch-articles.mjs, which bakes the same shapes at build time
 * as the fallback — keep the two in step if a feed shape changes.
 *
 * Written against the Web-standard fetch handler so it runs unmodified on
 * Cloudflare Workers, Deno Deploy, Netlify Edge and Vercel Edge. Per host:
 *   Cloudflare Pages  functions/articles.ts  → export const onRequest = ({ request }) => handler(request)
 *   Vercel            api/articles.ts        → export const config = { runtime: 'edge' }; export default handler
 *   Netlify Edge      netlify/edge-functions/articles.ts → export default handler
 *   Deno Deploy       Deno.serve(handler)
 *
 * Then set VITE_ARTICLES_ENDPOINT to its URL (e.g. /api/articles) and rebuild.
 * Leave it unset and the site keeps serving the build-time snapshots.
 */

const COUNT = 3;
const UA = { 'User-Agent': 'pauliusztin.ai articles proxy' };
const PUBLICATION = 'https://www.decodingai.com';

/** Cache at the edge: the feed changes weekly, so a browser hit need not be a Substack hit. */
const CACHE_SECONDS = 900;

interface Article {
  title: string;
  description: string;
  image: string;
  link: string;
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

/** Newest posts, from the standard RSS feed. */
async function fetchLatest(): Promise<Article[]> {
  const between = (block: string, name: string): string => {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
    return m ? m[1] : '';
  };
  const res = await fetch(`${PUBLICATION}/feed`, { headers: UA });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
  const res = await fetch(`${PUBLICATION}/api/v1/archive?sort=top&limit=${COUNT}`, { headers: UA });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const posts = await res.json();
  return (Array.isArray(posts) ? posts : []).slice(0, COUNT).map((p) => ({
    title: decode(p.title),
    description: decode(p.subtitle || p.search_engine_description || ''),
    image: p.cover_image || '',
    link: p.canonical_url || `${PUBLICATION}/p/${p.slug}`,
  }));
}

export default async function handler(request: Request): Promise<Response> {
  const mode = new URL(request.url).searchParams.get('mode') === 'top' ? 'top' : 'latest';

  try {
    const items = mode === 'top' ? await fetchTop() : await fetchLatest();
    if (!items.length || !items[0].title || !items[0].link) throw new Error('no items parsed');
    return Response.json(items, {
      headers: {
        'Cache-Control': `public, max-age=300, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
      },
    });
  } catch (err) {
    // 502 rather than an empty list: the client keeps its baked snapshot on a
    // non-OK response, which is the correct outcome — an empty 200 would wipe
    // the panel.
    return Response.json(
      { error: `could not read ${mode} posts: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
