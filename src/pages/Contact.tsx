import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight, Send, CheckCircle, ArrowRight, Star, Sparkles, BookOpen, Presentation } from 'lucide-react';
import { ScrollReveal } from '../components/PageTransition';
import Eyebrow from '../components/Eyebrow';
import { useAudience } from '../data/audience';

/**
 * Chip label -> how it reads inside the generated subject line. Kept apart so
 * "Other" does not produce "contacting you about Other".
 */
const INTERESTS: Record<string, string> = {
  Sponsorship: 'sponsorship',
  Affiliate: 'affiliate marketing',
  'Guest Post': 'a guest post',
  Other: 'something else',
};

/**
 * Where the form hands off. A mailto: cannot send anything on its own — it
 * opens the visitor's mail client with the fields filled in, and they press
 * send. So the mail arrives from their own address, which makes replying work
 * naturally, but nothing is delivered unless they follow through.
 */
const CONTACT_EMAIL = 'pauliusztin@decodingai.com';

/** Sponsorship enquiries are copied here too. */
const SPONSORSHIP_CC = 'david@solopreneurgroup.com';

/**
 * Practical mailto: ceiling. Outlook has historically truncated around 2048
 * characters, and a truncated enquiry is the worst possible failure here — the
 * visitor believes they sent something they did not.
 *
 * The limit has to be measured on the ENCODED url, not the character count:
 * percent-encoding expands a newline to 3 characters and an accented letter to
 * 6, so 1,500 typed characters can be anywhere from 1,600 to 9,000 encoded.
 */
const MAILTO_MAX = 1900;

const reachOutFor = (combined: string) => [
  { Icon: Star, label: 'Sponsorships', desc: `Get your product in front of ${combined} engineers.` },
  { Icon: Sparkles, label: 'Affiliate Marketing', desc: 'Performance partnerships that fit the audience.' },
  { Icon: BookOpen, label: 'Guest Posts', desc: 'Share technical insights on Decoding AI Magazine.' },
];

const inputCls =
  'w-full px-4 py-3 bg-brand-black3/80 border border-brand-black1/50 rounded-xl text-brand-white placeholder:text-brand-grey/35 focus:outline-none focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/15 transition-all';

export default function Contact() {
  const audience = useAudience();
  const reachOut = reachOutFor(audience.combinedLabel);
  const [formData, setFormData] = useState({ name: '', interest: '', message: '' });
  const [handedOff, setHandedOff] = useState(false);
  const [missingInterest, setMissingInterest] = useState(false);

  // The subject is generated rather than typed. Note this is a starting point,
  // not a guarantee: once the draft opens it belongs to the visitor's mail app
  // and every field is editable, so nothing here can be relied on for
  // filtering. The body carries the message alone — the reply address is
  // whatever account their client sends from, and their name is in the
  // signature.
  const subject = `Form: ${formData.name} is contacting you about ${INTERESTS[formData.interest] ?? ''}`;
  const body = formData.message;

  // Built by hand rather than with URLSearchParams, which encodes spaces as
  // '+'. That is correct for form submissions and wrong for mailto: (RFC 6068
  // wants percent-encoding), where clients render the '+' literally.
  const params = [`subject=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`];
  if (formData.interest === 'Sponsorship') params.unshift(`cc=${encodeURIComponent(SPONSORSHIP_CC)}`);
  const mailto = `mailto:${CONTACT_EMAIL}?${params.join('&')}`;
  const tooLong = mailto.length > MAILTO_MAX;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The chips are plain buttons, so required= cannot cover them.
    if (!formData.interest) {
      setMissingInterest(true);
      return;
    }
    if (tooLong) return;
    // location.href, not window.open: a mailto handled by a desktop client
    // leaves window.open with a stranded blank tab. If no handler is
    // registered nothing happens at all, which is why the next screen shows
    // the address in full.
    window.location.href = mailto;
    setHandedOff(true);
  };

  return (
    <div className="pt-24">
      <section className="page-header">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">Let's collaborate.</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              { Icon: ArrowUpRight, t: 'Brands & Startups', d: `I partner with companies in the AI space for sponsorships and affiliate marketing. If you have a product that solves real problems, I'd love to get it in front of my ${audience.combinedLabel} audience.` },
              { Icon: Mail, t: 'Guest Authors', d: "I'm always looking for guest posts on Decoding AI Magazine from people building in the trenches. If you have technical insights to share, I'd love to feature your work." },
            ].map((c, i) => (
              <ScrollReveal key={c.t} delay={i * 120}>
                <div className="card card-hover p-8 h-full flex flex-col gap-5">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center"><c.Icon size={20} className="text-white" /></div>
                  <h3 className="text-2xl font-bold text-brand-white">{c.t}</h3>
                  <p className="text-brand-grey leading-relaxed">{c.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <ScrollReveal className="lg:col-span-2 flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <Eyebrow>Reach out for</Eyebrow>
                <ul className="flex flex-col gap-5">
                  {reachOut.map((it) => (
                    <li key={it.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-black2 border border-brand-black1/50 flex items-center justify-center text-brand-orange flex-shrink-0">
                        <it.Icon size={17} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-brand-white font-semibold leading-tight">{it.label}</p>
                        <p className="text-brand-grey text-sm leading-snug">{it.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-px w-full bg-brand-black1/30" />
              <Link to="/media-kit" className="group card card-hover p-5 flex items-center gap-4 w-full">
                <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shrink-0"><Presentation size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">Media Kit</p>
                  <p className="text-brand-white font-semibold leading-tight mt-0.5">Audience breakdown</p>
                </div>
                <ArrowRight size={18} className="text-brand-grey group-hover:text-brand-red group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-3" delay={150}>
              {handedOff ? (
                <div className="card p-10 text-center flex flex-col items-center gap-4">
                  <CheckCircle size={48} className="text-green-400" />
                  <h3 className="text-2xl font-bold text-brand-white">Your draft is ready</h3>
                  <p className="text-brand-grey">
                    Your email app should have opened with everything filled in.
                  </p>
                  <p className="text-sm text-brand-grey/70">
                    Nothing opened? Some browsers have no mail app set up. Write to{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-orange hover:text-brand-red transition-colors font-medium">{CONTACT_EMAIL}</a>
                    {' '}directly, or{' '}
                    <a href={mailto} className="text-brand-orange hover:text-brand-red transition-colors font-medium">try the draft again</a>.
                  </p>
                  <button onClick={() => setHandedOff(false)} className="text-brand-orange hover:text-brand-red transition-colors font-medium">Edit the message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0"><Send size={15} className="text-white" /></div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-white leading-tight">Send a message</h3>
                      <p className="text-xs text-brand-grey mt-0.5">Tell me what you're working on.</p>
                    </div>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">Name</span>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Your name" />
                  </label>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">I'm interested in...</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(INTERESTS).map((i) => {
                        const on = formData.interest === i;
                        return (
                          <button type="button" key={i} onClick={() => { setFormData({ ...formData, interest: i }); setMissingInterest(false); }} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${on ? 'gradient-bg text-white border-transparent shadow-lg shadow-brand-red/20' : 'bg-brand-black3 text-brand-grey border-brand-black1/50 hover:border-brand-red/50 hover:text-brand-white'}`}>
                            {i}
                          </button>
                        );
                      })}
                    </div>
                    {missingInterest && <p className="text-brand-red text-sm">Pick one so I know what this is about.</p>}
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">Message</span>
                    <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${inputCls} resize-none`} placeholder="Your message..." />
                  </label>
                  {tooLong && (
                    <p className="text-brand-red text-sm">
                      This message is too long to hand to an email app and would be cut short. Please shorten it, or write to{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-brand-orange transition-colors">{CONTACT_EMAIL}</a>
                      {' '}directly.
                    </p>
                  )}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <button type="submit" disabled={tooLong} className="btn btn-primary px-7 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                      <Send size={16} /> Send Message
                    </button>
                    <p className="text-xs text-brand-grey/70">Opens in your email app, so you can check it before sending.</p>
                  </div>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
