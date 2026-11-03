import { useEffect, useRef } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion';
import './Cursor.css';

/**
 * Two-part cursor: a precise dot and a lagging ring.
 * - Links/buttons grow the ring.
 * - Elements with data-cursor="Label" turn the ring into a labelled sun disc.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' });

    let visible = false;
    const move = (e) => {
      if (!visible) {
        visible = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        root.classList.add('cursor-visible');
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest('[data-cursor]');
      const interactive = target?.closest('a, button, [role="button"], input, label');
      const el = ring.current;
      if (labelled) {
        label.current.textContent = labelled.getAttribute('data-cursor');
        el.className = 'cursor-ring is-label';
      } else if (interactive) {
        el.className = 'cursor-ring is-hover';
      } else {
        el.className = 'cursor-ring';
      }
    };

    const leave = () => {
      visible = false;
      root.classList.remove('cursor-visible');
    };
    const down = () => root.classList.add('cursor-down');
    const up = () => root.classList.remove('cursor-down');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      root.classList.remove('has-cursor', 'cursor-visible', 'cursor-down');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-ring__label mono" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
