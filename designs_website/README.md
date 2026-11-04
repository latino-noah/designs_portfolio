# Noah Da Conceição — Portfolio ("Elevation")

React + GSAP (ScrollTrigger, SplitText) + Lenis + Three.js, built with Vite.

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run images    # regenerate optimised WebP files after adding photos
```

## Editing content

Everything you'll want to change lives in **`src/data/content.js`**: name, email, socials, the about text, projects, skills and the timeline. Search for `TODO` to find the placeholders.

Images go in `public/images/`. Run `npm run images` to generate `public/images/web/*.webp`, then point to those files in `content.js`.

## Structure

| File | What it does |
| --- | --- |
| `components/Loader` | Counter tied to real asset loading, a ridge line that draws itself, then an upward wipe |
| `components/Hero` | Procedural mountain layers with the name placed *between* them (foreground masking parallax), mouse depth and a scroll-out |
| `components/About` | Words light up as you scroll (parallax text reveal), inline photo pills, a clip-path portrait reveal and an approach "route" |
| `components/FieldNotes` | Giant type sliding behind floating photos |
| `components/Work` | Pinned horizontal gallery on desktop (vertical stack on mobile) plus a WebGL hover distortion (`lib/distortion.js`); clicking an image or "Visit site" opens the live project |
| `components/Skills` | Sticky stacking panels, variable-width type and "elevation profile" skill indicators |
| `components/Route` | Timeline with a sticky year readout |
| `components/Contact` | Rising sun, characters that stretch near the cursor, a magnetic CTA |
| `pages/Hire` | The Hire me page at `/hire/` (its own entry, `hire/index.html`). Content lives in `hire` in `content.js`; add a project id to `hire.work` to show it there |
| `lib/ridges.js` | Deterministic mountain-ridge generator used across the site |

The mountain shapes in the hero come from the `opts` objects in `Hero.jsx`. Change `seed` for a different range, and `peaks` to move summits behind specific letters.

## Accessibility & performance

- If `prefers-reduced-motion` is set, Lenis, the custom cursor, the pinning and the scroll animations are turned off, and all content stays visible.
- Three.js is loaded only on desktop devices with a fine pointer.
- The menu supports keyboard use: Esc closes it, focus is managed, and the background is made inert.
