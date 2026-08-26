// Bakes the newest AND most-popular Decoding AI Substack posts into
// src/data/latestArticles.ts and src/data/topArticles.ts, read by the AI
// Magazine "From the Magazine" Latest|Top toggle. Runs at build time (npm
// prebuild) and on demand (npm run fetch:articles).
//
// Each feed is fetched independently and resiliently: on ANY failure it keeps
// the existing committed file, so the build never breaks and the last good
// snapshot stays as the fallback. This is the build-time half of the
// "snapshot now, live later" plan.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const COUNT = 3;

// Matches functions/api/articles.ts. Substack throttles by IP and treats
// automated-looking requests harshly; Cloudflare's build machines share egress
// addresses with everything else it runs, so the build hits the same 429 the
// edge does. A failure here is not fatal — the committed snapshot is kept — but
// it silently ships week-old posts as the fallback, so it is worth avoiding.
const UA = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
};
const RETRIES = 2;
const RETRY_DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Retry only what a retry can fix: 429 and 5xx are transient, 404 is an answer. */
async function fetchUpstream(url, accept) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { ...UA, Accept: accept } });
    if (res.ok) return res;
    if (attempt >= RETRIES || (res.status !== 429 && res.status < 500)) {
      throw new Error(`HTTP ${res.status}`);
    }
    await sleep(RETRY_DELAY_MS * (attempt + 1));
  }
}
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');

const decode = (s) =>
  (s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') // unwrap CDATA
    .replace(/<[^>]+>/g, '') // strip HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();

function writeData(file, varName, items) {
  const body =
    '// AUTO-GENERATED from the Decoding AI Substack by scripts/fetch-articles.mjs.\n' +
    '// Do not edit by hand — runs on build (prebuild) or `npm run fetch:articles`.\n' +
    `export const ${varName} = ${JSON.stringify(items, null, 2)};\n`;
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(join(DATA_DIR, file), body);
}

// Latest — newest posts, from the standard, stable RSS feed.
async function fetchLatest() {
  const between = (block, name) => {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
    return m ? m[1] : '';
  };
  const res = await fetchUpstream(
    'https://www.decodingai.com/feed',
    'application/rss+xml, application/xml, text/xml',
  );
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, COUNT).map((m) => {
    const block = m[1];
    const enclosure = block.match(/<enclosure[^>]*url="([^"]+)"/);
    return {
      title: decode(between(block, 'title')),
      description: decode(between(block, 'description')),
      image: enclosure ? enclosure[1] : '',
      link: decode(between(block, 'link')),
    };
  });
  if (!items.length || !items[0].title || !items[0].link) throw new Error('no items parsed');
  writeData('latestArticles.ts', 'latestArticles', items);
  return items.length;
}

// Top — most-popular posts, from the archive API (sort=top).
async function fetchTop() {
  const res = await fetchUpstream(
    `https://www.decodingai.com/api/v1/archive?sort=top&limit=${COUNT}`,
    'application/json',
  );
  const posts = await res.json();
  const items = (Array.isArray(posts) ? posts : []).slice(0, COUNT).map((p) => ({
    title: decode(p.title),
    description: decode(p.subtitle || p.search_engine_description || ''),
    image: p.cover_image || '',
    link: p.canonical_url || `https://www.decodingai.com/p/${p.slug}`,
  }));
  if (!items.length || !items[0].title || !items[0].link) throw new Error('no posts parsed');
  writeData('topArticles.ts', 'topArticles', items);
  return items.length;
}

for (const [label, fn] of [['latest', fetchLatest], ['top', fetchTop]]) {
  try {
    const n = await fn();
    console.log(`[articles] baked ${n} ${label} posts from Substack`);
  } catch (err) {
    console.warn(`[articles] could not refresh ${label} posts (${err.message}); keeping existing snapshot`);
  }
}
