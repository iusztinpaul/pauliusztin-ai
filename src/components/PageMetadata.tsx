import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../routes';

/**
 * Keeps the tab title and description in step with client-side navigation.
 *
 * The build writes the right pair into each route's HTML file, and that is what
 * crawlers read — they request a URL, take the response, and never click
 * anything. A visitor clicking through the site makes no further requests, so
 * without this the title stays whichever page they first landed on.
 *
 * Nothing here affects search results. It exists so the tab, the history entry
 * and a bookmark say the page you are actually on.
 */
const META = new Map<string, (typeof ROUTES)[number]>(ROUTES.map((r) => [r.path, r]));

export default function PageMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = META.get(pathname);
    if (!route) return;
    document.title = route.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', route.description);
  }, [pathname]);

  return null;
}
