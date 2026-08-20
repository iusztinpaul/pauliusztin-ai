import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FULL = 'Paul Iusztin.';
const SPLIT = 5; // "Paul " white, "Iusztin." gradient
const STEP_MS = 80; // typing cadence per character

/**
 * Name wordmark — gradient command-prompt chevron + "Paul Iusztin."
 * Pass `typing` to type the name out once on mount (header only).
 */
export default function Wordmark({ typing = false }: { typing?: boolean }) {
  const [n, setN] = useState(typing ? 0 : FULL.length);

  // The type-out runs on the main thread, so kicking it off while the homepage's
  // first paint is still hammering that thread is what makes it stutter (and only
  // there — every other page is light). So: wait for the thread to go idle, then
  // drive the reveal off the rAF clock (time-based, so a late frame catches up
  // instead of dragging). The prompt chevron shows while we wait, so the header
  // never looks empty; `timeout` guarantees it still starts promptly on light pages.
  useEffect(() => {
    if (!typing) return;
    let raf = 0;
    let start = 0;
    let shown = 0;
    let cancelled = false;
    const tick = (now: number) => {
      if (!start) start = now;
      const chars = Math.min(FULL.length, Math.floor((now - start) / STEP_MS));
      if (chars !== shown) {
        shown = chars;
        setN(chars);
      }
      if (chars < FULL.length) raf = requestAnimationFrame(tick);
    };
    const begin = () => {
      if (!cancelled) raf = requestAnimationFrame(tick);
    };
    const supportsIdle = typeof window.requestIdleCallback === 'function';
    const handle: number = supportsIdle
      ? window.requestIdleCallback(begin, { timeout: 600 })
      : window.setTimeout(begin, 150);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (supportsIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, [typing]);

  const shown = FULL.slice(0, n);
  const done = n >= FULL.length;

  return (
    <Link to="/" className="wordmark group" aria-label="Home">
      <svg
        className="wordmark__mark"
        width="18"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#wmGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <defs>
          <linearGradient id="wmGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d5342a" />
            <stop offset="1" stopColor="#e58925" />
          </linearGradient>
        </defs>
        <path d="m8 6 6 6-6 6" />
      </svg>
      <span className="leading-none whitespace-pre">
        {shown.slice(0, SPLIT)}
        <span className="wordmark__ai">{shown.slice(SPLIT)}</span>
        {typing && !done && <span className="wordmark__caret" />}
      </span>
    </Link>
  );
}
