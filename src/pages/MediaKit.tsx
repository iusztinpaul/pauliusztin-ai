import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Dataset } from '../mediakit/data/types';
import { INITIAL_DATASET, loadDataset } from '../mediakit/data/load';
import { computeKpis, resolveView } from '../mediakit/data/view';
import { SITE } from '../mediakit/config';
import LinkedInSection from '../mediakit/components/LinkedInSection';
import CountUp from '../mediakit/components/CountUp';
import { ScrollReveal } from '../components/PageTransition';
import Eyebrow from '../components/Eyebrow';
import { LinkedInIcon } from '../components/BrandIcons';

// Only this section pulls in react-simple-maps and d3 (~55 kB gzipped), and
// LinkedIn is the default tab — so it is split out and fetched on demand,
// warmed by a hover on the tab so the switch still feels instant.
const loadSubstackSection = () => import('../mediakit/components/SubstackSection');
const SubstackSection = lazy(loadSubstackSection);

const compactStat = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1)}k`;
  return `${n}`;
};

export default function MediaKit() {
  const [dataset, setDataset] = useState<Dataset>(INITIAL_DATASET);
  const [platform, setPlatform] = useState('linkedin');
  const chartsRef = useRef<HTMLElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef(false);

  const changePlatform = (key: string) => {
    if (key === platform) return;
    pendingScrollRef.current = true;
    setPlatform(key);
  };

  // Bring the start of the graphs just below the sticky controls after a
  // platform switch. This runs AFTER the new section renders —
  // scrolling synchronously in the click handler breaks on mobile, where the
  // section's height change reflows the page mid-scroll and cancels the scroll.
  useEffect(() => {
    if (!pendingScrollRef.current) return;
    pendingScrollRef.current = false;
    const el = chartsRef.current;
    if (!el) return;
    const navH = window.matchMedia('(min-width: 768px)').matches ? 68 : 56;
    const controlsH = controlsRef.current?.offsetHeight ?? 0;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navH - controlsH - 12);
    window.scrollTo({ top, behavior: 'smooth' });
  }, [platform]);

  useEffect(() => {
    let alive = true;
    loadDataset().then((ds) => {
      if (!alive) return;
      // Swap only when the sheet actually differs from what is already on
      // screen, so the count-ups do not replay for identical numbers.
      setDataset((cur) => (JSON.stringify(ds) === JSON.stringify(cur) ? cur : ds));
    });
    return () => { alive = false; };
  }, []);

  const view = useMemo(() => resolveView(dataset), [dataset]);
  const kpis = useMemo(() => computeKpis(view), [view]);

  const li = view.data.linkedin;
  const ss = view.data.substack;
  // Deliberately unnumbered. The audience figure here would be the period-end
  // one, while every other CTA on the site quotes the present-day figure — two
  // correct numbers that read as a contradiction side by side.
  const perks = [
    'A senior, technical audience of AI & data engineers',
    'Placement across LinkedIn and Substack',
    'Millions of monthly impressions and views',
  ];
  const tabs = [
    { key: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon size={18} className="shrink-0" />, stat: view.hasLinkedIn ? `${compactStat(li.endFollowers)} followers` : 'No data yet' },
    { key: 'substack', name: 'The Decoding AI', icon: <img src={SITE.decodingLogo} alt="" className="w-6 h-6 shrink-0 object-contain" />, stat: view.hasSubstack ? `${compactStat(ss.endSubscribers)} subscribers` : 'No data yet' },
  ];

  return (
    <div className="pt-24">
      <section className="page-header">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">Media Kit</h1>
          <p className="text-xl text-white/80">Audience, growth &amp; reach across platforms.</p>
        </div>
      </section>

      {/* KPI hero */}
      <section className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-brand-grey mb-8">
            {view.label}{dataset.lastUpdated && ` · updated ${dataset.lastUpdated}`}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <ScrollReveal key={k.label} delay={i * 80}>
                <div className="card card-hover h-full p-5 text-center md:text-left">
                  <p className="text-3xl md:text-4xl font-extrabold gradient-text leading-none">
                    {k.raw !== undefined && k.format ? <CountUp value={k.raw} format={k.format} /> : k.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-brand-grey">{k.label}</p>
                  {k.sub && <p className="mt-0.5 text-xs text-brand-grey font-semibold">{k.sub}</p>}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Controls — platform */}
      <div ref={controlsRef} className="sticky top-[56px] md:top-[68px] z-30 bg-brand-black3 md:bg-brand-black3/90 md:backdrop-blur-md border-y border-brand-black1/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center sm:justify-start">
          <div className="flex gap-3">
            {tabs.map((t) => {
              const on = platform === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => changePlatform(t.key)}
                  onMouseEnter={t.key === 'substack' ? loadSubstackSection : undefined}
                  onFocus={t.key === 'substack' ? loadSubstackSection : undefined}
                  className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-colors ${on ? 'gradient-bg text-white border-transparent' : 'bg-brand-black2 border-brand-black1/50 text-brand-grey hover:text-brand-white hover:border-brand-black1'}`}
                >
                  {t.icon}
                  <span className="flex flex-col items-start leading-tight text-left">
                    <span className="text-[13px] font-semibold">{t.name}</span>
                    <span className={`text-[11px] font-normal whitespace-nowrap ${on ? 'text-white/80' : 'text-brand-black1'}`}>{t.stat}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Your charts — recharts sections, already on-brand */}
      <section ref={chartsRef} className="pb-8" key={platform}>
        <div>
          {platform === 'linkedin' ? (
            <LinkedInSection data={li} hasData={view.hasLinkedIn} period={view.label} />
          ) : (
            <Suspense
              fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-black1 border-t-brand-orange" />
                </div>
              }
            >
              <SubstackSection data={ss} hasData={view.hasSubstack} period={view.label} />
            </Suspense>
          )}
        </div>
      </section>

      {/* Sponsor CTA — matches the site CTA band */}
      <section className="py-16 md:py-24 relative overflow-hidden mt-8">
        <div className="absolute inset-0 bg-brand-black2" />
        <div className="absolute top-0 left-0 right-0 gradient-hairline opacity-70" />
        <div className="warm-glow" style={{ width: 420, height: 420, top: -120, left: '50%', transform: 'translateX(-50%)', opacity: 0.35 }} />
        <ScrollReveal className="relative max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-7">
          <Eyebrow center>Sponsorship</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-extrabold">Reach the People Building AI<span className="text-brand-red">.</span></h2>
          <p className="text-brand-grey text-lg leading-relaxed max-w-xl">Bring your product to a senior, technical audience of AI &amp; data engineers.</p>
          <ul className="flex flex-col gap-2 text-left max-w-md mx-auto">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-brand-grey">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full gradient-bg" />
                {perk}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn-primary px-8 py-3.5">
            Get in touch<ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
