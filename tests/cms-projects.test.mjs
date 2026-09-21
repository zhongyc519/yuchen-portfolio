import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

async function loadAdapter({config = {}, fetchImpl = async () => ({ok: true, json: async () => ({result: {projects: [], categories: []}})})} = {}) {
  const source = await readFile(new URL('../cms-projects.js', import.meta.url), 'utf8');
  const context = {URL, fetch: fetchImpl, console, setTimeout, clearTimeout, globalThis: null, window: null};
  context.globalThis = context;
  context.window = context;
  context.SANITY_PUBLIC_CONFIG = config;
  vm.runInNewContext(source, context);
  return context.portfolioCms;
}

test('normalizes, orders and filters CMS projects for the existing UI', async () => {
  const adapter = await loadAdapter();
  const payload = {
    categories: [{slug: 'visual', titleEn: 'Visual', titleZh: '视觉', displayOrder: 20}],
    projects: [
      {_id: 'hidden', visibility: 'hidden', displayOrder: 1, titleEn: 'Hidden'},
      {_id: 'second', visibility: 'public', displayOrder: 20, titleEn: 'Second', titleZh: '第二', tagEn: 'TAG', tagZh: '标签', category: {slug: 'visual'}},
      {_id: 'first', visibility: 'public', displayOrder: 10, titleEn: 'First', titleZh: '第一', category: {slug: 'visual'}},
    ],
  };
  const result = adapter.normalizePayload(payload, [], []);
  assert.deepEqual(Array.from(result.projects, project => project.en), ['First', 'Second']);
  assert.equal(result.projects[0].category, 'visual');
  assert.deepEqual(Array.from(result.categories[1]), ['visual', 'Visual', '视觉']);
});

test('normalizes flexible sections and infers AUTO image layout from aspect ratio', async () => {
  const adapter = await loadAdapter();
  const result = adapter.normalizePayload({projects: [{
    _id: 'project', visibility: 'public', titleEn: 'Project', titleZh: '项目', displayOrder: 10,
    sections: [{number: '01', labelEn: 'Process', labelZh: '过程', headingEn: 'A heading', headingZh: '标题', bodyEn: 'Body', bodyZh: '正文', displayOrder: 10, images: [
      {layoutMode: 'AUTO', altEn: 'Wide', altZh: '宽图', asset: {url: 'https://cdn.sanity.io/images/p/d/a.jpg', metadata: {dimensions: {aspectRatio: 2}}}},
      {layoutMode: 'AUTO', altEn: 'Portrait', altZh: '竖图', asset: {url: 'https://cdn.sanity.io/images/p/d/b.jpg', metadata: {dimensions: {aspectRatio: .7}}}},
    ]}],
  }], categories: []}, [], []);
  const [section] = result.projects[0].sections;
  assert.equal(section.headingEn, 'A heading');
  assert.deepEqual(Array.from(section.images, image => image.layout), ['wide', 'portrait']);
  assert.match(section.images[0].src, /w=1800/);
});

test('loads published CMS data and falls back silently on network failure or empty content', async () => {
  const fallbackProjects = [{en: 'Fallback'}];
  const fallbackCategories = [['all', 'All Work', '全部作品']];
  const failing = await loadAdapter({config: {projectId: 'abc123', dataset: 'production', apiVersion: '2026-09-21'}, fetchImpl: async () => { throw new Error('offline'); }});
  const failedResult = await failing.loadProjects(fallbackProjects, fallbackCategories);
  assert.equal(failedResult.source, 'fallback');
  assert.equal(failedResult.projects[0].en, 'Fallback');

  let requestedUrl = '';
  const empty = await loadAdapter({config: {projectId: 'abc123', dataset: 'production', apiVersion: '2026-09-21'}, fetchImpl: async url => { requestedUrl = String(url); return {ok: true, json: async () => ({result: {projects: [], categories: []}})}; }});
  const emptyResult = await empty.loadProjects(fallbackProjects, fallbackCategories);
  assert.equal(emptyResult.source, 'fallback');
  assert.match(requestedUrl, /perspective=published/);
  assert.doesNotMatch(requestedUrl, /token=/);
});

