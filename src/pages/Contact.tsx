import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight, Send, CheckCircle, ArrowRight, Star, Sparkles, BookOpen, Presentation } from 'lucide-react';
import { ScrollReveal } from '../components/PageTransition';
import Eyebrow from '../components/Eyebrow';

const interests = ['Sponsorship', 'Affiliate', 'Guest Post', 'Other'];

const reachOut = [
  { Icon: Star, label: 'Sponsorships', desc: 'Get your product in front of 129k+ engineers.' },
  { Icon: Sparkles, label: 'Affiliate Marketing', desc: 'Performance partnerships that fit the audience.' },
  { Icon: BookOpen, label: 'Guest Posts', desc: 'Share technical insights on Decoding AI Magazine.' },
];

const inputCls =
  'w-full px-4 py-3 bg-brand-black3/80 border border-brand-black1/50 rounded-xl text-brand-white placeholder:text-brand-grey/35 focus:outline-none focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/15 transition-all';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', interest: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: `[Interest: ${formData.interest}]\n\n${formData.message}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', interest: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
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
              { Icon: ArrowUpRight, t: 'Brands & Startups', d: "I partner with companies in the AI space for sponsorships and affiliate marketing. If you have a product that solves real problems, I'd love to get it in front of my 120k+ audience." },
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
                  <p className="text-brand-white font-semibold leading-tight mt-0.5">Full audience breakdown</p>
                </div>
                <ArrowRight size={18} className="text-brand-grey group-hover:text-brand-red group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-3" delay={150}>
              {status === 'success' ? (
                <div className="card p-10 text-center flex flex-col items-center gap-4">
                  <CheckCircle size={48} className="text-green-400" />
                  <h3 className="text-2xl font-bold text-brand-white">Message sent!</h3>
                  <p className="text-brand-grey">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                  <button onClick={() => setStatus('idle')} className="text-brand-orange hover:text-brand-red transition-colors font-medium">Send another message</button>
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">Name</span>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Your name" />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">Email</span>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
                    </label>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">Subject</span>
                    <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputCls} placeholder="What's this about?" />
                  </label>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">I'm interested in...</span>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((i) => {
                        const on = formData.interest === i;
                        return (
                          <button type="button" key={i} onClick={() => setFormData({ ...formData, interest: i })} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${on ? 'gradient-bg text-white border-transparent shadow-lg shadow-brand-red/20' : 'bg-brand-black3 text-brand-grey border-brand-black1/50 hover:border-brand-red/50 hover:text-brand-white'}`}>
                            {i}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-grey">Message</span>
                    <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${inputCls} resize-none`} placeholder="Your message..." />
                  </label>
                  {status === 'error' && <p className="text-brand-red text-sm">{errorMessage}</p>}
                  <div className="text-center pt-1">
                    <button type="submit" disabled={status === 'loading'} className="btn btn-primary px-7 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                      {status === 'loading' ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
                    </button>
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
