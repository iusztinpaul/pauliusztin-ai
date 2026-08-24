import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES, type RoutePath } from './routes';
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

// Typed against routes.ts, so a path without a page — or a page nobody can
// reach — is a build error rather than a 404 someone finds later.
const PAGES: Record<RoutePath, ComponentType> = {
  '/': Home,
  '/about': About,
  '/aimagazine': AIMagazine,
  '/book': Book,
  '/courses': Courses,
  '/events': Events,
  '/media-kit': MediaKit,
  '/contact': Contact,
};

function App() {
  // Vite's base only rewrites asset URLs; the router has to be told separately
  // or every route 404s under a subpath.
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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
              {ROUTES.map(({ path }) => {
                const Page = PAGES[path];
                return <Route key={path} path={path} element={<Page />} />;
              })}
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
