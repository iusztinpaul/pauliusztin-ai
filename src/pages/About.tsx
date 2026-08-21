import { Link } from 'react-router-dom';
import { asset } from '../lib/asset';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../components/PageTransition';
import Eyebrow from '../components/Eyebrow';

const AVATAR =
  asset('/media/professional-avatar-image-full-edited-2-47269356.webp');
const DAI_LOGO =
  asset('/media/logo-final-02-96e549da.webp');

export default function About() {
  return (
    <div className="pt-24">
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="warm-glow" style={{ width: 360, height: 360, top: 0, right: -120, opacity: 0.25 }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <ScrollReveal className="lg:col-span-2 flex justify-center lg:sticky lg:top-28">
              <div className="relative">
                <div className="warm-glow" style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }} />
                <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-[1.6rem] p-[3px] gradient-bg shadow-2xl shadow-black/50">
                  <img src={AVATAR} alt="Paul Iusztin" decoding="async" className="w-full h-full object-cover rounded-[1.45rem]" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-3 flex flex-col gap-8" delay={150}>
              <div className="flex flex-col gap-4">
                <Eyebrow>My story</Eyebrow>
                <h1 className="text-5xl md:text-6xl font-extrabold">Hi, I'm Paul<span className="text-brand-red">.</span></h1>
                <h3 className="text-xl font-semibold text-brand-grey">I help engineers ship AI products.</h3>
              </div>
              <div className="gradient-hairline opacity-50" />
              <div className="flex flex-col gap-5 text-lg text-brand-grey leading-relaxed">
                <p>I'm the author of the bestselling <span className="text-brand-white font-medium">LLM Engineer's Handbook</span>, lead instructor of the Agentic AI Engineering course, and one of the founding AI engineers of a San Francisco start-up.</p>
                <p>But my path here was anything but direct.</p>
                <p>My family lost everything in the 2008 financial crisis. As a teenager, I spiraled into destructive habits. Then, at 18, I made a U-turn — studying relentlessly to rebuild my future. That resilience still fuels my work today.</p>
              </div>
              <div className="gradient-hairline opacity-50" />
              <div className="flex flex-col gap-5 text-lg text-brand-grey leading-relaxed">
                <p>Now I teach AI Engineering as I wanted to at the beginning of my career. End-to-end.</p>
                <p>My goal is to help others escape the PoC purgatory I faced for the first five years of my career. That's why I created <span className="text-brand-white font-medium">Decoding AI Magazine</span>.</p>
                <p>When I'm not working, I spend time with my fiancée and cats, traveling, gaming, cooking, and working out.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black3/30 to-brand-black3/60" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center gap-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center">The Decoding AI Magazine</h2>
          <img src={DAI_LOGO} alt="Decoding AI" decoding="async" loading="lazy" className="w-32 h-32 object-contain drop-shadow-2xl" />
          <div className="max-w-2xl mx-auto text-center flex flex-col gap-5 text-lg text-white/90 leading-relaxed">
            <p>Real-world guides taking you from the PoC purgatory to shipping AI products.</p>
            <p>Every Tuesday morning, you'll get one free actionable tip to design, build, and deploy production-grade AI systems in less than 8 minutes.</p>
          </div>
          <Link to="/aimagazine" className="btn px-7 py-3.5 bg-white text-brand-black3 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
            Read More<ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
