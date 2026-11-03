import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: 'expo.out', duration: 1.2 });

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Media queries used throughout. Animations live inside gsap.matchMedia(MOTION) so reduced-motion users get static, fully visible content. */
export const MOTION = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia(FINE_POINTER).matches;

/* ------------------------------------------------------------------ */
/* Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync. */

let lenis = null;

export function initLenis() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export function scrollToTarget(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8, easing: easeOutQuart, ...opts });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView();
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle('is-locked', locked);
}
