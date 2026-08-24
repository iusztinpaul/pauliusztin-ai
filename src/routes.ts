/**
 * Every page on the site, in one place.
 *
 * Three things have to agree about which pages exist, and they used to be
 * separate lists: the router, the _redirects file that tells the host a URL is
 * real, and sitemap.xml. Miss one and a page still works when you click to it
 * but 404s when someone opens it directly — the exact failure that moving off
 * GitHub Pages was meant to end.
 *
 * App.tsx renders from this and scripts/gen-static.mjs generates the other two
 * from it at build time, so adding a page is one entry here. `as const` makes
 * that enforceable rather than a convention: PAGES in App.tsx is typed against
 * these exact paths, so a route without a component (or a component without a
 * route) fails the build instead of shipping.
 */
export const ROUTES = [
  { path: '/', priority: 1.0 },
  { path: '/about', priority: 0.8 },
  { path: '/aimagazine', priority: 0.9 },
  { path: '/book', priority: 0.8 },
  { path: '/courses', priority: 0.9 },
  { path: '/events', priority: 0.7 },
  { path: '/media-kit', priority: 0.6 },
  { path: '/contact', priority: 0.7 },
] as const;

export type RoutePath = (typeof ROUTES)[number]['path'];

/** Canonical origin — sitemap.xml and the absolute og: tags both read it. */
export const SITE_ORIGIN = 'https://www.pauliusztin.ai';
