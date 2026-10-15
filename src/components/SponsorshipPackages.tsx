import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { PACKAGES } from '../data/sponsorship';
import { ScrollReveal } from './PageTransition';
import Eyebrow from './Eyebrow';

export default function SponsorshipPackages() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center flex flex-col items-center gap-4 mb-12">
          <Eyebrow center>Sponsorship</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold">Packages<span className="text-brand-red">.</span></h2>
        </ScrollReveal>

        {/* items-stretch so the buttons line up along the bottom whatever each
            card's list length. */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((p, i) => (
            <ScrollReveal key={p.slug} delay={i * 100} className="h-full">
              <div
                className="card card-hover relative h-full p-6 md:p-7 flex flex-col gap-5"
                style={p.badge ? { borderColor: 'rgba(213, 52, 42, 0.5)' } : undefined}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-6 gradient-bg text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {p.badge}
                  </span>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-brand-white">{p.name}</h3>
                  <p className="text-sm text-brand-grey leading-snug">{p.description}</p>
                </div>
                <p className="flex items-baseline gap-2">
                  <span className="text-sm text-brand-grey">{p.fromLabel ?? 'From'}</span>
                  <span className="text-3xl font-extrabold gradient-text leading-none">{p.from}</span>
                </p>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {p.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-brand-grey">
                      <Check size={15} className="shrink-0 text-brand-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/contact?interest=Sponsorship&package=${p.slug}`}
                  className={`btn w-full py-3 ${p.badge ? 'btn-primary' : 'btn-ghost'}`}
                >
                  Enquire<ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
