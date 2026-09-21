import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('migration seed preserves every existing Selected Work project and category', async () => {
  const lines = (await read('studio/seed/selected-work.ndjson')).trim().split(/\r?\n/).map(JSON.parse);
  const projects = lines.filter(document => document._type === 'project');
  const categories = lines.filter(document => document._type === 'category');
  assert.equal(projects.length, 9);
  assert.equal(categories.length, 5);
  assert.deepEqual(projects.map(project => project.displayOrder), [10,20,30,40,50,60,70,80,90]);
  assert.ok(projects.every(project => project.visibility === 'preview'));
  const camp = projects.find(project => project.tagEn === 'CAMP WOW');
  assert.equal(camp.sections.length, 8);
  assert.ok(camp.sections.some(section => section.images?.some(image => image.migrationSourcePath?.includes('camp-wow-64.jpg'))));
});

test('seed generator reads the current local content rather than a second hand-written copy', async () => {
  const script = await read('scripts/export-cms-seed.mjs');
  assert.match(script, /content\.js/);
  assert.match(script, /cv-content\.js/);
  assert.match(script, /visibility:\s*'preview'/);
});
