const logos = [
  { name: 'Opik', src: '/media/opik-1-c2209b18.webp' },
  { name: 'Superlinked', src: '/media/superlinked-cc1bc032.webp' },
  { name: 'Comet', src: '/media/comet-3-87d7152d.webp' },
  { name: 'Unsloth', src: '/media/unsloth-14fce7b1.webp' },
  { name: 'Groq', src: '/media/groq3-fce4ac23.webp' },
  { name: 'The Neural Maze', src: '/media/neural-maze3-506a7440.webp' },
  { name: 'MongoDB', src: '/media/mongodb-7c037bd9.webp' },
  { name: 'ZenML', src: '/media/zenml-dbfdbe79.webp' },
  { name: 'Hopsworks', src: '/media/hopswork3-713f137a.webp' },
  { name: 'Tecton', src: '/media/tecton4-dca6274e.webp' },
  { name: 'Qdrant', src: '/media/qdrant1-ebb10117.webp' },
  { name: 'Bytewax', src: '/media/bytewax2-443e4a37.webp' },
  { name: 'Snowflake', src: '/media/snowflake-09b1b29c.webp' },
  { name: 'Towards AI', src: '/media/towards-ai-wordmark-8e90f3ac.webp' },
  { name: 'Prefect', src: '/media/prefect-1-036981e7.webp' },
  { name: 'JetBrains', src: '/media/jetbrains-logo-e255e65c.webp' },
  { name: 'Bolt', src: '/bolt.png' },
];

export default function LogoBanner() {
  return (
    <section className="relative py-8 border-t border-b border-brand-black1/30 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-brand-black3 to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-brand-black3 to-transparent z-10" />

      {/* Pause the marquee while hovering a logo (the row); it resumes on leave.
          Per-logo opacity does the light-up. */}
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
    </section>
  );
}
