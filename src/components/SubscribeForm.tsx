import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

/**
 * Email capture that hands off to Substack with the address already filled in.
 *
 * Substack's /subscribe page reads ?email= straight into its own input, so the
 * reader types once here and only has to confirm on the other side. A direct
 * POST to Substack's API isn't an option — it sends no CORS headers, so the
 * browser blocks it.
 */
const SUBSCRIBE_URL = 'https://www.decodingai.com/subscribe';

const inputCls =
  'w-full px-5 py-3.5 bg-brand-black3/80 border border-brand-black1/50 rounded-full text-brand-white placeholder:text-brand-grey/35 focus:outline-none focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/15 transition-all';

export default function SubscribeForm({ buttonLabel = 'Subscribe' }: { buttonLabel?: string }) {
  const [email, setEmail] = useState('');
  const [handedOff, setHandedOff] = useState(false);

  const target = `${SUBSCRIBE_URL}?email=${encodeURIComponent(email.trim())}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Popup blockers can veto window.open even on a click; fall back to this tab.
    const opened = window.open(target, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.href = target;
    setHandedOff(true);
  };

  if (handedOff) {
    return (
      <div className="w-full max-w-md flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 text-brand-white font-semibold">
          <CheckCircle size={18} className="text-brand-orange shrink-0" />
          Almost there — confirm in the new tab.
        </div>
        <p className="text-sm text-brand-grey">
          Nothing happened?{' '}
          <a href={target} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-brand-red transition-colors font-medium">
            Open it again
          </a>
          {' · '}
          <button type="button" onClick={() => { setHandedOff(false); setEmail(''); }} className="text-brand-orange hover:text-brand-red transition-colors font-medium">
            Use a different email
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-3">
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          placeholder="you@example.com"
          aria-label="Your email address"
        />
        <button type="submit" className="btn btn-primary px-7 py-3.5 shrink-0">
          {buttonLabel} <ArrowRight size={16} />
        </button>
      </form>
      <p className="text-xs text-brand-grey/70">
        You'll finish on Substack, with your email already filled in.
      </p>
    </div>
  );
}
