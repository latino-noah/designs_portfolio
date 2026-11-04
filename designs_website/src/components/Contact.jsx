import { useRef, useState } from 'react';
import { gsap, useGSAP, SplitText, MOTION, FINE_POINTER, scrollToTarget } from '../lib/motion';
import { person } from '../data/content';
import { ridgePath } from '../lib/ridges';
import { Magnetic, RollText, Arrow, useLocalTime } from './ui';
import './Contact.css';

const RIDGE = ridgePath({ seed: 31, base: 0.7, amp: 0.3, peaks: [{ x: 0.3, h: 0.35, w: 0.07 }, { x: 0.78, h: 0.25, w: 0.05 }], width: 1600, height: 300, detail: 8 });

/** variant="bar": only the bottom strip, for pages that end with their own contact section. */
export default function Contact({ variant = 'full' }) {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);
  const time = useLocalTime(person.timezone);

  useGSAP(
    () => {
      if (variant === 'bar') return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // The sun rises behind the headline as you arrive — bookending the hero sunset.
        gsap.fromTo(
          '.contact__sun',
          { yPercent: 70, scale: 0.7 },
          { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'clamp(top 10%)', scrub: true } }
        );
        gsap.fromTo(
          '.contact__ridge',
          { yPercent: 60 },
          { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'clamp(top 20%)', scrub: true } }
        );
        gsap.utils.toArray('.contact__line').forEach((line, i) => {
          gsap.fromTo(
            line,
            { xPercent: i % 2 ? 18 : -18 },
            { xPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'clamp(top 30%)', scrub: true } }
          );
        });

        const split = SplitText.create('.contact__line--split', { type: 'chars', charsClass: 'contact__char' });
        gsap.from(split.chars, {
          yPercent: 100,
          duration: 1.4,
          stagger: 0.025,
          scrollTrigger: { trigger: '.contact__title', start: 'top 75%' },
        });

        // Interactive typography: characters near the cursor stretch wider.
        if (!window.matchMedia(FINE_POINTER).matches) return;
        const chars = split.chars.map((el) => ({ el, to: gsap.quickTo(el, '--w', { duration: 0.6, ease: 'power3' }) }));
        const title = root.current.querySelector('.contact__title');
        const move = (e) => {
          chars.forEach(({ el, to }) => {
            const r = el.getBoundingClientRect();
            const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
            to(gsap.utils.mapRange(0, 380, 125, 75, Math.min(d, 380)));
          });
        };
        const leave = () => chars.forEach(({ to }) => to(100));
        title.addEventListener('pointermove', move);
        title.addEventListener('pointerleave', leave);
        return () => {
          title.removeEventListener('pointermove', move);
          title.removeEventListener('pointerleave', leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  const bottom = (
    <div className="contact__bottom mono">
      <span>
        © {new Date().getFullYear()} {person.firstName} {person.lastName}
      </span>
      <span>
        {person.city} {time} — {person.coords}
      </span>
      <span>Designed &amp; built by hand</span>
      <button onClick={() => scrollToTarget(0, { duration: 2.6 })} className="contact__top">
        <RollText>Back to summit</RollText> <Arrow dir="n" />
      </button>
    </div>
  );

  if (variant === 'bar') {
    return (
      <footer ref={root} className="contact contact--bar">
        <div className="contact__inner">{bottom}</div>
      </footer>
    );
  }

  return (
    <footer ref={root} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__sun" aria-hidden="true" />
      <svg className="contact__ridge" viewBox="0 0 1600 300" preserveAspectRatio="none" aria-hidden="true">
        <path d={RIDGE} />
      </svg>

      <div className="contact__inner">
        <p className="mono contact__label">
          <span className="accent">(05)</span> Contact — {person.available}
        </p>

        <h2 id="contact-title" className="contact__title">
          <span className="contact__line contact__line--1">
            <span className="contact__line--split">Let&rsquo;s</span>
          </span>
          <span className="contact__line contact__line--2 serif">create</span>
          <span className="contact__line contact__line--3">
            <span className="contact__line--split">something</span>
          </span>
        </h2>

        <div className="contact__cta">
          <Magnetic strength={0.3} className="contact__button-wrap">
            <a className="contact__button" href={`mailto:${person.email}`}>
              <span className="contact__button-fill" aria-hidden="true" />
              <span className="contact__button-text">
                Get in touch <Arrow />
              </span>
            </a>
          </Magnetic>

          <div className="contact__links">
            <div className="contact__mail-row">
              <a className="contact__mail serif" href={`mailto:${person.email}`}>
                <RollText>{person.email}</RollText>
              </a>
              <button className="contact__copy mono" onClick={copy} aria-live="polite">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <ul className="contact__socials">
              {person.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    <span className="mono">{s.label}</span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {bottom}
      </div>
    </footer>
  );
}
