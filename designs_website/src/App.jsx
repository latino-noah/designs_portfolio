import { useCallback, useEffect, useState } from 'react';
import { initLenis, lockScroll, ScrollTrigger } from './lib/motion';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import FieldNotes from './components/FieldNotes';
import Work from './components/Work';
import Skills from './components/Skills';
import Route from './components/Route';
import Contact from './components/Contact';
import CaseStudy from './components/CaseStudy';

export default function App() {
  const [ready, setReady] = useState(false);
  const [caseState, setCaseState] = useState(null);

  useEffect(() => initLenis(), []);

  useEffect(() => {
    lockScroll(!ready);
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  // Re-measure once web fonts settle (titles change size when they swap in).
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const onLoaded = useCallback(() => setReady(true), []);
  const openCase = useCallback((index, from) => setCaseState({ index, from }), []);
  const closeCase = useCallback(() => setCaseState(null), []);

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Loader onDone={onLoaded} />
      <Cursor />
      <Nav ready={ready} />
      <main id="main">
        <Hero ready={ready} />
        <About />
        <FieldNotes />
        <Work onOpen={openCase} />
        <Skills />
        <Route />
      </main>
      <Contact />
      <CaseStudy state={caseState} onClose={closeCase} />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
