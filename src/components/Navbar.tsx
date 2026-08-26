import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAudience } from '../data/audience';
import Wordmark from './Wordmark';

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'AI Magazine', to: '/aimagazine' },
  { label: 'Book', to: '/book' },
  { label: 'Courses', to: '/courses' },
  { label: 'Events', to: '/events' },
  { label: 'Media Kit', to: '/media-kit' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const audience = useAudience();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Passive: this never calls preventDefault, and saying so keeps iOS from
  // holding each scroll frame to find out. Only the shadow depends on it now —
  // the mobile background no longer does, so a late event cannot show content
  // through the bar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <nav
      // Opaque from the first pixel on mobile. It used to be transparent until
      // 20px of scroll and then faded in over 300ms, so the hero slid visibly
      // under a see-through bar on every downward flick. Nothing is lost by
      // painting it immediately: the mobile "scrolled" colour is bg-brand-black3,
      // the same as the page behind it, so at rest the two are indistinguishable.
      // Desktop keeps the transparent-to-glass transition, where the blur is the
      // point and there is no momentum scrolling to lag behind.
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-black3 md:bg-brand-black3/90 md:backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-brand-black3 md:bg-transparent'
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Wordmark typing />

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm transition-colors ${
                location.pathname === link.to
                  ? 'text-brand-white font-semibold'
                  : 'text-brand-grey hover:text-brand-red'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.decodingai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-sm px-5 py-2.5"
          >
            Join {audience.substackLabel} Subscribers
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-brand-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <>
          {/* Dim + blur the rest of the page so the panel's bottom edge melts
              into it instead of cutting a hard line; tap anywhere to close. */}
          <div
            onClick={() => setMobileOpen(false)}
            aria-hidden
            className="lg:hidden fixed inset-0 z-0 bg-brand-black3/40 backdrop-blur-sm"
          />
          <div className="lg:hidden relative z-10 bg-brand-black3/95 backdrop-blur-md border-t border-brand-black1/30 px-6 py-6 pb-7 flex flex-col gap-4 shadow-[0_22px_28px_-20px_rgba(0,0,0,0.8)]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`transition-colors ${
                  location.pathname === link.to
                    ? 'text-brand-white font-semibold'
                    : 'text-brand-grey hover:text-brand-red'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.decodingai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm px-5 py-2.5 mt-1 self-start"
            >
              Join {audience.substackLabel} Subscribers
            </a>
          </div>
        </>
      )}
    </nav>
  );
}
