import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Sanity Studio exposes owner-friendly project, section, image and category schemas', async () => {
  const project = await read('studio/schemaTypes/project.ts');
  const section = await read('studio/schemaTypes/projectSection.ts');
  const image = await read('studio/schemaTypes/projectImage.ts');
  const category = await read('studio/schemaTypes/category.ts');
  for (const field of ['titleEn','titleZh','slug','summaryEn','summaryZh','tagEn','tagZh','year','clientLabel','roleEn','roleZh','category','coverImage','featured','displayOrder','visibility','sections']) assert.match(project, new RegExp(String.raw`name:\s*['"]${field}['"]`));
  for (const field of ['number','labelEn','labelZh','headingEn','headingZh','bodyEn','bodyZh','images','displayOrder']) assert.match(section, new RegExp(String.raw`name:\s*['"]${field}['"]`));
  for (const field of ['image','altEn','altZh','captionEn','captionZh','layoutMode']) assert.match(image, new RegExp(String.raw`name:\s*['"]${field}['"]`));
  assert.match(project, /hotspot:\s*true/);
  assert.match(project, /Public on website/);
  assert.match(project, /Preview only/);
  assert.match(project, /Hidden/);
  assert.match(image, /AUTO/);
  assert.match(image, /WIDE/);
  assert.match(image, /STANDARD/);
  assert.match(image, /PORTRAIT/);
  assert.match(category, /displayOrder/);
});

test('Studio keeps built-in duplicate, delete, publish and unpublish actions available', async () => {
  const config = await read('studio/sanity.config.ts');
  assert.match(config, /structureTool/);
  assert.doesNotMatch(config, /actions:\s*\([^)]*\)\s*=>\s*\[\s*\]/);
});
