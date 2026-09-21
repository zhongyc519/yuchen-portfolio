import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('portfolio loads CMS configuration and adapter before the existing renderer', async () => {
  const html = await read('index.html');
  assert.ok(html.indexOf('cms-config.js') < html.indexOf('cms-projects.js'));
  assert.ok(html.indexOf('cms-projects.js') < html.indexOf('app.js'));
});

test('existing renderer hydrates CMS projects without replacing the first fallback render', async () => {
  const app = await read('app.js');
  assert.match(app, /portfolioCms\.loadProjects/);
  assert.match(app, /render\(\);[\s\S]*loadProjects/);
  assert.match(app, /item\.sections/);
  assert.match(app, /data-layout/);
  assert.match(app, /captionEn/);
});

test('production build writes public Sanity config without a token', async () => {
  const build = await read('scripts/build.mjs');
  assert.match(build, /SANITY_PROJECT_ID/);
  assert.match(build, /SANITY_DATASET/);
  assert.match(build, /SANITY_API_VERSION/);
  assert.doesNotMatch(build, /SANITY_API_TOKEN/);
});

test('environment example and owner guide cover daily CMS operations', async () => {
  const env = await read('.env.example');
  const guide = await read('docs/CMS_GUIDE.md');
  assert.match(env, /SANITY_PROJECT_ID=/);
  assert.match(env, /SANITY_STUDIO_PROJECT_ID=/);
  assert.doesNotMatch(env, /token\s*=/i);
  for (const topic of ['create a project','upload a cover','English and Chinese','detail sections','reorder images','Image Layout','reorder projects','preview','publish','hide a project','delete a project','Vercel']) assert.match(guide, new RegExp(topic, 'i'));
});

