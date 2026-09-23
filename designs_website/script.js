// Scroll-triggered reveal animations
(function () {
  const revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || !revealEls.length) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Math.min(i * 60, 240);
          setTimeout(() => el.classList.add('is-visible'), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));

  // Hero content reveals immediately on load, staggered
  const heroEls = document.querySelectorAll('.hero .reveal');
  heroEls.forEach((el, i) => {
    observer.unobserve(el);
    setTimeout(() => el.classList.add('is-visible'), 120 + i * 130);
  });
})();
