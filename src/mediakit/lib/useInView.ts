import { useEffect, useRef, useState } from 'react';

/** Returns a ref + whether it has entered the viewport (fires once).
 *  Trigger params match the site's useScrollReveal so reveal motion is identical. */
export function useInView<T extends HTMLElement = HTMLDivElement>(rootMargin = '0px 0px -60px 0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
