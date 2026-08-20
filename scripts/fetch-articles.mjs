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
const UA = { 'User-Agent': 'pauliusztin.ai build script' };
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
  const res = await fetch('https://www.decodingai.com/feed', { headers: UA });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
  const res = await fetch(`https://www.decodingai.com/api/v1/archive?sort=top&limit=${COUNT}`, { headers: UA });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
