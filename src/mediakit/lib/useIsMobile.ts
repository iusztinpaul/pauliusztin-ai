import { useEffect, useState } from 'react';

/**
 * True below the app's desktop breakpoint (768px). Recharts tick counts and
 * font sizes are props rather than CSS, so charts read this to thin/shrink
 * their labels on phones without touching the desktop layout.
 */
export function useIsMobile(query = '(max-width: 767px)'): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}
