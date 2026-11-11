import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, MOTION, initLenis, scrollToTarget, prefersReducedMotion } from '../lib/motion';
import { person, hire, projects } from '../data/content';
import { Arrow, RollText } from '../components/ui';
import { responsive, sized, SIZES } from '../lib/img';
import Cursor from '../components/Cursor';
import Nav from '../components/Nav';
import Contact from '../components/Contact';
import './Hire.css';

const pad = (n) => String(n).padStart(2, '0');

/** Headline line with a mask, so the text can rise into view. */
const Line = ({ children, className = '' }) => (
  <span className={`hl ${className}`}>
    <span>{children}</span>
  </span>
);

/** Image in a clipped frame; the inner layer is taller than the frame so it can drift on scroll. */
const Frame = ({ src, alt, className = '', width, height, eager, sizes = SIZES.hireFrame, as: Tag = 'div', ...rest }) => (
  <Tag className={`frame ${className}`} data-media {...rest}>
    <div className="frame__inner">
      <img
        {...responsive(src)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding={eager ? undefined : 'async'}
      />
    </div>
  </Tag>
);

/**
 * Muted looping clip in the same frame. Nothing (not even the poster) is fetched until it's
 * about a screen away; it plays only while on screen. With reduced motion it waits for the viewer.
 */
function FrameVideo({ src, poster, label, className = '' }) {
  const ref = useRef(null);
  const [reduced] = useState(prefersReducedMotion);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const nearby = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        nearby.disconnect();
      },
      { rootMargin: '100% 0px' }
    );
    nearby.observe(v);
    return () => nearby.disconnect();
  }, []);

  // Start observing visibility only once the source is set, so play() never races an empty <video>.
  useEffect(() => {
    const v = ref.current;
    if (!v || !near || reduced) return;
    const visible = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      rootMargin: '10% 0px',
    });
    visible.observe(v);
    return () => visible.disconnect();
  }, [near, reduced]);

  return (
    <div className={`frame ${className}`} data-media>
      <div className="frame__inner">
        <video
          ref={ref}
          src={near ? src : undefined}
          poster={near ? sized(poster, 960) : undefined}
          muted
          loop
          playsInline
          preload={near ? 'metadata' : 'none'}
          controls={reduced}
          aria-label={label}
        />
      </div>
    </div>
  );
}

const SectionLabel = ({ n, children }) => (
  <p className="mono hire-label" data-fade>
    <span className="accent">({n})</span> {children}
  </p>
);

/* ------------------------------------------------------------------ */

function Hero() {
  const go = (e, target) => {
    e.preventDefault();
    scrollToTarget(target);
  };
  return (
    <section className="hh" aria-labelledby="hire-title">
      <div className="hh__top mono" data-intro>
        <span>
          <span className="accent">(—)</span> Hire me
        </span>
        <span className="hh__status">
          <i className="hh__dot" aria-hidden="true" /> {hire.availability}
        </span>
      </div>

      <div className="hh__grid">
        <h1 id="hire-title" className="hh__title display">
          <Line>Let&rsquo;s create</Line>
          <Line className="hl--serif">
            <span className="serif">something</span>
          </Line>
          <Line>remarkable.</Line>
        </h1>

        <figure className="hh__figure">
          <Frame
            className="hh__media"
            src={hire.heroImage}
            alt={hire.heroAlt}
            width="788"
            height="1400"
            sizes={SIZES.hireHero}
            eager
          />
          <figcaption className="mono hire-caption" data-intro>
            <span>Fig. 01</span>
            <span>Take the leap</span>
          </figcaption>
        </figure>

        <div className="hh__body">
          <p className="hh__lead" data-intro>
            Websites, photos and video for brands and businesses, designed and made by one person from start to finish.
          </p>
          <p className="hh__intro" data-intro>
            I&rsquo;m {person.firstName}, a creative from {person.city}. You can hire me for:
          </p>
          <ul className="hh__services" data-intro>
            {hire.services.map((s) => (
              <li key={s.n}>
                <a href={`#service-${s.n}`} onClick={(e) => go(e, `#service-${s.n}`)}>
                  <span className="mono accent">{s.n}</span> {s.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="hire-ctas" data-intro>
            <a className="pill pill--solid" href="#contact" onClick={(e) => go(e, '#contact')}>
              Let&rsquo;s work together <Arrow />
            </a>
            <a className="pill" href="#services" onClick={(e) => go(e, '#services')}>
              Explore my services <Arrow dir="s" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="hs section" aria-labelledby="services-title">
      <header className="hire-head">
        <div>
          <SectionLabel n="01">Services</SectionLabel>
          <h2 id="services-title" className="hire-head__title display" data-lines>
            <Line>What I</Line>
            <Line className="hl--serif">
              <span className="serif accent">do</span>
            </Line>
          </h2>
        </div>
        <p className="hire-head__text" data-fade>
          Five services you can book on their own or combine, for example a new website with photos and video to
          go with it.
        </p>
      </header>

      <ol className="hs__list">
        {hire.services.map((s, i) => (
          <li key={s.n} id={`service-${s.n}`} className={`svc svc--${i + 1}`}>
            <p className="svc__meta mono" data-fade>
              <span className="accent">{s.n}</span>
              <span className="svc__rule" aria-hidden="true" />
              <span>{s.label}</span>
            </p>
            {s.video ? (
              <FrameVideo className="svc__media" src={s.video} poster={s.image} label={s.alt} />
            ) : (
              <Frame className="svc__media" src={s.image} alt={s.alt} />
            )}
            <div className="svc__body" data-fade>
              <h3 className="svc__title display">{s.title}</h3>
              <p className="svc__text">{s.text}</p>
              {s.deliverables && (
                <ul className="svc__list" aria-label={`What you get with ${s.title}`}>
                  {s.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AboutMe() {
  return (
    <section id="about-me" className="ha section" aria-labelledby="about-me-title">
      <SectionLabel n="02">About me</SectionLabel>
      <h2 id="about-me-title" className="ha__title display" data-lines>
        <Line>Design minded.</Line>
        <Line className="ha__indent">Detail driven.</Line>
        <Line>
          Always <span className="serif accent">creating.</span>
        </Line>
      </h2>

      <div className="ha__grid">
        <figure className="ha__figure">
          <Frame className="ha__media" src={hire.about.image} alt={hire.about.alt} width="950" height="633" />
          <figcaption className="mono hire-caption" data-fade>
            <span>Fig. 02</span>
            <span>{person.firstName}, off-screen</span>
          </figcaption>
        </figure>

        <div className="ha__body" data-fade>
          {hire.about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'ha__lead' : 'ha__text'}>
              {p}
            </p>
          ))}
          <a className="pill" href="/#about">
            More about me <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  const items = hire.work
    .map((w) => ({ ...projects.find((p) => p.id === w.id), category: w.category }))
    .filter((p) => p.title);

  return (
    <section id="selected-work" className="hw section" aria-labelledby="selected-work-title">
      <header className="hire-head">
        <div>
          <SectionLabel n="03">Selected work</SectionLabel>
          <h2 id="selected-work-title" className="hire-head__title display" data-lines>
            <Line>Selected</Line>
            <Line className="hl--serif">
              <span className="serif accent">work</span>
            </Line>
          </h2>
        </div>
        <p className="hire-head__text" data-fade>
          A few recent projects, from concept to live site. Each one opens in a new tab.
        </p>
      </header>

      <ul className="hw__grid">
        {items.map((p, i) => (
          <li key={p.id} className="hwk">
            <Frame
              as="a"
              className="hwk__media"
              src={p.image}
              alt={p.alt}
              width="1400"
              height="875"
              href={p.link}
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              aria-label={`View ${p.title} (opens in a new tab)`}
            />
            <div className="hwk__info" data-fade>
              <span className="mono hwk__n">{pad(i + 1)}</span>
              <div>
                <h3 className="hwk__title">{p.title}</h3>
                <p className="mono hwk__cat">
                  {p.category} <span aria-hidden="true">—</span> {p.year}
                </p>
              </div>
              <a className="mono hwk__link" href={p.link} target="_blank" rel="noreferrer">
                <RollText>View project</RollText> <Arrow />
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="hw__more" data-fade>
        <p className="serif">There&rsquo;s more on the main portfolio.</p>
        <a className="pill" href="/#work">
          All projects <Arrow />
        </a>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="hp section" aria-labelledby="process-title">
      <header className="hire-head">
        <div>
          <SectionLabel n="04">Process</SectionLabel>
          <h2 id="process-title" className="hire-head__title display" data-lines>
            <Line>How I</Line>
            <Line className="hl--serif">
              <span className="serif accent">work</span>
            </Line>
          </h2>
        </div>
        <p className="hire-head__text" data-fade>
          Simple, clear and collaborative. You always know where the project stands.
        </p>
      </header>

      <ol className="hp__steps">
        {hire.process.map((s) => (
          <li key={s.n} className="hp__step">
            <span className="hp__line" aria-hidden="true" />
            <div data-fade>
              <span className="mono accent">{s.n}</span>
              <h3 className="hp__title display">{s.title}</h3>
              <p className="hp__text">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);

  // No backend: compose the enquiry in the visitor's own email app.
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name').trim();
    const subject = `${data.get('type')} project — ${name}`;
    const body = `${data.get('message').trim()}\n\n— ${name}\n${data.get('email').trim()}`;
    window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="hf" onSubmit={submit} data-fade>
      <div className="hf__row">
        <label className="hf__field">
          <span className="mono hf__label">01 — Name</span>
          <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
        </label>
        <label className="hf__field">
          <span className="mono hf__label">02 — Email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </label>
      </div>
      <label className="hf__field hf__field--select">
        <span className="mono hf__label">03 — Project type</span>
        <select name="type" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {hire.projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="hf__field">
        <span className="mono hf__label">04 — Message</span>
        <textarea name="message" rows="4" required placeholder="Tell me about the project, timing and budget" data-lenis-prevent />
      </label>
      <div className="hf__foot">
        <p className="mono hf__note" aria-live="polite">
          {sent ? (
            <>
              Opening your email app. Nothing happened?{' '}
              <a href={`mailto:${person.email}`}>Email me directly</a>.
            </>
          ) : (
            'Opens your email app with everything filled in.'
          )}
        </p>
        <button type="submit" className="pill pill--solid">
          Send message <Arrow />
        </button>
      </div>
    </form>
  );
}

function HireContact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contact" className="hc section" aria-labelledby="hc-title">
      <div className="hc__glow" aria-hidden="true" />
      <SectionLabel n="05">Contact — {hire.availability}</SectionLabel>
      <h2 id="hc-title" className="hc__title display" data-lines>
        <Line>Have a project</Line>
        <Line>
          in <span className="serif accent">mind?</span>
        </Line>
      </h2>

      <div className="hc__grid">
        <div className="hc__side">
          <p className="hc__lead" data-fade>
            Tell me what you need using the form, or email me directly. A rough idea is enough to start.
          </p>

          <div className="contact__mail-row" data-fade>
            <a className="contact__mail serif hc__mail" href={`mailto:${person.email}`}>
              <RollText>{person.email}</RollText>
            </a>
            <button className="contact__copy mono" onClick={copy} aria-live="polite">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="hc__actions" data-fade>
            <ul className="contact__socials hc__socials">
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

        <ContactForm />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function Hire() {
  const root = useRef(null);

  useEffect(() => initLenis(), []);
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // Hero: headline rises line by line while the photo unveils from below.
        gsap
          .timeline({ delay: 0.25 })
          .from('.hh .hl > span', { yPercent: 115, duration: 1.7, stagger: 0.09 }, 0)
          .from('.hh__media', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0.05)
          .from('.hh__media img', { scale: 1.3, duration: 2.4 }, 0.15)
          .from('[data-intro]', { y: 28, autoAlpha: 0, duration: 1.3, stagger: 0.07 }, 0.7);

        // Section headlines
        gsap.utils.toArray('[data-lines]').forEach((el) => {
          gsap.from(el.querySelectorAll('.hl > span'), {
            yPercent: 115,
            duration: 1.5,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
        });

        gsap.utils.toArray('[data-fade]').forEach((el) => {
          gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.3, scrollTrigger: { trigger: el, start: 'top 90%' } });
        });

        // Images: clip reveal (not the hero, which has its own intro) + gentle parallax on all of them.
        gsap.utils.toArray('[data-media]').forEach((el) => {
          if (!el.classList.contains('hh__media')) {
            gsap.from(el, {
              clipPath: 'inset(100% 0% 0% 0%)',
              duration: 1.6,
              ease: 'expo.inOut',
              scrollTrigger: { trigger: el, start: 'top 85%' },
            });
          }
          gsap.fromTo(
            el.querySelector('.frame__inner'),
            { yPercent: -5 },
            { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
          );
        });

        gsap.from('.hp__line', {
          scaleX: 0,
          duration: 1.6,
          ease: 'expo.inOut',
          stagger: 0.12,
          scrollTrigger: { trigger: '.hp__steps', start: 'top 80%' },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <a className="skip-link" href="#services">
        Skip to content
      </a>
      <Cursor />
      <Nav ready page="hire" />
      <main id="main" className="hire">
        <Hero />
        <Services />
        <AboutMe />
        <SelectedWork />
        <Process />
        <HireContact />
      </main>
      <Contact variant="bar" />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
