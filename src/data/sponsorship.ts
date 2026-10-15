/**
 * The sponsorship packages on the Media Kit.
 *
 * Prices are "from" figures only; the full menu and terms go in the proposal,
 * so a figure here must never be higher than the lowest price we would quote.
 * Keep each package to the basics of what it includes — no post counts.
 */
export interface SponsorshipPackage {
  /** Carried to the contact form as ?package=, so keep it stable. */
  slug: string;
  name: string;
  description: string;
  from: string;
  /** Word before the price; defaults to "From". */
  fromLabel?: string;
  includes: string[];
  /** Highlighted card, with this as its badge. */
  badge?: string;
}

export const PACKAGES: SponsorshipPackage[] = [
  {
    slug: 'standalone-posts',
    name: 'Standalone Posts',
    description: 'Posts about your product.',
    from: '$10,000',
    // Single posts cost less, but they're sold as bundles.
    fromLabel: 'Packages from',
    includes: ['LinkedIn', 'X', 'YouTube'],
  },
  {
    slug: 'benchmarking',
    name: 'Benchmarking',
    description: 'Your product or model vs. its peers.',
    from: '$15,000',
    includes: ['YouTube', 'LinkedIn', 'Newsletter'],
  },
  {
    slug: 'project-build',
    name: 'Project Build',
    description: 'Your product in action in a real project.',
    from: '$25,000',
    includes: ['Open-source project', 'YouTube', 'LinkedIn', 'Newsletter', 'Category exclusivity'],
    badge: 'Flagship',
  },
];

/** Name for a ?package= slug, or undefined when it isn't one of ours. */
export const packageName = (slug: string | null): string | undefined =>
  PACKAGES.find((p) => p.slug === slug)?.name;
