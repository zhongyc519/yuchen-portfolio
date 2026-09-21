import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const directories = ['assets', 'vendor'];
const publicExtensions = new Set(['.html', '.css', '.js']);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of await readdir(root)) {
  const source = join(root, entry);
  const info = await stat(source);
  if (info.isFile() && publicExtensions.has(extname(entry))) {
    await cp(source, join(output, entry));
  }
}

for (const directory of directories) {
  await cp(join(root, directory), join(output, directory), { recursive: true });
}

const publicCmsConfig = {
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2026-09-21',
};
await writeFile(join(output, 'cms-config.js'), `window.SANITY_PUBLIC_CONFIG=${JSON.stringify(publicCmsConfig)};\n`, 'utf8');

const builtIndex = await stat(join(output, 'index.html'));
if (!builtIndex.isFile()) throw new Error('Production build is missing index.html');

console.log('Production site built in dist/');
