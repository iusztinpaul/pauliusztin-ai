import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { asset } from '../lib/asset';
import Eyebrow from './Eyebrow';
const logos = [
  { name: 'Opik', src: asset('/media/opik-1-c2209b18.webp') },
  { name: 'Superlinked', src: asset('/media/superlinked-cc1bc032.webp') },
  { name: 'Comet', src: asset('/media/comet-3-87d7152d.webp') },
  { name: 'Unsloth', src: asset('/media/unsloth-14fce7b1.webp') },
  { name: 'Groq', src: asset('/media/groq3-fce4ac23.webp') },
  { name: 'The Neural Maze', src: asset('/media/neural-maze3-506a7440.webp') },
  { name: 'MongoDB', src: asset('/media/mongodb-7c037bd9.webp') },
  { name: 'ZenML', src: asset('/media/zenml-dbfdbe79.webp') },
  { name: 'Hopsworks', src: asset('/media/hopswork3-713f137a.webp') },
  { name: 'Tecton', src: asset('/media/tecton4-dca6274e.webp') },
  { name: 'Qdrant', src: asset('/media/qdrant1-ebb10117.webp') },
  { name: 'Bytewax', src: asset('/media/bytewax2-443e4a37.webp') },
  { name: 'Snowflake', src: asset('/media/snowflake-09b1b29c.webp') },
  { name: 'Towards AI', src: asset('/media/towards-ai-wordmark-8e90f3ac.webp') },
  { name: 'Prefect', src: asset('/media/prefect-1-036981e7.webp') },
  { name: 'JetBrains', src: asset('/media/jetbrains-logo-e255e65c.webp') },
  { name: 'Bolt', src: asset('/bolt.png') },
];

export default function LogoBanner() {
  return (
    <section className="py-8 border-t border-b border-brand-black1/30">
      <div className="max-w-7xl mx-auto px-6 mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Eyebrow>Sponsors &amp; Partners</Eyebrow>
        {/* The interest arrives pre-selected so the form opens on the right
            chip. Deliberately not a mailto: the sponsorship path in Contact
            adds a cc, and duplicating that address here would drift the day it
            changes. */}
        <Link
          to="/contact?interest=Sponsorship"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-white transition-colors"
        >
          Contact for sponsorship
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* relative/overflow sit here rather than on the section so the edge
          fades mask the marquee alone and not the heading above it. */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-brand-black3 to-transparent z-10" />
        <div className="pointer-events-none absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-brand-black3 to-transparent z-10" />

        {/* Pause the marquee while hovering a logo (the row); it resumes on
            leave. Per-logo opacity does the light-up. */}
        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex-shrink-0 mx-5 flex items-center justify-center h-16 w-32 opacity-60 hover:opacity-100 transition-opacity"
            >
              <img
                src={logo.src.startsWith('http') ? `${logo.src}?format=300w` : logo.src}
                alt={logo.name}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
