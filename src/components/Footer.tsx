import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, SubstackIcon, XIcon, YouTubeIcon } from './BrandIcons';
import { useAudience } from '../data/audience';
import Wordmark from './Wordmark';

const links = [
  { label: 'About', to: '/about' },
  { label: 'AI Magazine', to: '/aimagazine' },
  { label: 'Book', to: '/book' },
  { label: 'Courses', to: '/courses' },
  { label: 'Events', to: '/events' },
  { label: 'Media Kit', to: '/media-kit' },
  { label: 'Contact', to: '/contact' },
];

/** Column heading. White on grey text is the hierarchy the old footer lacked —
 *  three groups sat side by side with nothing saying what any of them was. */
const headingClass = 'text-xs font-bold uppercase tracking-wider text-brand-white';

export default function Footer() {
  const audience = useAudience();

  const socialClass =
    'w-9 h-9 rounded-full bg-brand-black2 border border-brand-black1/50 flex items-center justify-center text-brand-grey hover:text-brand-red hover:border-brand-red/50 transition-all';

  return (
    <footer className="py-10 md:py-12 border-t border-brand-black1/30 mt-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:gap-12">
          {/* Who this is, and the one thing worth doing about it. CTASection
              only renders on the home page, so on the other seven this is the
              closing ask. */}
          <div className="flex flex-col items-start gap-3 md:gap-4">
            <Wordmark />
            <p className="max-w-sm text-sm leading-relaxed text-brand-grey">
              I ship AI products and teach you about the process.
            </p>
            {/* A link rather than a button: the navbar already carries the
                primary one, and a second filled button at the foot of every
                page competes with it instead of closing quietly. */}
            <a
              href="https://www.decodingai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-white transition-colors"
            >
              Join {audience.substackLabel} Subscribers
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <nav className="flex flex-col gap-4" aria-label="Footer">
            <p className={headingClass}>Pages</p>
            {/* Two columns rather than seven stacked rows, which would set the
                footer's height on its own. Column-major so reading down then
                over gives the nav's order, rather than zig-zagging across. */}
            <div className="grid grid-flow-col grid-rows-4 grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-brand-grey">
              {links.map((l) => (
                <Link key={l.label} to={l.to} className="hover:text-brand-red transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex flex-col gap-4">
            <p className={headingClass}>Follow along</p>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/in/pauliusztin/" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="LinkedIn">
                <LinkedInIcon size={15} />
              </a>
              <a href="https://x.com/pauliusztin_" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="X">
                <XIcon size={14} />
              </a>
              <a href="https://www.decodingai.com/" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="Substack">
                <SubstackIcon size={14} />
              </a>
              <a href="https://www.youtube.com/@itsdecodingai" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="YouTube">
                <YouTubeIcon size={15} />
              </a>
              <a href="https://github.com/iusztinpaul" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="GitHub">
                <GitHubIcon size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Was text-brand-black1, which measured 1.8:1 against the page — below
            any threshold, effectively invisible rather than merely quiet. */}
        <div className="mt-8 md:mt-10 border-t border-brand-black1/30 pt-6 text-sm text-brand-grey/60">
          &copy; {new Date().getFullYear()} Crafted Intelligence LLC
        </div>
      </div>
    </footer>
  );
}
