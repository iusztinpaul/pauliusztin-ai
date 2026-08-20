import { latestArticles } from './latestArticles';
import { topArticles } from './topArticles';

export interface Article {
  title: string;
  description: string;
  image: string;
  link: string;
}

export type ArticleMode = 'latest' | 'top';

export const ARTICLE_MODES: { key: ArticleMode; label: string }[] = [
  { key: 'latest', label: 'Latest' },
  { key: 'top', label: 'Top' },
];

/**
 * Most-popular posts, baked from the Substack archive (sort=top) at build time
 * (scripts/fetch-articles.mjs). Acts as the fallback once live.
 */
export const TOP_ARTICLES: Article[] = topArticles;

/**
 * Newest posts, baked from the Substack feed at build time
 * (scripts/fetch-articles.mjs). Acts as the fallback once live.
 */
export const LATEST_ARTICLES: Article[] = latestArticles;

/** Where the live loader reads from. Unset → snapshots only, no network call. */
const ENDPOINT = import.meta.env.VITE_ARTICLES_ENDPOINT;
const TIMEOUT_MS = 4000;

/** A response is only worth rendering if every entry is actually usable. */
function isArticleList(value: unknown): value is Article[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (a) =>
        a && typeof a.title === 'string' && a.title !== '' &&
        typeof a.link === 'string' && a.link !== '' &&
        typeof a.description === 'string' &&
        typeof a.image === 'string',
    )
  );
}

/**
 * Articles for a mode: the live feed when VITE_ARTICLES_ENDPOINT is configured,
 * otherwise the snapshot baked at build time by scripts/fetch-articles.mjs.
 *
 * Substack sends no CORS headers on /feed or /api/v1/archive, so the browser
 * cannot read them directly — the endpoint is a small server-side proxy (see
 * functions/articles.ts). Every failure path falls back to the snapshot, and
 * the page renders that snapshot before this resolves, so a slow or broken
 * endpoint is invisible rather than an empty panel.
 */
export async function getArticles(mode: ArticleMode): Promise<Article[]> {
  const snapshot = mode === 'top' ? TOP_ARTICLES : LATEST_ARTICLES;
  if (!ENDPOINT) return snapshot;

  try {
    const res = await fetch(`${ENDPOINT}?mode=${mode}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown = await res.json();
    return isArticleList(data) ? data : snapshot;
  } catch {
    return snapshot;
  }
}
