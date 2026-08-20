// Brand palette (mirrors tailwind.config.js) + chart color helpers.

export const BRAND = {
  white: '#ffffff',
  grey: '#cdcfd3',
  black1: '#414042',
  black2: '#232527',
  black3: '#131314',
  red: '#d5342a',
  redCoral: '#ec7c67',
  orange: '#e58925',
  orangeSoft: '#f3aa66',
  yellow: '#f9cf32',
} as const;

const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
const rgbToHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Linear blend between two hex colors. t in [0,1]. */
export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

/**
 * Shade for the audience map. Log-scaled with a floor so the long tail of
 * small-count countries still reads as a visible warm tint (the map "lights
 * up" everywhere there are readers) while the top countries reach full red.
 */
export function valueShade(value: number, max: number): string {
  if (value <= 0 || max <= 0) return BRAND.black2;
  const t = Math.log(value + 1) / Math.log(max + 1); // compress the long tail
  const lit = 0.22 + 0.78 * t; // floor: even a single reader stays visible
  return mix('#3a201c', BRAND.red, Math.min(1, lit));
}
