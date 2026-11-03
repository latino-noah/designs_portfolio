import { useRef } from 'react';
import { gsap, useGSAP, MOTION, isFinePointer, scrollToTarget } from '../lib/motion';
import { ridgePath } from '../lib/ridges';
import { person } from '../data/content';
import './Hero.css';

/**
 * Layer stack, back → front. The name sits between `mid` and `near`,
 * so the two front ridges mask it (Foreground Masking Parallax).
 * depth: mouse parallax strength · scroll: yPercent travelled while the hero scrolls out.
 */
const BACK = [
  { id: 'far', top: '#c4643a', bottom: '#7a3a22', depth: 0.12, scroll: 22,
    opts: { seed: 11, base: 0.64, amp: 0.16, roughness: 0.6, peaks: [{ x: 0.22, h: 0.14, w: 0.1 }, { x: 0.76, h: 0.12, w: 0.12 }] } },
  { id: 'mid', top: '#6e3420', bottom: '#3a1d14', depth: 0.25, scroll: 14,
    opts: { seed: 4, base: 0.74, amp: 0.15, roughness: 0.6, peaks: [{ x: 0.66, h: 0.2, w: 0.08 }, { x: 0.06, h: 0.12, w: 0.08 }] } },
];
const FRONT = [
  { id: 'near', top: '#3a2016', bottom: '#1d120d', depth: 0.55, scroll: -6,
    opts: { seed: 23, base: 0.84, amp: 0.12, roughness: 0.62, peaks: [{ x: 0.35, h: 0.32, w: 0.075 }, { x: 0.9, h: 0.16, w: 0.08 }] } },
  { id: 'front', top: '#141110', bottom: '#0c0c0b', depth: 0.85, scroll: -34,
    opts: { seed: 7, base: 0.95, amp: 0.09, roughness: 0.62, peaks: [{ x: 0.61, h: 0.46, w: 0.07 }, { x: 0.14, h: 0.16, w: 0.07 }, { x: 0.86, h: 0.1, w: 0.06 }] } },
];

function Ridge({ layer }) {
  const d = ridgePath(layer.opts);
  return (
    <div className={`hero__layer hero__layer--${layer.id}`} data-scroll={layer.scroll}>
      <div className="hero__layer-inner" data-depth={layer.depth}>
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <defs>
            <linearGradient id={`g-${layer.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={layer.top} />
              <stop offset="0.55" stopColor={layer.bottom} />
            </linearGradient>
          </defs>
          <path d={d} fill={`url(#g-${layer.id})`} />
        </svg>
        <div className="hero__layer-fill" style={{ background: layer.bottom }} />
      </div>
    </div>
  );
}

export default function Hero({ ready }) {
  const root = useRef(null);

  /* Scroll-out choreography + mouse parallax (set up immediately, hidden behind the loader). */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // Initial state for the intro
        gsap.set('.hero__char', { yPercent: 115 });
        gsap.set('.hero__last-inner', { yPercent: 110 });
        gsap.set('.hero__layer--far, .hero__layer--mid', { yPercent: 18 });
        gsap.set('.hero__layer--near', { yPercent: 25 });
        gsap.set('.hero__layer--front', { yPercent: 30 });
        gsap.set('.hero__sun', { yPercent: 70, scale: 0.8 });
        gsap.set('.hero__fade', { autoAlpha: 0, y: 24 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          defaults: { ease: 'none' },
        });
        tl.to('.hero__sky', { yPercent: 30 }, 0)
          .to('.hero__sun-wrap', { yPercent: 70 }, 0)
          .to('.hero__name', { yPercent: 42, scale: 0.92 }, 0)
          .to('.hero__ui', { yPercent: -30, autoAlpha: 0, duration: 0.5 }, 0);
        root.current.querySelectorAll('.hero__layer').forEach((el) => {
          tl.to(el, { y: () => (Number(el.dataset.scroll) / 100) * window.innerHeight }, 0);
        });

        if (!isFinePointer()) return;
        const targets = [...root.current.querySelectorAll('[data-depth]')].map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3' }),
        }));
        const onMove = (e) => {
          const mx = e.clientX / window.innerWidth - 0.5;
          const my = e.clientY / window.innerHeight - 0.5;
          targets.forEach((t) => {
            t.x(-mx * t.depth * 70);
            t.y(-my * t.depth * 26);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  /* Intro, once the loader starts wiping. Ridges rise like a camera tilting up; the name climbs out from behind them. */
  useGSAP(
    () => {
      if (!ready || !window.matchMedia(MOTION).matches) return;
      gsap
        .timeline({ defaults: { duration: 2.2, ease: 'expo.out' } })
        .to('.hero__sun', { yPercent: 0, scale: 1, duration: 2.8 }, 0)
        .to('.hero__layer--far, .hero__layer--mid', { yPercent: 0, stagger: 0.08 }, 0.05)
        .to('.hero__layer--near', { yPercent: 0 }, 0.12)
        .to('.hero__layer--front', { yPercent: 0 }, 0.16)
        .to('.hero__char', { yPercent: 0, duration: 2, stagger: 0.07 }, 0.35)
        .to('.hero__last-inner', { yPercent: 0, duration: 1.6 }, 0.9)
        .to('.hero__fade', { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.08 }, 1.1);
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__sky" aria-hidden="true" />
      <div className="hero__sun-wrap" aria-hidden="true">
        <div className="hero__sun-depth" data-depth="0.06">
          <div className="hero__sun" />
        </div>
      </div>

      {BACK.map((l) => (
        <Ridge key={l.id} layer={l} />
      ))}

      <h1 id="hero-title" className="hero__name">
        <span className="hero__name-depth" data-depth="0.4">
          <span className="hero__first" aria-label={person.firstName}>
            {person.firstName.split('').map((c, i) => (
              <span key={i} className="hero__char" aria-hidden="true">
                {c}
              </span>
            ))}
          </span>
          <span className="hero__last">
            <span className="hero__last-inner serif">{person.lastName}</span>
          </span>
        </span>
      </h1>

      {FRONT.map((l) => (
        <Ridge key={l.id} layer={l} />
      ))}

      <div className="hero__ui">
        <p className="hero__coords mono hero__fade">
          <span>{person.coords}</span>
          <span>Portfolio ©{new Date().getFullYear()}</span>
        </p>

        <div className="hero__bottom">
          <p className="hero__role hero__fade">
            <span className="serif">{person.role[0]}</span>
            <span className="hero__role-amp mono">&amp;</span>
            <span className="serif">{person.role[1]}</span>
          </p>

          <button className="hero__scroll hero__fade" onClick={() => scrollToTarget('#about')} aria-label="Scroll to About">
            <span className="hero__scroll-track" aria-hidden="true">
              <span className="hero__scroll-dot" />
            </span>
            <span className="mono">Scroll to climb</span>
          </button>

          <p className="hero__intro hero__fade">
            Designing and building cinematic web experiences where design, code and motion meet. Based in{' '}
            {person.city}, {person.country}.
          </p>
        </div>
      </div>
    </section>
  );
}
