import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('continuous experience markup and motion hooks exist', async () => {
  const html = await read('index.html');
  const css = await read('experience-system.css');
  const js = await read('experience-system.js');
  for (const id of ['hero-scene', 'experience-bridge', 'thinking-process', 'proof-transition']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(css, /--ease-cinematic:\s*cubic-bezier\(\.19,\s*1,\s*\.22,\s*1\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(js, /gsap\.matchMedia\(\)/);
  assert.match(js, /ScrollTrigger/);
});

test('experience system loads after content rendering and GSAP', async () => {
  const html = await read('index.html');
  assert.ok(html.indexOf('app.js') < html.indexOf('experience-system.js'));
  assert.ok(html.indexOf('ScrollTrigger.min.js') < html.indexOf('experience-system.js'));
});

test('primary navigation anchors resolve to real page targets', async () => {
  const html = await read('index.html');
  const nav = html.match(/<nav[\s\S]*?<\/nav>/)?.[0] || '';
  const targets = [...nav.matchAll(/href=["']#([^"']+)["']/g)].map(match => match[1]);
  assert.ok(targets.length >= 5);
  for (const target of targets) assert.match(html, new RegExp(`id=["']${target}["']`));
});

test('hero exposes five phases and a continuity line', async () => {
  const html = await read('index.html');
  for (const hook of ['hero-phase-name', 'hero-proposition-a', 'hero-proposition-b', 'hero-disciplines', 'hero-cta', 'hero-continuity-line']) {
    assert.match(html, new RegExp(hook));
  }
});

test('about preserves approved evidence and the narrative spine', async () => {
  const html = await read('index.html');
  assert.match(html, /class="[^"]*narrative-spine/);
  assert.match(html, /about-portrait/);
  assert.match(html, />40\+</);
  assert.match(html, />10\+</);
});

test('experience remains credible and no longer duplicates project case studies', async () => {
  const html = await read('index.html');
  for (const evidence of ['5LMEET', 'PAN-CHINA CONSTRUCTION GROUP', 'University of Aberdeen', 'University of the Arts London', 'Shrewsbury School']) {
    assert.match(html, new RegExp(evidence));
  }
  assert.doesNotMatch(html, /class="career-selected"/);
  assert.match(html, /id="experience-bridge"/);
  for (const stage of ['RESEARCH', 'CONCEPT', 'EXPERIENCE', 'DELIVERY']) assert.match(html, new RegExp(`>${stage}<`));
});

test('thinking process contains all six stages and replaces the card grid', async () => {
  const html = await read('index.html');
  const content = await read('content.js');
  assert.doesNotMatch(html, /id="capabilities-grid"/);
  assert.match(html, /id="thinking-process"/);
  for (const stage of ['INSIGHT', 'STRATEGY', 'CONCEPT', 'STORYTELLING', 'ALIGNMENT', 'EXECUTION']) {
    assert.match(content, new RegExp(stage));
  }
  assert.match(content, /洞察/);
  assert.match(content, /执行/);
});

test('one top-level thinking timeline owns the pinned sequence', async () => {
  const js = await read('experience-system.js');
  assert.match(js, /id:\s*['"]thinking-sequence['"]/);
  assert.match(js, /trigger:\s*['"]#thinking-process['"]/);
  assert.match(js, /pin:\s*true/);
  assert.match(js, /scrub:\s*(?:0?\.\d+|\d+)/);
});

test('proof bridge preserves selected work controls and dialogs', async () => {
  const html = await read('index.html');
  for (const id of ['proof-transition', 'work-filters', 'work-grid', 'case-dialog']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test('reduced motion keeps core narrative content visible', async () => {
  const css = await read('experience-system.css');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.process-stage[^}]*opacity:\s*1/s);
  assert.match(css, /clip-path:\s*none/);
});
