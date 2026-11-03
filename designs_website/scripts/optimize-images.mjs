// Converts everything in public/images into resized WebP files in public/images/web/.
// Run `npm run images` after adding or replacing photos.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const src = path.resolve('public/images');
const out = path.join(src, 'web');
await mkdir(out, { recursive: true });

for (const file of await readdir(src)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const name = file.replace(/\.(jpe?g|png)$/i, '');
  await sharp(path.join(src, file))
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(out, `${name}.webp`));
  console.log('✓', name);
}
