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

// Work section: mouse-follow image preview with velocity distortion
(function () {
  const section = document.querySelector('.work');
  const preview = document.querySelector('.work-preview');
  const previewImg = document.querySelector('.work-preview-img');
  const items = document.querySelectorAll('.work-item');

  if (!section || !preview || !previewImg || !items.length) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduceMotion) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  let scale = 0, targetScale = 0;
  let lastX = 0, velocityX = 0;
  let active = false;

  section.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      previewImg.src = item.dataset.img;
      targetScale = 1;
      active = true;
      preview.classList.add('is-active');
    });
    item.addEventListener('mouseleave', () => {
      targetScale = 0.6;
      active = false;
      preview.classList.remove('is-active');
    });
  });

  function tick() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    scale += (targetScale - scale) * 0.15;

    velocityX = (mouseX - lastX) * 0.6;
    lastX = mouseX;
    const skew = Math.max(-18, Math.min(18, velocityX));

    preview.style.transform =
      `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%) scale(${scale}) skewX(${skew}deg)`;

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
