import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FULL = 'Paul Iusztin.';
const SPLIT = 5; // "Paul " white, "Iusztin." gradient
const STEP_MS = 45; // typing cadence per character
/**
 * Upper bound on how long to wait for a quiet main thread before typing anyway.
 * Added to the FULL.length * STEP_MS the reveal itself takes, so a long wait
 * shows as a bare chevron sitting in the header. 600ms did exactly that.
 */
const START_TIMEOUT_MS = 150;

const mq = (query: string) =>
  typeof window !== 'undefined' && window.matchMedia?.(query).matches === true;

/**
 * Where the reveal is skipped and the name simply appears.
 *
 * Below Tailwind's `md`, i.e. phones, because there is no version of this that
 * reads well there. A cold mobile load has no spare main thread — React is
 * parsing, the homepage tree is rendering, the avatar is decoding — so frames
 * get dropped and the time-based catch-up dumps several characters at once.
 * Shortening it only changed how long the jerkiness lasted. Desktop keeps the
 * animation, where the thread is idle by the time it starts and it plays as
 * intended.
 */
const skipReveal = () => mq('(prefers-reduced-motion: reduce)') || mq('(max-width: 767px)');

/**
 * Name wordmark — gradient command-prompt chevron + "Paul Iusztin."
 * Pass `typing` to type the name out once on mount (header only).
 */
export default function Wordmark({ typing = false }: { typing?: boolean }) {
  // Computed lazily so a visitor who skips the reveal never renders the empty
  // frame that setting it in an effect would flash first.
  const [n, setN] = useState(() => (typing && !skipReveal() ? 0 : FULL.length));

  // Driven off the rAF clock rather than a timer: it is time-based, so a frame
  // lost to the initial render catches up on the next one instead of dragging
  // the whole reveal out. Idle scheduling still gets used when the thread does
  // go quiet, but START_TIMEOUT_MS caps how long that is worth waiting for.
  useEffect(() => {
    if (!typing || skipReveal()) return;
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
      ? window.requestIdleCallback(begin, { timeout: START_TIMEOUT_MS })
      : window.setTimeout(begin, START_TIMEOUT_MS);
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
      {/*
        The full name is always in the layout, hidden, holding the width; the
        typed characters are painted over it. Without that, every character
        widened the header — and Inter loads with font-display:swap, so on a
        phone it usually arrives mid-reveal and re-measures whatever has been
        typed so far. Reserving the space makes both of those invisible.
      */}
      <span className="wordmark__text">
        <span className="wordmark__ghost" aria-hidden>
          {FULL}
        </span>
        <span className="wordmark__typed">
          {shown.slice(0, SPLIT)}
          <span className="wordmark__ai">{shown.slice(SPLIT)}</span>
          {typing && !done && <span className="wordmark__caret" />}
        </span>
      </span>
    </Link>
  );
}
