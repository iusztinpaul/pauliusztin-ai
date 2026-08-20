import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';

// Code-split every route except the landing page, so a homepage visit doesn't
// download (and parse) the JS for six other pages + the media kit's charts.
const About = lazy(() => import('./pages/About'));
const AIMagazine = lazy(() => import('./pages/AIMagazine'));
const Book = lazy(() => import('./pages/Book'));
const Courses = lazy(() => import('./pages/Courses'));
const Events = lazy(() => import('./pages/Events'));
const MediaKit = lazy(() => import('./pages/MediaKit'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-black3 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <PageTransition>
            <Suspense
              fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-black1 border-t-brand-orange" />
                </div>
              }
            >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/aimagazine" element={<AIMagazine />} />
              <Route path="/book" element={<Book />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/events" element={<Events />} />
              <Route path="/media-kit" element={<MediaKit />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            </Suspense>
          </PageTransition>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
