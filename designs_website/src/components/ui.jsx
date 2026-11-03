import { useEffect, useRef, useState } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion';

/** Text that rolls up to reveal a duplicate on hover. */
export function RollText({ children, dupClassName = '' }) {
  return (
    <span className="roll">
      <span className="roll__inner">
        <span>{children}</span>
        <span className={`roll__dup ${dupClassName}`} aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}

/** Pulls its child toward the cursor; springs back on leave. Desktop only. */
export function Magnetic({ children, strength = 0.35, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const ease = 'elastic.out(1, 0.35)';
    const xTo = gsap.quickTo(el, 'x', { duration: 1, ease });
    const yTo = gsap.quickTo(el, 'y', { duration: 1, ease });

    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);

  return (
    <Tag ref={ref} className={`magnetic ${className}`}>
      {children}
    </Tag>
  );
}

/** Live local time for a timezone, e.g. "14:22". */
export function useLocalTime(timeZone) {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}

export function Arrow({ dir = 'ne', className = '' }) {
  const rotate = { ne: 0, e: 45, s: 135, n: -45, w: -135 }[dir] ?? 0;
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 12 12" width="0.8em" height="0.8em" aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M2 10 L10 2 M3.5 2 H10 V8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
