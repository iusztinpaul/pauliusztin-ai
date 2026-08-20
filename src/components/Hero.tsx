import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './PageTransition';
import Eyebrow from './Eyebrow';

// Squarespace serves this at 2041px; cap it to ~1000px (covers the 416px @2x
// display) so the hero isn't decoding a 2 MP image on every mobile load.
const AVATAR =
  '/media/professional-avatar-image-full-edited-2-47269356.webp';

const stats = [
  { value: '129k+', label: 'Audience' },
  { value: '#1', label: 'Bestselling author' },
  { value: '10+ yrs', label: 'Shipping AI' },
  { value: '20+', label: 'Apps shipped' },
];

function Portrait() {
  return (
    <div className="relative">
      <div className="warm-glow" style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }} />
      <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-[1.6rem] p-[3px] gradient-bg shadow-2xl shadow-black/50">
        <img src={AVATAR} alt="Paul Iusztin" decoding="async" className="w-full h-full object-cover rounded-[1.45rem]" />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative pt-36 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <ScrollReveal className="lg:col-span-2 flex justify-center">
            <Portrait />
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-3 flex flex-col gap-6" delay={150}>
            <Eyebrow>AI Engineer · Author · Educator</Eyebrow>
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.02]">
                Hi, I'm Paul<span className="text-brand-red">.</span>
              </h1>
              <h3 className="text-xl font-semibold text-brand-grey">I help engineers ship AI products.</h3>
            </div>
            <p className="text-base md:text-lg text-brand-grey leading-relaxed max-w-xl">
              Bestselling author of the <span className="text-brand-white font-medium">LLM Engineer's Handbook</span>, lead instructor of the Agentic AI Engineering course, and founding AI engineer at a San Francisco start-up. I teach AI engineering <span className="text-brand-white font-medium">end-to-end</span>, from idea to production.
            </p>
            <div className="flex flex-nowrap gap-2 pt-1 sm:gap-3">
              <a href="https://www.decodingai.com/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost-red px-4 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base">
                Read the Magazine
                <ArrowRight size={16} className="shrink-0" />
              </a>
              <Link to="/about" className="btn btn-ghost px-4 py-3 text-sm sm:px-6">More About Me</Link>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={250} className="mt-14">
          <div className="gradient-hairline opacity-50 mb-8" />
          <div className="grid grid-cols-4 gap-x-2 gap-y-8 sm:gap-x-0">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold gradient-text leading-none">{s.value}</div>
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-brand-grey mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
