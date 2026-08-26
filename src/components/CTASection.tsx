import { ScrollReveal } from './PageTransition';
import { asset } from '../lib/asset';
import Eyebrow from './Eyebrow';
import SubscribeForm from './SubscribeForm';
import { useAudience } from '../data/audience';

const DAI_LOGO =
  asset('/media/logo-final-02-4d87c666.webp');

export default function CTASection() {
  const audience = useAudience();
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-black2" />
      <div className="absolute top-0 left-0 right-0 gradient-hairline opacity-70" />
      <div
        className="warm-glow"
        style={{ width: 420, height: 420, top: -120, left: '50%', transform: 'translateX(-50%)', opacity: 0.35 }}
      />

      <ScrollReveal className="relative max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <Eyebrow center>Decoding AI Magazine</Eyebrow>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
          Ready to Master AI Engineering<span className="text-brand-red">?</span>
        </h2>

        <div className="flex items-center justify-center gap-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-brand-black1" />
          <img src={DAI_LOGO} alt="Decoding AI" decoding="async" loading="lazy" className="w-16 h-16 object-contain" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-brand-black1" />
        </div>

        <p className="text-brand-grey text-base md:text-lg leading-relaxed max-w-xl">
          Join {audience.substackLabel} engineers for content on designing, building, and shipping AI software. New issues every Tuesday.
        </p>

        <SubscribeForm />
      </ScrollReveal>
    </section>
  );
}
