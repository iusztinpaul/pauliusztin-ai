/**
 * Resolve a public/ asset against the deploy base.
 *
 * Vite's `base` rewrites asset URLs in index.html and in imported modules, but
 * NOT string literals in code — so a bare '/media/x.webp' resolves against the
 * domain root and 404s wherever the site is served from a subpath. Everything
 * under public/ is referenced by literal, hence this.
 *
 * Reading BASE_URL rather than hardcoding a prefix keeps the call sites correct
 * whichever base the site is built with, so moving between
 * iusztinpaul.github.io/pauliusztin-ai/ and a custom domain at the root is a
 * two-line change in vite.config.ts and App.tsx, not a sweep through the code.
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
