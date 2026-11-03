/**
 * Deterministic mountain-ridge generator.
 * 1D midpoint displacement + optional sharp "peaks" so we can place
 * summits exactly where the hero name needs to be masked.
 */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param {object} o
 * @param {number} o.seed
 * @param {number} o.base   baseline as fraction of height (0 top, 1 bottom)
 * @param {number} o.amp    noise amplitude as fraction of height
 * @param {Array<{x:number,h:number,w:number}>} [o.peaks] summits (fractions): position, height, spread
 * @param {number} [o.detail] 2^detail segments
 * @param {number} [o.roughness]
 */
export function ridgePath({ seed, base, amp, peaks = [], detail = 8, roughness = 0.56, width = 1600, height = 1000 }) {
  const rand = mulberry32(seed);
  const n = 2 ** detail;
  const pts = new Array(n + 1).fill(0);
  pts[0] = (rand() - 0.5) * amp;
  pts[n] = (rand() - 0.5) * amp;

  let step = n;
  let scale = amp;
  while (step > 1) {
    const half = step / 2;
    for (let i = half; i < n; i += step) {
      pts[i] = (pts[i - half] + pts[i + half]) / 2 + (rand() - 0.5) * scale;
    }
    step = half;
    scale *= roughness;
  }

  let d = `M0 ${height} `;
  for (let i = 0; i <= n; i++) {
    const fx = i / n;
    // Laplacian kernel → pointed summits with concave flanks (reads as rock, not a hill).
    let lift = 0;
    for (const p of peaks) lift += p.h * Math.exp(-Math.abs(fx - p.x) / p.w);
    // Noise grows with height so summits get craggy while valleys stay calm.
    const y = base - lift + pts[i] * (1 + lift * 2.5);
    d += `L${(fx * width).toFixed(1)} ${(y * height).toFixed(1)} `;
  }
  return `${d}L${width} ${height} Z`;
}

/** Open polyline version (no fill) for line-drawing animations. */
export function ridgeLine(opts) {
  return ridgePath(opts)
    .replace(/^M0 \d+ L/, 'M')
    .replace(/ L\d+ \d+ Z$/, '');
}
