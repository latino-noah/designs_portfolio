import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, lockScroll, prefersReducedMotion } from '../lib/motion';
import { projects } from '../data/content';
import { Arrow, RollText } from './ui';
import './CaseStudy.css';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Fullscreen project view. Opening grows the clicked image from its exact on-page
 * rectangle to full width via clip-path (no stretching), then the copy rises in.
 * "Next project" swaps content behind a curtain wipe.
 */
export default function CaseStudy({ state, onClose }) {
  const root = useRef(null);
  const [index, setIndex] = useState(state?.index ?? 0);
  const [mounted, setMounted] = useState(false);
  const opener = useRef(null);
  const busy = useRef(false);

  // Mount when opened
  useEffect(() => {
    if (state) {
      setIndex(state.index);
      opener.current = state.from;
      setMounted(true);
    }
  }, [state]);

  // Intro animation from the source rect
  useLayoutEffect(() => {
    if (!mounted || !root.current) return;
    lockScroll(true);
    const el = root.current;
    const figure = el.querySelector('.case__figure');
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.from(el, { autoAlpha: 0, duration: 0.3 });
        return;
      }
      const src = opener.current?.getBoundingClientRect();
      const dst = figure.getBoundingClientRect();
      const from = src
        ? `inset(${src.top - dst.top}px ${dst.right - src.right}px ${dst.bottom - src.bottom}px ${src.left - dst.left}px round 4px)`
        : 'inset(50% 50% 50% 50%)';
      gsap
        .timeline()
        .fromTo('.case__bg', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo(figure, { clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 1.3, ease: 'expo.inOut' }, 0)
        .fromTo('.case__figure img', { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.inOut' }, 0)
        .from('.case__rise', { yPercent: 110, duration: 1.3, stagger: 0.05, ease: 'expo.out' }, 0.85)
        .from('.case__fade', { opacity: 0, y: 30, duration: 1.2, stagger: 0.06, ease: 'expo.out' }, 1);
    }, el);
    el.querySelector('.case__close')?.focus({ preventScroll: true });
    return () => ctx.revert();
    // only on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const close = () => {
    if (busy.current) return;
    busy.current = true;
    const finish = () => {
      busy.current = false;
      setMounted(false);
      lockScroll(false);
      opener.current?.focus({ preventScroll: true });
      onClose();
    };
    if (prefersReducedMotion()) return finish();
    gsap
      .timeline({ onComplete: finish })
      .to(root.current.querySelectorAll('.case__rise, .case__fade'), { opacity: 0, duration: 0.3 })
      .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, 0.1);
  };

  const next = () => {
    if (busy.current) return;
    busy.current = true;
    const curtain = root.current.querySelector('.case__curtain');
    const scroller = root.current.querySelector('.case__scroll');
    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' })
      .add(() => {
        setIndex((i) => (i + 1) % projects.length);
        scroller.scrollTop = 0;
      })
      .to(curtain, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.05')
      .fromTo('.case__figure img', { scale: 1.25 }, { scale: 1, duration: 1.4, ease: 'expo.out' }, '<')
      .from(root.current.querySelectorAll('.case__rise'), { yPercent: 110, duration: 1.2, stagger: 0.04, ease: 'expo.out' }, '<0.3');
  };

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!mounted) return null;
  const p = projects[index];
  const nextP = projects[(index + 1) % projects.length];

  return (
    <div ref={root} className="case" role="dialog" aria-modal="true" aria-labelledby="case-title">
      <div className="case__bg" />
      <div className="case__scroll" data-lenis-prevent>
        <figure className="case__figure">
          <img src={p.image} alt={p.alt} />
        </figure>

        <div className="case__bar">
          <span className="mono case__fade">
            Case {pad(index + 1)} / {pad(projects.length)}
          </span>
          <button className="case__close pill" onClick={close} aria-label="Close case study">
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <article className="case__content">
          <header className="case__head">
            <p className="mono case__mask">
              <span className="case__rise accent">{p.kind}</span>
            </p>
            <h2 id="case-title" className="case__title display case__mask">
              <span className="case__rise">{p.title}</span>
            </h2>
          </header>

          <div className="case__grid">
            <p className="case__lead case__fade">{p.description}</p>

            <dl className="case__facts case__fade">
              <div>
                <dt className="mono">Role</dt>
                <dd>{p.role}</dd>
              </div>
              <div>
                <dt className="mono">Stack</dt>
                <dd>{p.tech.join(', ')}</dd>
              </div>
              <div>
                <dt className="mono">Year</dt>
                <dd>{p.year}</dd>
              </div>
            </dl>

            <section className="case__block case__fade">
              <h3 className="mono">The challenge</h3>
              <p className="serif">{p.challenge}</p>
            </section>
            <section className="case__block case__fade">
              <h3 className="mono">The approach</h3>
              <p className="serif">{p.solution}</p>
            </section>

            <div className="case__cta case__fade">
              <a className="pill" href={p.link} target="_blank" rel="noreferrer">
                View live project <Arrow />
              </a>
            </div>
          </div>

          <button className="case__next" onClick={next} data-cursor="Next">
            <span className="mono">Next project</span>
            <span className="case__next-title display">
              <RollText>{nextP.title}</RollText> <Arrow dir="e" />
            </span>
          </button>
        </article>
      </div>
      <div className="case__curtain" aria-hidden="true" />
    </div>
  );
}
