import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Nav, ScrollProgress } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Cursor } from "./components/Cursor";
import { FloatingDrive } from "./components/FloatingDrive";
import { Preloader } from "./components/Preloader";
import { useScrollReset, useSmoothScroll } from "./hooks/useSmoothScroll";
import { EASE } from "./lib/motion";
import Home from "./pages/Home";

const Work = lazy(() => import("./pages/Work"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Keyed on pathname so AnimatePresence can play an exit on every navigation. */
const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.45, ease: EASE },
};

function RouteShell({ children }: { children: React.ReactNode }) {
  return <motion.div {...fade}>{children}</motion.div>;
}

export default function App() {
  const location = useLocation();
  const [intro, setIntro] = useState(true);
  const [ready, setReady] = useState(false);

  useSmoothScroll();
  useScrollReset();

  // hold the curtain until fonts are in, so nothing reflows behind it
  useEffect(() => {
    let cancelled = false;
    const done = () => !cancelled && setReady(true);
    if (document.fonts?.ready) document.fonts.ready.then(done).catch(done);
    else done();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {intro && ready && <Preloader onDone={() => setIntro(false)} />}

      <div className="grain relative min-h-screen">
        <Cursor />
        <ScrollProgress />
        <Nav />

        <main id="main" className="relative">
          <Suspense fallback={<div className="min-h-[70svh]" />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<RouteShell><Home /></RouteShell>} />
                <Route path="/work" element={<RouteShell><Work /></RouteShell>} />
                <Route path="/work/:slug" element={<RouteShell><ProjectPage /></RouteShell>} />
                <Route path="/about" element={<RouteShell><About /></RouteShell>} />
                <Route path="/contact" element={<RouteShell><Contact /></RouteShell>} />
                <Route path="*" element={<RouteShell><NotFound /></RouteShell>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>

        <Footer />
        <FloatingDrive />
      </div>
    </>
  );
}
