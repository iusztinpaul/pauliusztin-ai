import { asset } from '../lib/asset';
import { ExternalLink, BookOpen, Star, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../components/PageTransition';
import Eyebrow from '../components/Eyebrow';
import { TestimonialCard } from '../components/Testimonials';

const BOOK_COVER = asset('/Handbook.webp');
const BOOK_BANNER =
  asset('/media/book-page-amazon-best-seller-banner-7-010de00f.webp');

const bookTestimonials = [
  { name: 'Akshit Bhalla', role: 'Product Data Scientist at Tesla', quote: "Exploring large language models (LLMs) and retrieval augmented generation (RAG)? I recently got my hands on LLM Engineer's Handbook by Paul Iusztin and Maxime Labonne, and I've been hooked ever since it arrived!" },
  { name: 'Maria Vechtomova', role: 'Databricks MVP', quote: "Without any doubt, this is one of the best practical books on LLMOps out there. It covers the LLM Twin use case and goes really deep into designing architecture." },
  { name: 'Gideon Mendels', role: 'Co-founder & CEO, CometML', quote: "The book provides an excellent framework for mastering LLM Engineering, bridging the gap between ML research, AI engineering and LLMOps." },
  { name: 'Hamza Tahir', role: 'Co-founder & CTO, ZenML', quote: "In an era where AI is reshaping industries at breakneck speed, LLM Engineer's Handbook stands out as an essential guide for navigating the complexities of large language models." },
];

const badges = [
  { icon: Star, label: '#1 Bestseller' },
  { icon: BookOpen, label: 'Packt' },
  { icon: Sparkles, label: 'With Maxime Labonne' },
];

export default function Book() {
  return (
    <div className="pt-24">
      <section className="page-header">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.05]">LLM Engineer's Handbook</h1>
        </div>
      </section>

      {/* Intro: cover + framework */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            <ScrollReveal className="lg:col-span-2 flex flex-col items-center gap-6">
              <a href="https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072/" target="_blank" rel="noopener noreferrer" className="group block relative">
                <div className="warm-glow" style={{ width: '100%', height: '100%', opacity: 0.25 }} />
                <img src={BOOK_COVER} alt="LLM Engineer's Handbook" className="relative w-full max-w-sm md:scale-110 group-hover:scale-[1.14] transition-transform duration-300" style={{ filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.55))' }} />
              </a>
              <div className="flex flex-wrap justify-center gap-2">
                {badges.map((b) => (
                  <span key={b.label} className="tag text-brand-grey border-brand-black1/60 bg-brand-black2">
                    <b.icon size={12} className="text-brand-orange" />
                    {b.label}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-3 flex flex-col gap-6" delay={150}>
              <Eyebrow>A framework, not just code</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[1.6rem] xl:text-[1.75rem] font-extrabold text-brand-white leading-tight">A framework for building LLM and RAG apps.</h2>
              <div className="space-y-4 text-base md:text-lg text-brand-grey leading-relaxed">
                <p>The lack of standardization makes building scalable, robust, accurate LLM solutions a real challenge. As an emerging field, you face an excess of algorithms, tools, and design principles, which can feel confusing and daunting.</p>
                <p>
                  <span className="text-brand-white font-medium">This book gives you a set of principles and a framework</span> for structuring your thinking about what it takes to build an end-to-end LLM system, flexible enough to adapt to your needs.
                </p>
                <p>
                  Throughout the book you'll build a production-ready MVP — an LLM Twin (your digital AI replica) — fully available in the{' '}
                  <a href="https://github.com/PacktPublishing/LLM-Engineers-Handbook" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-red underline transition-colors">open-source GitHub repository</a>.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About / Unique */}
      <section className="py-12 md:py-16 bg-brand-black2/40 border-y border-brand-black1/30">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          {[
            { Icon: BookOpen, t: 'What the book is about', d: "Its emphasis on practicality sets it apart. It provides a framework for architecting and building LLM apps you can adapt to your own needs." },
            { Icon: Sparkles, t: 'What makes it unique', d: "It presents the complete lifecycle of an LLM app, connecting DE, SWE, GenAI, and MLOps while building the LLM Twin MVP. Beyond coding: a mind map for architecting future ideas." },
          ].map((c, i) => (
            <ScrollReveal key={c.t} delay={i * 120}>
              <div className="card p-6 md:p-8 h-full flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <c.Icon size={18} className="text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-white">{c.t}</h3>
                </div>
                <p className="text-brand-grey leading-relaxed">{c.d}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured pull-quote */}
      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="relative text-center flex flex-col items-center gap-5">
              <svg className="w-9 h-9 text-brand-red/40" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
              </svg>
              <p className="text-brand-white text-xl md:text-2xl font-medium leading-relaxed">"This book is instrumental in making sure that as many people as possible can not only use LLMs but also adapt them, fine-tune them, quantize them, and make them efficient enough to deploy in the real world."</p>
              <div>
                <p className="text-brand-white font-semibold">Julien Chaumond</p>
                <p className="text-brand-orange text-sm">CTO &amp; Co-founder, Hugging Face</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Banner */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <a href="https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072/" target="_blank" rel="noopener noreferrer" className="block group">
              {/* width/height are the file's own pixels, not a size — they give the
                  browser the ratio so it can reserve the box before the bytes
                  arrive. Without them this is a zero-height element until it
                  loads, and lazy loading turns that into a 650px shove landing
                  under the reader mid-scroll. Tailwind's preflight keeps height
                  auto, so w-full still drives the real size. */}
              <img src={BOOK_BANNER} alt="Amazon Best Seller" width={2500} height={1472} decoding="async" loading="lazy" className="w-full rounded-2xl group-hover:scale-[1.01] transition-transform duration-300" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Get your copy */}
      <section className="py-12 md:py-16 bg-brand-black2/40 border-y border-brand-black1/30">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-7">
          <Eyebrow center>Get your copy</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold">A Special Perk From Decoding AI</h2>
          {/* One card per retailer, Packt first and wider. The discount codes are
              a paid-subscription perk now, so they belong to one of the two — the
              split says that on its own, without a sentence having to.
              The two bodies start level because each header row is a single h3 at
              the same size; the perk tag is shorter than that h3, so it never
              drives the row's height. Amazon carries the same header wrapper for
              nothing but that symmetry. Each button sits in an mt-auto footer so
              both land on one baseline however long the copy above them runs.
              btn-ghost has a 1px border and btn-primary has none, so the Packt
              button takes a transparent one — in one flex row they used to stretch
              to match, but in separate cards nothing equalises them and the tops
              sat 2px apart. */}
          <div className="grid w-full gap-4 md:grid-cols-[1.15fr_1fr] md:gap-5">
            <div className="card flex flex-col gap-3 p-6 text-left">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold">Packt</h3>
                {/* Same treatment the course cards give their level badges
                    (levelStyle in Courses.tsx, the Beginner case). Inline rather
                    than utilities because .tag ends in a `border: 1px solid`
                    shorthand, which resets border-color to currentcolor and,
                    sitting later in the sheet, beats a border-* utility — the
                    reason the border read as solid yellow instead of a tint. */}
                <span className="tag" style={{ color: '#f9cf32', borderColor: 'rgba(249,207,50,0.3)', background: 'rgba(249,207,50,0.1)' }}>
                  <Lock size={11} /> Subscriber perk
                </span>
              </div>
              <p className="text-sm text-brand-grey leading-relaxed">Paid Decoding AI subscribers get discount codes for the eBook and the print edition.</p>
              <a href="https://www.decodingai.com/p/perks" target="_blank" rel="noopener noreferrer" className="group self-center inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-yellow transition-colors">
                Get your codes on Substack
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <div className="mt-auto flex justify-center pt-1">
                <a href="https://www.packtpub.com/en-us/product/llm-engineers-handbook-9781836200062" target="_blank" rel="noopener noreferrer" className="btn btn-primary border border-transparent px-5 py-3 sm:px-8 sm:py-3.5">
                  <BookOpen size={18} /> Buy from Packt
                </a>
              </div>
            </div>
            <div className="card flex flex-col gap-3 p-6 text-left">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold">Amazon</h3>
              </div>
              <p className="text-sm text-brand-grey leading-relaxed">Can't order from Packt? Amazon often has its own deals, sometimes up to 40% off.</p>
              <div className="mt-auto flex justify-center pt-1">
                <a href="https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-5 py-3 sm:px-8 sm:py-3.5">
                  <ExternalLink size={16} /> Buy on Amazon
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What readers say — testimonial card design, no avatars */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 space-y-3">
              <Eyebrow>Peer Review</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold">What Readers Say</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {bookTestimonials.map((t, idx) => (
              <ScrollReveal key={t.name} delay={(idx % 2) * 120}>
                <TestimonialCard t={t} withAvatar={false} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
