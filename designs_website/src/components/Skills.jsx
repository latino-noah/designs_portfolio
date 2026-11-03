import { useEffect, useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, MOTION } from '../lib/motion';
import { skills } from '../data/content';
import './Skills.css';

/** Tiny elevation profile — the peak height is the skill level (1–5). */
function Profile({ level, seed }) {
  const h = 30;
  const peak = h - 4 - level * 4.6;
  const j = (n) => ((Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1; // stable jitter
  const pts = [
    [0, h - 2],
    [14, h - 6 - j(1) * 6],
    [28, h - 4 - j(2) * 4],
    [44, peak + 6 + j(3) * 4],
    [60, peak],
    [74, peak + 8 + j(4) * 4],
    [88, h - 8 - j(5) * 6],
    [104, h - 5 - j(6) * 3],
    [120, h - 2],
  ];
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1].toFixed(1)}`).join(' ');
  return (
    <svg className="skill__profile" viewBox="0 0 120 32" aria-hidden="true">
      <path className="skill__profile-area" d={`${line} L120 32 L0 32 Z`} />
      <path className="skill__profile-line" d={line} pathLength="1" />
      <circle className="skill__profile-peak" cx="60" cy={peak} r="2.6" />
    </svg>
  );
}

export default function Skills() {
  const root = useRef(null);

  /*
   * Sticky panels taller than the remaining screen height would hide their last rows.
   * For those, lower the sticky offset so the panel first scrolls until its bottom is
   * visible, then sticks — the stacking effect stays, nothing gets hidden.
   */
  useEffect(() => {
    const panels = [...root.current.querySelectorAll('.skill-panel')];
    let frame = 0;
    const fit = () => {
      panels.forEach((p) => {
        p.style.top = '';
        const cs = getComputedStyle(p);
        if (cs.position !== 'sticky') return;
        const top = parseFloat(cs.top);
        const room = window.innerHeight - 12;
        if (top + p.offsetHeight > room) p.style.top = `${Math.round(room - p.offsetHeight)}px`;
      });
    };
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        fit();
        ScrollTrigger.refresh();
      });
    };
    fit();
    document.fonts?.ready.then(onResize);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from('.skills__title-line > span', {
          yPercent: 110,
          duration: 1.6,
          stagger: 0.1,
          scrollTrigger: { trigger: '.skills__head', start: 'top 80%' },
        });

        const panels = gsap.utils.toArray('.skill-panel');
        panels.forEach((panel, i) => {
          // Interactive typography: the category word stretches from condensed to extended as it arrives.
          gsap.fromTo(
            panel.querySelector('.skill-panel__title'),
            { '--wdth': 62 },
            { '--wdth': 125, ease: 'none', scrollTrigger: { trigger: panel, start: 'top 95%', end: 'top 25%', scrub: true } }
          );

          // Elevation profiles draw in
          gsap.fromTo(
            panel.querySelectorAll('.skill__profile-line'),
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1.6,
              stagger: 0.08,
              ease: 'power2.inOut',
              scrollTrigger: { trigger: panel, start: 'top 55%' },
            }
          );
          gsap.from(panel.querySelectorAll('.skill__profile-peak, .skill__profile-area'), {
            opacity: 0,
            scale: 0,
            transformOrigin: '50% 100%',
            duration: 1,
            stagger: 0.04,
            delay: 0.6,
            scrollTrigger: { trigger: panel, start: 'top 55%' },
          });

          // Covered panels recede as the next one slides over
          const nextPanel = panels[i + 1];
          if (nextPanel) {
            gsap.to(panel, {
              scale: 0.94,
              filter: 'brightness(0.75)',
              ease: 'none',
              scrollTrigger: { trigger: nextPanel, start: 'top 70%', end: 'top 15%', scrub: true },
            });
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="skills" className="skills section" aria-labelledby="skills-title">
      <div className="skills__head">
        <p className="mono skills__label">
          <span className="accent">(03)</span> Skills &amp; expertise
        </p>
        <h2 id="skills-title" className="skills__title display">
          <span className="skills__title-line">
            <span>The</span>
          </span>
          <span className="skills__title-line">
            <span>
              tool<span className="serif accent">kit</span>
            </span>
          </span>
        </h2>
        <p className="skills__intro">
          Three disciplines, one practice. Peaks show how deep I go — from daily drivers to the tools I&rsquo;m climbing
          towards right now.
        </p>
      </div>

      <div className="skills__stack">
        {skills.map((cat, i) => (
          <article key={cat.id} className={`skill-panel skill-panel--${cat.id}`} style={{ '--i': i }} aria-labelledby={`sk-${cat.id}`}>
            <div className="skill-panel__head">
              <span className="mono">
                0{i + 1} / 0{skills.length}
              </span>
              <h3 id={`sk-${cat.id}`} className="skill-panel__title">
                {cat.title}
              </h3>
            </div>
            <p className="serif skill-panel__tagline">{cat.tagline}</p>

            <ul className="skill-panel__list">
              {cat.items.map((s, j) => (
                <li key={s.name} className="skill">
                  <span className="skill__name">{s.name}</span>
                  <Profile level={s.level} seed={i * 10 + j + 1} />
                  <span className="skill__note mono">
                    <span className="sr-only">Level {s.level} of 5 — </span>
                    {s.note}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
