import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
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

const builtIndex = await stat(join(output, 'index.html'));
if (!builtIndex.isFile()) throw new Error('Production build is missing index.html');

console.log('Production site built in dist/');
