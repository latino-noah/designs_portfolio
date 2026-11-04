import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion';
import { ridgeLine } from '../lib/ridges';
import { person, about, projects } from '../data/content';
import { preloadImage, SIZES } from '../lib/img';
import './Loader.css';

// Preloaded with the same srcset/sizes as their <img>, so phones fetch the small file only once.
const PRELOAD = [
  [about.portrait, SIZES.aboutPortrait],
  ...projects.slice(0, 3).map((p) => [p.image, SIZES.project]),
];
const LINE = ridgeLine({ seed: 3, base: 0.62, amp: 0.3, peaks: [{ x: 0.55, h: 0.3, w: 0.08 }], detail: 7, width: 1000, height: 200 });

/**
 * Counts 000 → 100 against real asset loading (images + fonts), draws a ridge line,
 * then wipes upward to reveal the hero. Calls onDone as the wipe starts so the hero intro overlaps it.
 */
export default function Loader({ onDone }) {
  const root = useRef(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const count = root.current.querySelector('.loader__count-num');
      const line = root.current.querySelector('.loader__line path');
      const state = { shown: 0, real: 0 };

      const tasks = [...PRELOAD.map(([src, sizes]) => preloadImage(src, sizes)), document.fonts?.ready ?? Promise.resolve()];
      let finished = 0;
      tasks.forEach((t) =>
        Promise.resolve(t).finally(() => {
          finished += 1;
          state.real = finished / tasks.length;
        })
      );
      const safety = setTimeout(() => (state.real = 1), 7000);

      const minTime = reduced ? 0.2 : 1.9;
      const start = performance.now();
      let exiting = false;

      const exit = () => {
        if (reduced) {
          onDone();
          gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: () => setGone(true) });
          return;
        }
        gsap
          .timeline({ onComplete: () => setGone(true) })
          .to('.loader__reveal > *', { yPercent: -110, duration: 0.8, ease: 'expo.in', stagger: 0.03 })
          .to('.loader__line', { opacity: 0, duration: 0.4 }, '<0.2')
          .add(onDone, '-=0.15')
          .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.25, ease: 'expo.inOut' }, '<');
      };

      const tick = () => {
        const elapsed = (performance.now() - start) / 1000;
        const goal = Math.min(state.real, Math.min(1, elapsed / minTime));
        state.shown += (goal - state.shown) * 0.09;
        if (goal - state.shown < 0.003) state.shown = goal;
        count.textContent = String(Math.round(state.shown * 100)).padStart(3, '0');
        line.style.strokeDashoffset = String(1 - state.shown);
        if (state.shown >= 1 && !exiting) {
          exiting = true;
          gsap.ticker.remove(tick);
          exit();
        }
      };
      gsap.ticker.add(tick);

      gsap.from('.loader__reveal > *', { yPercent: 110, duration: 1, stagger: 0.05, delay: 0.1 });

      return () => {
        gsap.ticker.remove(tick);
        clearTimeout(safety);
      };
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div ref={root} className="loader" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="loader__top mono">
        <span className="loader__reveal">
          <span>{person.firstName} {person.lastName}</span>
        </span>
        <span className="loader__reveal">
          <span>Portfolio ©{new Date().getFullYear()}</span>
        </span>
      </div>

      <svg className="loader__line" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
        <path d={LINE} pathLength="1" />
      </svg>

      <div className="loader__bottom">
        <div className="loader__reveal mono loader__label">
          <span>Calibrating altitude</span>
        </div>
        <div className="loader__reveal loader__count" aria-hidden="true">
          <span>
            <span className="loader__count-num">000</span>
            <span className="loader__count-unit serif">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
