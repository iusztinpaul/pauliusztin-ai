/**
 * The sponsorship packages on the Media Kit.
 *
 * These are the three formats actually sold, not a tier ladder invented for
 * the page: a standalone post, a dedicated build (the shape of the Inngest
 * coding-agent bake-off), and a slot in an open-source course series.
 *
 * Prices are "from" figures only. The full menu, bundles and terms go in the
 * proposal, so a figure here must never be higher than the lowest price we
 * would actually quote for that package.
 *
 * Proof lines quote measured results only. Leave `proof` out rather than fill
 * it with a projection.
 */
export interface SponsorshipPackage {
  /** Carried to the contact form as ?package=, so keep it stable. */
  slug: string;
  name: string;
  /** What the sponsor is buying, in one line. */
  goal: string;
  from: string;
  leadTime: string;
  includes: string[];
  proof?: string;
  /** Highlighted card, with this as its badge. */
  badge?: string;
}

export const PACKAGES: SponsorshipPackage[] = [
  {
    slug: 'standalone',
    name: 'Standalone Post',
    goal: 'Put your product in front of the audience, fast.',
    from: '$2,000',
    leadTime: 'Booked in weeks',
    includes: [
      'Primary placement in a Decoding AI issue',
      'Or a dedicated LinkedIn post, written by me',
      'Book both to reach readers on each platform',
    ],
    proof: '~17k views per standalone LinkedIn post',
  },
  {
    slug: 'dedicated-build',
    name: 'Dedicated Build',
    goal: 'Show engineers your product working in a real system.',
    from: '$21,000',
    leadTime: 'Scoped per build',
    includes: [
      'A public, open-source demo repo built with your product',
      'Two dedicated newsletter deep dives on the build',
      'Two LinkedIn posts walking through it',
      'A YouTube walkthrough of the code',
    ],
  },
  {
    slug: 'course-series',
    name: 'Course Series Sponsor',
    goal: 'Become the default tool for your layer of the AI stack.',
    from: '$27,000',
    leadTime: '~12-week course · book 2–3 months ahead',
    includes: [
      'Category exclusivity: no competing tool in your layer',
      'Your product built into a free, open-source course',
      '8 newsletter mentions and 4 LinkedIn posts',
      '4 YouTube integrations and 2 Reddit posts',
      'Credit and link in the course repo README',
      'Promote the wrap-up webinar to your community',
    ],
    proof: "Comet's 21-part series: 408k views, 29% open rate, 1,100+ sponsor clicks",
    badge: 'Flagship',
  },
];

/** Name for a ?package= slug, or undefined when it isn't one of ours. */
export const packageName = (slug: string | null): string | undefined =>
  PACKAGES.find((p) => p.slug === slug)?.name;
