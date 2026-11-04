import { useEffect, useRef } from 'react';
import { gsap, useGSAP, DESKTOP, MOTION, isFinePointer, prefersReducedMotion } from '../lib/motion';
import { projects, person } from '../data/content';
import { responsive, SIZES } from '../lib/img';
import { Arrow } from './ui';
import './Work.css';

const pad = (n) => String(n).padStart(2, '0');

export default function Work() {
  const root = useRef(null);
  const counter = useRef(null);
  const bar = useRef(null);
  const years = projects.map((p) => Number(p.year));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pinned horizontal gallery
      mm.add(DESKTOP, () => {
        const track = root.current.querySelector('.work__track');
        const dist = () => track.scrollWidth - window.innerWidth;
        const n = projects.length;

        const scroll = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work__pin',
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.min(n, Math.floor(self.progress * n) + 1);
              if (counter.current) counter.current.textContent = pad(i);
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        gsap.to('.work__bgword', {
          xPercent: -35,
          ease: 'none',
          scrollTrigger: { trigger: '.work__pin', start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
        });

        gsap.utils.toArray('.project').forEach((p) => {
          gsap.fromTo(
            p.querySelector('.project__img'),
            { xPercent: -8 },
            { xPercent: 8, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true } }
          );
          gsap.from(p.querySelector('.project__media'), {
            clipPath: 'inset(0% 0% 0% 100%)',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left 85%' },
          });
          gsap.from(p.querySelectorAll('.project__title-inner, .project__reveal'), {
            yPercent: 110,
            opacity: 0,
            duration: 1.4,
            stagger: 0.06,
            scrollTrigger: { trigger: p, containerAnimation: scroll, start: 'left 70%' },
          });
        });

        gsap.from('.work__intro .work__title-line > span', {
          yPercent: 110,
          duration: 1.6,
          stagger: 0.1,
          scrollTrigger: { trigger: '.work__pin', start: 'top 70%' },
        });
      });

      // Mobile / tablet: vertical stack with clip reveals
      mm.add(`(max-width: 899px) and ${MOTION}`, () => {
        gsap.utils.toArray('.project__media').forEach((el) => {
          gsap.from(el, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.4,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
          gsap.fromTo(
            el.querySelector('.project__img'),
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  // WebGL hover distortion — lazy loaded on desktop with a fine pointer only.
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion() || window.innerWidth < 900) return;
    let fx = null;
    let cancelled = false;
    const cleanups = [];

    // Three.js is ~130 KB gzipped: only fetch it once the gallery is about a screen away.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        load();
      },
      { rootMargin: '100% 0px' }
    );
    io.observe(root.current);

    const load = () => import('../lib/distortion.js').then(({ default: HoverDistortion }) => {
      if (cancelled) return;
      try {
        fx = new HoverDistortion(gsap);
      } catch {
        return; // no WebGL — the plain <img> hover still works
      }
      root.current.querySelectorAll('.project__media').forEach((media) => {
        const img = media.querySelector('img');
        fx.load(img.currentSrc || img.src);
        const enter = (e) => fx.enter(media, img, e);
        const move = (e) => fx.updateMouse(e);
        const leave = () => fx.leave();
        media.addEventListener('pointerenter', enter);
        media.addEventListener('pointermove', move);
        media.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          media.removeEventListener('pointerenter', enter);
          media.removeEventListener('pointermove', move);
          media.removeEventListener('pointerleave', leave);
        });
      });
    });

    return () => {
      cancelled = true;
      io.disconnect();
      cleanups.forEach((fn) => fn());
      fx?.destroy();
    };
  }, []);

  return (
    <section ref={root} id="work" className="work" aria-labelledby="work-title">
      <div className="work__pin">
        <div className="work__bgword display" aria-hidden="true">
          Work — Work — Work
        </div>

        <div className="work__track">
          <header className="work__intro">
            <p className="mono work__label">
              <span className="accent">(02)</span> Selected work
            </p>
            <h2 id="work-title" className="work__title display">
              <span className="work__title-line">
                <span>Selected</span>
              </span>
              <span className="work__title-line">
                <span className="serif">work</span>
              </span>
            </h2>
            <p className="work__sub">
              {pad(projects.length)} projects, {Math.min(...years)} — {Math.max(...years)}. Each one a small expedition: a
              problem, a route, and a view from the top.
            </p>
            <p className="mono work__hint" aria-hidden="true">
              Scroll <Arrow dir="e" />
            </p>
          </header>

          {projects.map((p, i) => (
            <article key={p.id} className={`project ${i % 2 ? 'project--low' : 'project--high'}`} aria-labelledby={`p-${p.id}`}>
              <div className="project__meta mono project__reveal-wrap">
                <span className="project__reveal">
                  {pad(i + 1)} / {pad(projects.length)}
                </span>
                <span className="project__reveal">{p.kind}</span>
                <span className="project__reveal">{p.year}</span>
              </div>

              <a
                className="project__media"
                href={p.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="Visit"
                aria-label={`Visit ${p.title} (opens in a new tab)`}
              >
                <img
                  className="project__img"
                  {...responsive(p.image)}
                  sizes={SIZES.project}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  width="1400"
                  height="875"
                />
              </a>

              <div className="project__body">
                <h3
                  id={`p-${p.id}`}
                  className="project__title display"
                  style={{ '--len': Math.max(...p.title.split(' ').map((w) => w.length)) }}
                >
                  <span className="project__title-inner">{p.title}</span>
                </h3>
                <div className="project__reveal-wrap">
                  <p className="project__desc project__reveal">{p.description}</p>
                </div>
                <dl className="project__facts project__reveal-wrap">
                  <div className="project__reveal">
                    <dt className="mono">Role</dt>
                    <dd>{p.role}</dd>
                  </div>
                  <div className="project__reveal">
                    <dt className="mono">Stack</dt>
                    <dd>{p.tech.join(' / ')}</dd>
                  </div>
                </dl>
                <div className="project__actions project__reveal-wrap">
                  <span className="project__reveal">
                    <a className="pill" href={p.link} target="_blank" rel="noreferrer">
                      Visit site <Arrow />
                    </a>
                  </span>
                </div>
              </div>
            </article>
          ))}

          <div className="work__outro">
            <p className="serif work__outro-text">More experiments live in the lab.</p>
            <a className="pill" href={person.socials.find((s) => s.label === 'GitHub')?.href} target="_blank" rel="noreferrer">
              GitHub <Arrow />
            </a>
          </div>
        </div>

        <div className="work__progress mono" aria-hidden="true">
          <span>Selected work</span>
          <span className="work__progress-bar">
            <span ref={bar} />
          </span>
          <span>
            <b ref={counter}>01</b> / {pad(projects.length)}
          </span>
        </div>
      </div>
    </section>
  );
}
