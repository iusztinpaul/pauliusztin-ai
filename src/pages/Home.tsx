import Hero from '../components/Hero';
import LogoBanner from '../components/LogoBanner';
import WorkSection from '../components/WorkSection';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <LogoBanner />
      <WorkSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
