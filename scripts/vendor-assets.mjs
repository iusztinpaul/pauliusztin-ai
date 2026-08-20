/**
 * Copies every Squarespace-hosted asset into public/assets/ and rewrites the
 * references to root-relative paths, so the build stops depending on the old
 * pauliusztin.ai Squarespace account staying subscribed.
 *
 * Bytes are copied verbatim — no resize, no re-encode — so the rendered result
 * is pixel-identical. The CDN ignores Accept and always returns one file per
 * URL, so what we download is exactly what a browser was getting.
 *
 * Idempotent: re-run it after adding new Squarespace URLs and it picks up only
 * the new ones. `node scripts/vendor-assets.mjs --check` verifies without writing.
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
// Deliberately not public/assets — that is Vite's own assetsDir, and a future
// bundle hash landing on an image name would silently clobber it.
const OUT_DIR = path.join(ROOT, 'public', 'media');
const PUBLIC_PREFIX = '/media';
const HOST_RE = /https:\/\/images\.squarespace-cdn\.com\/[^"'\s)]+/g;
const CHECK_ONLY = process.argv.includes('--check');

const EXT_BY_TYPE = {
  'image/webp': '.webp',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
};

/** Every source file that could hold an asset URL. */
async function sourceFiles() {
  const out = [path.join(ROOT, 'index.html')];
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(ts|tsx|css|html)$/.test(entry.name)) out.push(full);
    }
  };
  await walk(path.join(ROOT, 'src'));
  return out;
}

/**
 * Collision-safe local name. Several distinct assets share a basename
 * ("maxresdefault.jpg" appears 6 times), and ?format= variants of one image are
 * genuinely different files — so the URL hash, not the basename, is the identity.
 */
function localName(url, contentType) {
  const decoded = decodeURIComponent(url.split('?')[0]);
  const base = path.basename(decoded).replace(/\.[^.]+$/, '');
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'asset';
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 8);
  const ext = EXT_BY_TYPE[contentType] ?? '.bin';
  return `${slug}-${hash}${ext}`;
}

const files = await sourceFiles();
const contents = new Map();
const urls = new Set();
for (const file of files) {
  const text = await readFile(file, 'utf8');
  contents.set(file, text);
  for (const match of text.match(HOST_RE) ?? []) urls.add(match);
}

if (urls.size === 0) {
  console.log('[assets] no Squarespace URLs left — nothing to do');
  process.exit(0);
}
console.log(`[assets] ${urls.size} unique URLs across ${files.length} scanned files`);
if (CHECK_ONLY) {
  for (const u of [...urls].sort()) console.log(`  would vendor: ${u}`);
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });

const mapping = new Map();
const manifest = [];
let downloaded = 0;
let reused = 0;

for (const url of [...urls].sort()) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  const contentType = (res.headers.get('content-type') ?? '').split(';')[0].trim();
  if (!EXT_BY_TYPE[contentType]) throw new Error(`unexpected content-type "${contentType}" for ${url}`);

  const bytes = Buffer.from(await res.arrayBuffer());
  const name = localName(url, contentType);
  const dest = path.join(OUT_DIR, name);
  const sha = createHash('sha256').update(bytes).digest('hex');

  if (existsSync(dest) && createHash('sha256').update(await readFile(dest)).digest('hex') === sha) {
    reused++;
  } else {
    await writeFile(dest, bytes);
    downloaded++;
  }

  mapping.set(url, `${PUBLIC_PREFIX}/${name}`);
  manifest.push({ url, local: `${PUBLIC_PREFIX}/${name}`, contentType, bytes: bytes.length, sha256: sha });
}

// Longest URL first: one URL can be a prefix of another (…logo.png vs …logo.png?format=200w).
const ordered = [...mapping.keys()].sort((a, b) => b.length - a.length);
let rewritten = 0;
for (const [file, original] of contents) {
  let text = original;
  for (const url of ordered) text = text.split(url).join(mapping.get(url));
  if (text !== original) {
    // The favicon's type attribute must follow the bytes we actually saved.
    text = text.replace(
      new RegExp(`(<link rel="icon" type=")[^"]+(" href="${PUBLIC_PREFIX}/[^"]+\\.webp")`),
      '$1image/webp$2',
    );
    await writeFile(file, text);
    rewritten++;
  }
}

// Kept out of public/ so it is not deployed; it exists to verify the copy.
await writeFile(
  path.join(ROOT, 'scripts', 'assets-manifest.json'),
  JSON.stringify({ generatedFrom: 'images.squarespace-cdn.com', assets: manifest }, null, 2) + '\n',
);

const total = manifest.reduce((n, a) => n + a.bytes, 0);
console.log(`[assets] ${downloaded} downloaded, ${reused} already current`);
console.log(`[assets] rewrote ${rewritten} source files → ${PUBLIC_PREFIX}/`);
console.log(`[assets] ${(total / 1024 / 1024).toFixed(1)} MB in public/media/`);
