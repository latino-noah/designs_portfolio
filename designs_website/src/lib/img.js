import manifest from '../data/image-sizes.json';

/**
 * Responsive image helpers. `npm run images` writes name.webp plus smaller name-480/-960.webp
 * variants and records the real widths in image-sizes.json.
 */

/** Display widths per layout slot — keep in sync with the CSS. */
export const SIZES = {
  aboutPortrait: '(max-width: 900px) 84vw, 30vw',
  notes: '(max-width: 760px) 44vw, 26vw',
  project: '(max-width: 899px) 110vw, 56vw',
  hireHero: '(max-width: 560px) 84vw, (max-width: 900px) 72vw, 32vw',
  hireFrame: '(max-width: 900px) 92vw, 58vw',
};

const meta = (src) => manifest[src.match(/\/([^/]+)\.webp$/)?.[1]];

/** { src, srcSet } for an optimised image; just { src } for anything else. */
export function responsive(src) {
  const m = meta(src);
  if (!m) return { src };
  const base = src.replace(/\.webp$/, '');
  const srcSet = [...m.variants.map((w) => `${base}-${w}.webp ${w}w`), `${src} ${m.width}w`].join(', ');
  return { src, srcSet };
}

/** The smallest file that is at least `width` px wide (for posters, tiny thumbnails, etc.). */
export function sized(src, width) {
  const m = meta(src);
  const w = m?.variants.find((v) => v >= width);
  return w ? src.replace(/\.webp$/, `-${w}.webp`) : src;
}

/** Warm the cache with the same candidate the <img> will pick. */
export function preloadImage(src, sizes) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    const { srcSet } = responsive(src);
    if (srcSet && sizes) {
      img.sizes = sizes;
      img.srcset = srcSet;
    }
    img.src = src;
  });
}
