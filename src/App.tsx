/* Routing and app-wide behaviour.
   
      Holds three things worth knowing about:
      - SmoothScroll owns the single Lenis instance and resets scroll to the top
        on every route change. Because Lenis intercepts scrolling, pages must NOT
        call window.scrollTo themselves; it silently does nothing.
      - SkipLink is the keyboard shortcut past the header to #main.
      - Pages are lazy loaded, so each route is its own JS chunk. */

import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "./lib/lenis";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Loader from "./components/Loader/Loader";
import { useLanguage } from "./context/LanguageContext";
import "./App.scss";

const About = lazy(() => import("./pages/About/About"));
const Services = lazy(() => import("./pages/Services/Services"));
const Research = lazy(() => import("./pages/Research/Research"));
const Contact = lazy(() => import("./pages/Contact/Contact"));

function SmoothScroll() {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    // Lenis owns the scroll position, so this is the only place a route
    // change resets it. Pages calling window.scrollTo would do nothing.
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a className="skip-link" href="#main">
      {t({ en: "Skip to main content", fr: "Aller au contenu principal" })}
    </a>
  );
}

export default function App() {
  return (
    <>
      <SmoothScroll />
      <SkipLink />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/research" element={<Research />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
