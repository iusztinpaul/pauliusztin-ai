import { useEffect, useState } from 'react';
import { asset } from '../lib/asset';
import { ExternalLink } from 'lucide-react';
import LogoBanner from '../components/LogoBanner';
import Testimonials from '../components/Testimonials';
import { ScrollReveal } from '../components/PageTransition';
import Eyebrow from '../components/Eyebrow';
import SubscribeForm from '../components/SubscribeForm';
import { useAudience } from '../data/audience';
import {
  getArticles,
  ARTICLE_MODES,
  TOP_ARTICLES,
  LATEST_ARTICLES,
  type Article,
  type ArticleMode,
} from '../data/articles';

const DAI_LOGO =
  asset('/media/logo-final-02-d508b7da.webp');
const MAG_LOGO =
  asset('/media/logo-final-02-d91e8005.webp');

export default function AIMagazine() {
  const audience = useAudience();
  const [mode, setMode] = useState<ArticleMode>('latest');
  const [articles, setArticles] = useState<Article[]>(LATEST_ARTICLES);

  useEffect(() => {
    let active = true;
    // Show this mode's snapshot instantly (no flicker), then refresh via the
    // loader — which is build-time today and swappable to a live source later.
    setArticles(mode === 'top' ? TOP_ARTICLES : LATEST_ARTICLES);
    getArticles(mode).then((a) => {
      if (active) setArticles(a);
    });
    return () => {
      active = false;
    };
  }, [mode]);

  return (
    <div className="pt-24">
      <section className="page-header" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">The Decoding AI Magazine</h1>
          <img src={MAG_LOGO} alt="Decoding AI" className="w-32 h-32 object-contain drop-shadow-2xl mt-2" />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <ScrollReveal className="lg:col-span-3 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Eyebrow>Why I Started It</Eyebrow>
                <h2 className="text-3xl md:text-4xl lg:text-[1.6rem] xl:text-[1.75rem] lg:whitespace-nowrap font-extrabold leading-tight text-brand-white">Your weekly magazine on shipping AI products.</h2>
              </div>
              <div className="flex flex-col gap-6 text-lg text-brand-grey leading-relaxed">
                <p>I founded this magazine to solve the problem I faced for the first five years of my career: escaping the "PoC purgatory." Finding a team that knows how to ship AI software is rare. Too many AI projects get stuck at Jupyter notebooks or fancy demos that never see a real user.</p>
                <p>Decoding AI is the solution. It's your weekly hub for learning how to design, build, and ship production-grade AI systems, end-to-end, from data collection to deployment, monitoring, and evaluation.</p>
                <p className="text-brand-white font-medium">Stop building prototypes. Start shipping AI that works.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-2" delay={150}>
              <div className="card p-8 aspect-square flex flex-col items-center justify-center text-center gap-5 relative overflow-hidden">
                <div className="warm-glow" style={{ width: 220, height: 220, top: -50, left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }} />
                <div className="relative w-20 h-20 rounded-2xl gradient-bg p-[2px]">
                  <div className="w-full h-full rounded-[14px] bg-brand-black2 flex items-center justify-center">
                    <img src={DAI_LOGO} alt="Decoding AI" className="w-12 h-12 object-contain" />
                  </div>
                </div>
                <p className="relative text-brand-white text-lg font-semibold leading-relaxed">Real-world guides taking you from PoC purgatory to shipping AI products.</p>
                <div className="gradient-hairline opacity-40" style={{ width: '55%' }} />
                <p className="relative text-brand-grey text-sm leading-relaxed">Every Tuesday, one free actionable tip you can read in under 8 minutes.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-black2/40 border-y border-brand-black1/30">
        <div className="max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <h3 className="text-2xl md:text-3xl font-extrabold">Want to join us?</h3>
          <p className="text-brand-grey text-lg">Join {audience.substackLabel} engineers for content on designing, building, and shipping AI software. New issues every Tuesday.</p>
          <SubscribeForm />
        </div>
      </section>

      <LogoBanner />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center gap-6 mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold">From the Magazine</h2>
              <div className="inline-flex gap-1 p-1 rounded-full bg-brand-black2 border border-brand-black1/50">
                {ARTICLE_MODES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${mode === m.key ? 'bg-brand-white text-brand-black3' : 'text-brand-grey hover:text-brand-white'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((a, idx) => (
              <ScrollReveal key={`${mode}-${a.link}`} delay={idx * 120}>
                <a href={a.link} target="_blank" rel="noopener noreferrer" className="group card card-hover overflow-hidden flex flex-col h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-brand-black1">
                    <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-brand-white group-hover:text-brand-red transition-colors line-clamp-2 min-h-[2lh]">{a.title}</h3>
                    <p className="text-sm text-brand-grey leading-relaxed flex-1 line-clamp-3 min-h-[3lh]">{a.description}</p>
                    <div className="flex items-center gap-2 text-sm text-brand-red font-semibold pt-2">Read Article<ExternalLink size={14} /></div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="https://www.decodingai.com/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost-red px-7 py-3.5">Read More<ExternalLink size={14} /></a>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}
