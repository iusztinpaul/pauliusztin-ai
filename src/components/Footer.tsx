import { Link } from 'react-router-dom';
import { GitHubIcon, LinkedInIcon, SubstackIcon, XIcon, YouTubeIcon } from './BrandIcons';
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

export default function Footer() {
  const socialClass =
    'w-9 h-9 rounded-full bg-brand-black2 border border-brand-black1/50 flex items-center justify-center text-brand-grey hover:text-brand-red hover:border-brand-red/50 transition-all';

  return (
    <footer className="py-12 border-t border-brand-black1/30 mt-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Wordmark />

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-brand-grey">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-brand-red transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

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

        <div className="mt-8 text-center text-sm text-brand-black1">
          &copy; {new Date().getFullYear()} Crafted Intelligence LLC
        </div>
      </div>
    </footer>
  );
}
