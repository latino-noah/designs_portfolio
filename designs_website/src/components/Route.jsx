import { useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, MOTION } from '../lib/motion';
import { route } from '../data/content';
import './Route.css';

/**
 * Editorial timeline. A sticky year/altitude readout on the left follows the
 * active waypoint; the route line fills as you scroll.
 */
export default function Route() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const items = gsap.utils.toArray('.waypoint');
      items.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          '.route__line-fill',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.route__list', start: 'top 55%', end: 'bottom 55%', scrub: true } }
        );
        gsap.from('.route__title-line > span', {
          yPercent: 110,
          duration: 1.6,
          stagger: 0.1,
          scrollTrigger: { trigger: '.route__head', start: 'top 80%' },
        });
        items.forEach((el) => {
          gsap.from(el.querySelectorAll('.waypoint__body > *'), {
            y: 50,
            opacity: 0,
            duration: 1.3,
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: 'top 80%' },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const current = route[active];

  return (
    <section ref={root} id="route" className="route section" aria-labelledby="route-title">
      <div className="route__head">
        <h2 id="route-title" className="route__title display">
          <span className="route__title-line">
            <span>The route</span>
          </span>
          <span className="route__title-line">
            <span>
              <span className="serif">so far</span>
            </span>
          </span>
        </h2>
      </div>

      <div className="route__grid">
        <aside className="route__aside" aria-hidden="true">
          <div className="route__readout">
            <span className="mono route__readout-label">
              Waypoint 0{active + 1} / 0{route.length}
            </span>
            <span className="route__year display" key={current.year}>
              {current.year.split('').map((d, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                  {d}
                </span>
              ))}
            </span>
            <span className="mono route__alt" key={current.alt}>
              {current.type} · {current.alt}
            </span>
          </div>
        </aside>

        <div className="route__list">
          <span className="route__line" aria-hidden="true">
            <span className="route__line-fill" />
          </span>
          <ol>
          {route.map((r, i) => (
            <li key={r.year + r.title} className={`waypoint ${i === active ? 'is-active' : ''}`}>
              <span className="waypoint__dot" aria-hidden="true" />
              <div className="waypoint__body">
                <p className="mono waypoint__meta">
                  <span>{r.year}</span>
                  <span className="accent">{r.type}</span>
                </p>
                <h3 className="waypoint__title">{r.title}</h3>
                <p className="serif waypoint__place">{r.place}</p>
                <p className="waypoint__text">{r.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
