import { asset } from './asset';

/**
 * The Decoding AI mark. Drawn on the home page's closing CTA, the about page's
 * magazine band, twice on the magazine page, and twice inside the media kit.
 *
 * One file, not one per call site. It used to be four — a 300px, a 500px and
 * two byte-identical 2459px copies — so the magazine page spent 360kB drawing
 * the same mark at 128px and 48px, and no two pages could share a cache entry.
 * Nothing on the site renders it above 128 CSS pixels, which a 512px file
 * covers even on a 4x display, and the whole set collapses to 22kB.
 *
 * Lossless on purpose: the mark is flat, high-contrast line art on a
 * transparent ground. That is where lossy WebP rings visibly along the edges,
 * and at this size it is the larger of the two encodings anyway.
 */
export const DECODING_AI_LOGO = asset('/media/logo-final-02-d508b7da.webp');
