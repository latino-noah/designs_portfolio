import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, MOTION, scrollToTarget, lockScroll } from '../lib/motion';
import { person, nav } from '../data/content';
import { RollText, Magnetic, useLocalTime, Arrow } from './ui';
import { ridgePath } from '../lib/ridges';
import './Nav.css';

const SUMMIT = 2964; // metres at the bottom of the page — a small nod to the hero range
const MENU_RIDGE = ridgePath({ seed: 19, base: 0.55, amp: 0.35, peaks: [{ x: 0.7, h: 0.25, w: 0.06 }], width: 1600, height: 200, detail: 7 });

/** Hash links point at sections on the home page; from other pages they become "/#section". */
const resolveHref = (href, home) => (home || !href.startsWith('#') ? href : href === '#top' ? '/' : `/${href}`);

export default function Nav({ ready, page = 'home' }) {
  const home = page === 'home';
  const root = useRef(null);
  const menu = useRef(null);
  const toggle = useRef(null);
  const altRef = useRef(null);
  const [open, setOpen] = useState(false);
  const tl = useRef(null);
  const time = useLocalTime(person.timezone);

  /* Altitude meter: scroll progress → metres. */
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (altRef.current) altRef.current.textContent = String(Math.round(self.progress * SUMMIT)).padStart(4, '0');
      },
    });
    return () => st.kill();
  }, []);

  /* Intro */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.set('.nav__item', { yPercent: -140 });
      });
      return () => mm.revert();
    },
    { scope: root }
  );
  useGSAP(
    () => {
      if (!ready) return;
      gsap.to('.nav__item', { yPercent: 0, duration: 1.4, stagger: 0.08, delay: 0.7 });
    },
    { scope: root, dependencies: [ready] }
  );

  /* Menu timeline */
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
        .set(menu.current, { visibility: 'visible' })
        .fromTo(menu.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 })
        .fromTo('.menu__link-inner', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: 'expo.out' }, 0.45)
        .fromTo('.menu__foot > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 0.7)
        .fromTo('.menu__ridge', { yPercent: 100 }, { yPercent: 0, duration: 1.4, ease: 'expo.out' }, 0.4);
    },
    { scope: root }
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    lockScroll(open);
    document.querySelectorAll('main, footer').forEach((el) => (el.inert = open));

    if (open) {
      t.timeScale(1).play();
      const first = menu.current.querySelector('a');
      setTimeout(() => first?.focus({ preventScroll: true }), 500);
    } else if (t.progress() > 0) {
      t.timeScale(1.6).reverse();
    }

    const onKey = (e) => e.key === 'Escape' && open && (setOpen(false), toggle.current?.focus());
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, href) => {
    // Scroll in place when the target is on this page; otherwise let the browser navigate.
    const local = href.startsWith('#') && (href === '#top' ? home : document.querySelector(href));
    if (!local) {
      setOpen(false);
      return;
    }
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    // Wait for the menu to start closing before scrolling so Lenis is running again.
    setTimeout(() => scrollToTarget(href === '#top' ? 0 : href), wasOpen ? 450 : 0);
  };

  return (
    <div ref={root} className={`nav-root ${open ? 'is-open' : ''}`}>
      <header className="nav">
      <div className="nav__bar">
        <a
          href={resolveHref('#top', home)}
          className="nav__brand nav__item"
          onClick={(e) => go(e, '#top')}
          aria-label={home ? 'Back to top' : 'Home'}
        >
          <RollText>
            {person.firstName} <span className="serif">{person.lastName}</span>
          </RollText>
        </a>

        <div className="nav__status mono nav__item" aria-hidden="true">
          <span>
            {person.city} {time}
          </span>
          <span className="nav__alt">
            Alt <b ref={altRef}>0000</b> m
          </span>
        </div>

        <Magnetic className="nav__item nav__toggle-wrap" strength={0.4}>
          <button
            ref={toggle}
            className="nav__toggle mono"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__toggle-text">
              <RollText>{open ? 'Close' : 'Menu'}</RollText>
            </span>
            <span className="nav__burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </Magnetic>
      </div>
      </header>

      <div ref={menu} id="site-menu" className="menu" role="dialog" aria-modal="true" aria-label="Site menu">
        <nav aria-label="Primary">
          <ol className="menu__list">
            {nav.map((item, i) => (
              <li key={item.href} className="menu__item">
                <a
                  href={resolveHref(item.href, home)}
                  className="menu__link"
                  aria-current={item.href === `/${page}/` ? 'page' : undefined}
                  onClick={(e) => go(e, item.href)}
                >
                  <span className="menu__link-inner">
                    <span className="menu__num mono">0{i}</span>
                    <RollText dupClassName="serif">{item.label}</RollText>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="menu__foot">
          <a href={`mailto:${person.email}`} className="menu__mail">
            <RollText>{person.email}</RollText>
          </a>
          <ul className="menu__socials mono">
            {person.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  <RollText>{s.label}</RollText> <Arrow />
                </a>
              </li>
            ))}
          </ul>
          <p className="mono menu__coords">{person.coords}</p>
        </div>

        <svg className="menu__ridge" viewBox="0 0 1600 200" preserveAspectRatio="none" aria-hidden="true">
          <path d={MENU_RIDGE} />
        </svg>
      </div>
    </div>
  );
}
