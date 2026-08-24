import { useState, useEffect, useCallback } from 'react';
import { asset } from '../lib/asset';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './PageTransition';
import Eyebrow from './Eyebrow';

export interface Testimonial {
  name: string;
  quote: string;
  avatar?: string;
  role?: string;
}

const testimonials: Testimonial[] = [
  { name: 'Maxime Labonne', avatar: asset('/media/image-71aaad83.webp'), quote: "Working with Paul on the LLM Engineer's Handbook showed me his unique ability to bridge the gap between theoretical AI and modern AI Engineering best practices." },
  { name: 'Louis-Francois Bouchard', avatar: asset('/media/image-1-cf4811c9.webp'), quote: "Paul is one of the rare people who truly understands both the technical depth of AI and how to teach it in a way that's engaging and actually clicks." },
  { name: 'Maria Vechtomova', avatar: asset('/media/image-3-8d57f883.webp'), quote: "Paul doesn't just talk about AI - he builds it, and when he talks, it's worth listening." },
  { name: 'Eduardo Ordax', avatar: asset('/media/image-4-43e4dbb6.webp'), quote: "If you are serious about building with AI and leave the hype behind, Paul is one of those folks you should follow." },
  { name: 'Pau Labarta Bajo', avatar: asset('/media/image-5-68ba361e.webp'), quote: "If it's decodable, Paul will decode it for you." },
  { name: 'Miguel Otero Pedrido', avatar: asset('/media/image-6-c5273804.webp'), quote: "In a world where most just talk about AI, Paul actually builds it. A true AI engineer, who shows how to create AI systems that actually work." },
  { name: 'Hugo Bowne-Anderson', avatar: asset('/media/image-7-3bc46df6.webp'), quote: "Decoding AI is an invaluable resource for technical builders to stay up to date in such a rapidly moving space: bookmark it!" },
  { name: 'Shaw Talebi', avatar: asset('/media/image-8-3f2ec23b.webp'), quote: "I've learned a lot from Paul. He's my go-to guy when it comes to MLOps." },
];

const QUOTE_PATH =
  'M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z';

/** Unified testimonial card — `withAvatar` optional (Book passes false). */
export function TestimonialCard({ t, withAvatar }: { t: Testimonial; withAvatar?: boolean }) {
  return (
    <div className="card p-8 flex flex-col justify-between min-h-[19rem] h-full w-full">
      <div className="mb-6">
        <svg className="w-7 h-7 text-brand-red/40 mb-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d={QUOTE_PATH} />
        </svg>
        <p className="text-brand-grey leading-relaxed">"{t.quote}"</p>
      </div>
      <div className="pt-4 border-t border-brand-black1/30 flex items-center gap-3">
        {withAvatar && t.avatar && (
          <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" loading="lazy" />
        )}
        <div>
          <p className="text-brand-white font-semibold text-sm leading-tight">{t.name}</p>
          {t.role && <p className="text-brand-orange text-xs mt-0.5">{t.role}</p>}
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 3;
const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const advance = useCallback(() => setPage((p) => (p >= totalPages ? p : p + 1)), []);
  const prev = () => {
    setIsAutoPlaying(false);
    setPage((p) => ((p % totalPages) - 1 + totalPages) % totalPages);
  };
  const goNext = () => {
    setIsAutoPlaying(false);
    advance();
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(advance, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, advance]);

  useEffect(() => {
    if (page !== totalPages) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPage(0);
    }, 850);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    if (animate) return;
    const t = setTimeout(() => setAnimate(true), 60);
    return () => clearTimeout(t);
  }, [animate]);

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <Eyebrow>Peer Review</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold">What People Say</h2>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={prev} aria-label="Previous" className="w-10 h-10 rounded-full bg-brand-black2 border border-brand-black1/50 flex items-center justify-center text-brand-grey hover:text-brand-white hover:border-brand-red/50 transition-all">
                <ChevronLeft size={18} />
              </button>
              <button onClick={goNext} aria-label="Next" className="w-10 h-10 rounded-full bg-brand-black2 border border-brand-black1/50 flex items-center justify-center text-brand-grey hover:text-brand-white hover:border-brand-red/50 transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="overflow-hidden">
          <div
            className={`flex gap-6 ${animate ? 'transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : ''}`}
            style={{ transform: `translateX(calc(${-page} * (100% + 1.5rem)))` }}
          >
            {[...Array.from({ length: totalPages }, (_, i) => i), 0].map((pi, i) => (
              <div key={i} className="w-full flex-shrink-0" aria-hidden={i !== page}>
                <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:justify-center">
                  {testimonials.slice(pi * PAGE_SIZE, pi * PAGE_SIZE + PAGE_SIZE).map((t) => (
                    <div key={t.name} className="w-full md:w-[calc((100%_-_3rem)/3)] flex-shrink-0">
                      <TestimonialCard t={t} withAvatar />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setPage(i); setIsAutoPlaying(false); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === page % totalPages ? 'bg-brand-red w-6' : 'bg-brand-black1 w-2 hover:bg-brand-grey'
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
