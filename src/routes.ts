/**
 * Every page on the site, in one place.
 *
 * Three things have to agree about which pages exist, and they used to be
 * separate lists: the router, the files the host serves, and sitemap.xml. Miss
 * one and a page still works when you click to it but 404s when someone opens
 * it directly — the exact failure that moving off GitHub Pages was meant to end.
 *
 * App.tsx renders from this and scripts/gen-static.ts generates the rest from
 * it at build time, so adding a page is one entry here. `as const` makes that
 * enforceable rather than a convention: PAGES in App.tsx is typed against these
 * exact paths, so a route without a component (or a component without a route)
 * fails the build instead of shipping.
 *
 * TITLE AND DESCRIPTION are what Google prints in a search result — the blue
 * link and the grey line under it. They live here rather than in the pages
 * because the build has to write them into the HTML it serves: a crawler reads
 * the file the server sends and never runs our JavaScript, so a title set by
 * React would be invisible to it. Budgets are ~60 characters for a title and
 * ~160 for a description; past that Google truncates mid-word.
 */
export const ROUTES = [
  {
    path: '/',
    priority: 1.0,
    title: 'Paul Iusztin | AI Engineer, Author & Educator',
    description:
      'I help engineers ship AI products, not demos. Courses, a book and weekly guides on designing, building and deploying production-grade AI systems.',
  },
  {
    path: '/about',
    priority: 0.8,
    title: 'About | Paul Iusztin',
    description:
      "Author of the LLM Engineer's Handbook, lead instructor of the Agent Engineering course, and founding AI engineer at a San Francisco start-up. My story.",
  },
  {
    path: '/aimagazine',
    priority: 0.9,
    title: 'Decoding AI Magazine | Paul Iusztin',
    description:
      'Real-world guides taking you from PoC purgatory to shipping AI products. Every Tuesday, one free actionable tip you can read in under 8 minutes.',
  },
  {
    path: '/book',
    priority: 0.8,
    title: "LLM Engineer's Handbook | Paul Iusztin",
    description:
      'A framework, not just code: principles for building end-to-end LLM and RAG systems.',
  },
  {
    path: '/courses',
    priority: 0.9,
    title: 'AI Engineering Courses | Paul Iusztin',
    description:
      'End-to-end courses on AI agents, RAG and LLM systems. Clean code, real datasets, production deployment.',
  },
  {
    path: '/events',
    priority: 0.7,
    title: 'Talks, Podcasts & Workshops | Paul Iusztin',
    description:
      'Conference talks, podcast episodes and workshops on AI engineering, agents and LLM systems.',
  },
  {
    path: '/media-kit',
    priority: 0.6,
    title: 'Media Kit | Paul Iusztin',
    description:
      'Audience, growth and reach across platforms. Put your product in front of a senior, technical audience of AI and data engineers.',
  },
  {
    path: '/contact',
    priority: 0.7,
    title: 'Contact | Paul Iusztin',
    description:
      "Working on something you'd like me to see? Get in touch about AI sponsorships, affiliate partnerships, or a guest post for Decoding AI Magazine.",
  },
] as const;

export type RoutePath = (typeof ROUTES)[number]['path'];

/**
 * Canonical origin — sitemap.xml, the canonical tags and the absolute og: tags
 * all read it. `www` is deliberate: the site answers on both, and the canonical
 * tag is what tells Google to bank all the credit on one of them.
 */
export const SITE_ORIGIN = 'https://www.pauliusztin.ai';
