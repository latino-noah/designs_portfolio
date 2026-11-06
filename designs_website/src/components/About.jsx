import { useRef } from 'react';
import { gsap, useGSAP, MOTION } from '../lib/motion';
import { about, person } from '../data/content';
import { responsive, SIZES } from '../lib/img';
import './About.css';

/** "[accent words]" → accent spans, everything else → word spans. */
function Statement({ text }) {
  const tokens = text.match(/\[[^\]]+\]|\S+/g);
  let key = 0;
  return tokens.flatMap((tok) => {
    const accent = tok.startsWith('[');
    const words = accent ? tok.slice(1, -1).split(' ') : [tok];
    return words.flatMap((w) => [
      <span key={key++} className={`about__word${accent ? ' accent' : ''}`}>
        {w}
      </span>,
      ' ',
    ]);
  });
}

function CircleBadge() {
  const text = `${person.role[0]} • ${person.role[1]} • ${person.city} • `;
  return (
    <div className="about__badge" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="488">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <span className="about__badge-core" />
    </div>
  );
}

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // Parallax text reveal: words light up as they scroll through the viewport.
        gsap
          .timeline({
            scrollTrigger: { trigger: '.about__statement', start: 'top 82%', end: 'bottom 45%', scrub: 0.6 },
          })
          .fromTo('.about__word', { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none' }, 0);

        // Portrait: clip-path reveal + inner parallax
        gsap.fromTo(
          '.about__portrait',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: '.about__portrait', start: 'top 80%' },
          }
        );
        gsap.fromTo(
          '.about__portrait img',
          { yPercent: -12, scale: 1.25 },
          {
            yPercent: 12,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: '.about__portrait', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
        gsap.to('.about__badge svg', { rotate: 360, duration: 18, repeat: -1, ease: 'none' });

        gsap.utils.toArray('.about__interest').forEach((el) => {
          gsap.from(el, { y: 60, opacity: 0, duration: 1.4, scrollTrigger: { trigger: el, start: 'top 88%' } });
        });

        // Approach: route line draws, waypoints pop
        const steps = gsap.timeline({ scrollTrigger: { trigger: '.about__approach', start: 'top 75%' } });
        steps
          .fromTo('.about__route-line', { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'expo.inOut' })
          .from('.about__step-dot', { scale: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(3)' }, 0.4)
          .from('.about__step-body', { y: 40, opacity: 0, stagger: 0.12, duration: 1.2 }, 0.5);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="about section" aria-labelledby="about-title">
      <h2 id="about-title" className="sr-only">
        About me
      </h2>
      <div className="about__intro">
        <p className="about__statement">
          <Statement text={about.statement} />
        </p>
      </div>

      <div className="about__grid">
        <figure className="about__figure">
          <div className="about__portrait">
            <img
              {...responsive(about.portrait)}
              sizes={SIZES.aboutPortrait}
              alt={about.portraitAlt}
              width="900"
              height="1600"
              loading="lazy"
              decoding="async"
            />
          </div>
          <CircleBadge />
          <figcaption className="mono about__caption">
            <span>Fig. 01</span>
            <span>Chasing the last light</span>
          </figcaption>
        </figure>

        <div className="about__interests">
          <p className="mono about__sub">What I&rsquo;m into</p>
          <ul>
            {about.interests.map((it, i) => (
              <li key={it.title} className="about__interest">
                <span className="mono about__interest-n">0{i + 1}</span>
                <h3 className="serif">{it.title}</h3>
                <p>{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="about__approach">
        <div className="about__approach-head">
          <p className="mono about__sub">How I work</p>
          <p className="about__approach-title">
            A route, not a <span className="serif accent">recipe</span>.
          </p>
        </div>
        <div className="about__route">
          <span className="about__route-line" aria-hidden="true" />
          <ol className="about__steps">
            {about.approach.map((s) => (
              <li key={s.n} className="about__step">
                <span className="about__step-dot" aria-hidden="true" />
                <div className="about__step-body">
                  <span className="mono about__step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
