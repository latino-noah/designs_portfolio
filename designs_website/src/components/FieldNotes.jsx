import { useRef } from 'react';
import { gsap, useGSAP, MOTION } from '../lib/motion';
import { fieldNotes } from '../data/content';
import './FieldNotes.css';

/**
 * Transition band between About and Work.
 * A giant line of type slides horizontally *behind* floating photographs
 * (one photo sits behind the type for extra depth). Each photo has its own scroll speed.
 */
export default function FieldNotes() {
  const root = useRef(null);
  const phrase = `${fieldNotes.marquee} — ${fieldNotes.marquee} — `;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true };
        gsap.fromTo('.notes__type-inner', { xPercent: 0 }, { xPercent: -45, ease: 'none', scrollTrigger: st });
        gsap.utils.toArray('.notes__photo').forEach((el) => {
          const speed = Number(el.dataset.speed);
          gsap.fromTo(el, { yPercent: speed * 35 }, { yPercent: -speed * 35, ease: 'none', scrollTrigger: st });
          gsap.fromTo(
            el.querySelector('.notes__photo-frame'),
            { clipPath: 'inset(18% 18% 18% 18%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center 60%', scrub: true } }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="notes" aria-label="Field notes — life off-screen">
      <div className="notes__head">
        <p className="mono">
          <span className="accent">(—)</span> Off-screen
        </p>
        <p className="serif notes__quote">Good ideas rarely show up behind a desk.</p>
      </div>

      <div className="notes__stage">
        <div className="notes__type" aria-hidden="true">
          <div className="notes__type-inner display">{phrase}</div>
        </div>

        {fieldNotes.images.map((img, i) => (
          <figure key={img.src} className={`notes__photo notes__photo--${i + 1}`} data-speed={[0.5, 1, 0.3, 0.8][i]}>
            <div className="notes__photo-frame">
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
            <figcaption className="mono">Field note 0{i + 1}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
