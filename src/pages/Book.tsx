import { useState } from 'react';
import { asset } from '../lib/asset';
import { ExternalLink, BookOpen, Star, Sparkles, Copy, Check } from 'lucide-react';
import { ScrollReveal } from '../components/PageTransition';
import Eyebrow from '../components/Eyebrow';
import { TestimonialCard } from '../components/Testimonials';

const BOOK_COVER = asset('/Handbook.png');
const BOOK_BANNER =
  asset('/media/book-page-amazon-best-seller-banner-7-010de00f.webp');

const bookTestimonials = [
  { name: 'Akshit Bhalla', role: 'Product Data Scientist at Tesla', quote: "Exploring large language models (LLMs) and retrieval augmented generation (RAG)? I recently got my hands on LLM Engineer's Handbook by Paul Iusztin and Maxime Labonne, and I've been hooked ever since it arrived!" },
  { name: 'Maria Vechtomova', role: 'Databricks MVP', quote: "Without any doubt, this is one of the best practical books on LLMOps out there. It covers the LLM Twin use case and goes really deep into designing architecture." },
  { name: 'Gideon Mendels', role: 'Co-founder & CEO, CometML', quote: "The book provides an excellent framework for mastering LLM Engineering, bridging the gap between ML research, AI engineering and LLMOps." },
  { name: 'Hamza Tahir', role: 'Co-founder & CTO, ZenML', quote: "In an era where AI is reshaping industries at breakneck speed, LLM Engineer's Handbook stands out as an essential guide for navigating the complexities of large language models." },
];

function CodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard
      ?.writeText(code)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); })
      .catch(() => {});
  return (
    <button type="button" className="code-chip inline-flex items-center gap-1.5" onClick={copy} title="Copy code">
      {code}
      {copied ? <Check size={12} className="text-brand-yellow" /> : <Copy size={12} />}
    </button>
  );
}

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
              <img src={BOOK_BANNER} alt="Amazon Best Seller" className="w-full rounded-2xl group-hover:scale-[1.01] transition-transform duration-300" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Get your copy */}
      <section className="py-12 md:py-16 bg-brand-black2/40 border-y border-brand-black1/30">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-7">
          <Eyebrow center>Get your copy</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold">A Special Perk From Decoding AI</h2>
          <p className="text-brand-grey leading-relaxed">Buy the book from Packt with these discount codes (tap to copy):</p>
          {/* Side by side even on a phone. Stacked, two cards this tall took
              most of the screen to carry a percentage and an eleven-character
              code. */}
          <div className="flex w-full gap-3 sm:w-auto sm:gap-4">
            <div className="card flex min-w-0 flex-1 flex-col items-center gap-1.5 p-3 sm:gap-2 sm:p-5">
              <span className="text-2xl font-extrabold gradient-text sm:text-3xl">20% off</span>
              <span className="text-[11px] uppercase tracking-wider text-brand-grey sm:text-xs">eBook</span>
              <CodeChip code="EDecodeML20" />
            </div>
            <div className="card flex min-w-0 flex-1 flex-col items-center gap-1.5 p-3 sm:gap-2 sm:p-5">
              <span className="text-2xl font-extrabold gradient-text sm:text-3xl">10% off</span>
              <span className="text-[11px] uppercase tracking-wider text-brand-grey sm:text-xs">Print</span>
              <CodeChip code="PDecodeML10" />
            </div>
          </div>
          <div className="flex flex-row justify-center gap-3 sm:gap-4">
            <a href="https://www.packtpub.com/en-us/product/llm-engineers-handbook-9781836200062" target="_blank" rel="noopener noreferrer" className="btn btn-primary px-5 py-3 sm:px-8 sm:py-3.5">
              <BookOpen size={18} /> Buy the Book
            </a>
            <a href="https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-5 py-3 sm:px-8 sm:py-3.5">
              <ExternalLink size={16} /> Amazon
            </a>
          </div>
          <p className="text-sm text-brand-grey/70">Can't order from Packt? Amazon often has its own deals, sometimes up to 40% off.</p>
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
