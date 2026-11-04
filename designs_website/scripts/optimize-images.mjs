// Converts everything in public/images into WebP files in public/images/web/:
//   name.webp      — up to 1800px (the default `src`)
//   name-960.webp  — for tablets / phones at 2x
//   name-480.webp  — for small slots and phones
// and writes src/data/image-sizes.json so components can build an accurate `srcset`.
// Run `npm run images` after adding or replacing photos.
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const src = path.resolve('public/images');
const out = path.join(src, 'web');
const manifestPath = path.resolve('src/data/image-sizes.json');
const VARIANTS = [480, 960];

await mkdir(out, { recursive: true });
const manifest = {};

for (const file of (await readdir(src)).sort()) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const name = file.replace(/\.(jpe?g|png)$/i, '');
  const input = path.join(src, file);

  const full = await sharp(input)
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(out, `${name}.webp`));

  const widths = [];
  for (const w of VARIANTS) {
    if (w >= full.width) continue; // no point in a variant that isn't smaller
    await sharp(input).resize({ width: w }).webp({ quality: 74 }).toFile(path.join(out, `${name}-${w}.webp`));
    widths.push(w);
  }

  manifest[name] = { width: full.width, height: full.height, variants: widths };
  console.log('✓', name, `${full.width}×${full.height}`, widths.length ? `+ ${widths.join(', ')}` : '');
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('→', path.relative(process.cwd(), manifestPath));
