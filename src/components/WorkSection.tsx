import { Link } from 'react-router-dom';
import { asset } from '../lib/asset';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './PageTransition';

const works = [
  {
    title: 'The Decoding AI Magazine',
    description: 'Real-world guides. From PoC purgatory to shipping AI products that work.',
    image: asset('/media/home-page-a1710bff.webp'),
    to: '/aimagazine',
    cta: 'Find Out More',
    external: false,
  },
  {
    title: "LLM Engineer's Handbook",
    description: 'Master the art of engineering LLMs from concept to production.',
    image: asset('/media/llm-engineer-s-handbook-1-06b8cc0f.webp'),
    to: '/book',
    cta: 'Read More',
    external: false,
  },
  {
    title: 'Agent Engineering Course',
    description: 'From prompting models to engineering agents.',
    image: asset('/media/brown-nova-tools-workflow-afc26156.webp'),
    to: 'https://course.pauliusztin.ai',
    cta: 'Go to Course',
    external: true,
  },
];

export default function WorkSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">Writing. Teaching. Creating.</h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {works.map((work, idx) => {
            const inner = (
              <>
                <div className="aspect-[4/3] overflow-hidden bg-brand-black1">
                  <img
                    src={work.image}
                    alt={work.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col gap-3">
                  <h3 className="text-lg font-bold gradient-text">{work.title}</h3>
                  <p className="text-sm text-brand-grey leading-relaxed flex-1">{work.description}</p>
                  <div className="flex items-center gap-2 text-sm text-brand-red font-semibold pt-2">
                    {work.cta}
                    {work.external ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
                  </div>
                </div>
              </>
            );

            return (
              <ScrollReveal key={work.title} delay={idx * 120}>
                {work.external ? (
                  <a href={work.to} target="_blank" rel="noopener noreferrer" className="group card card-hover overflow-hidden flex flex-col h-full">
                    {inner}
                  </a>
                ) : (
                  <Link to={work.to} className="group card card-hover overflow-hidden flex flex-col h-full">
                    {inner}
                  </Link>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
