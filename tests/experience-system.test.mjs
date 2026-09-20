import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('continuous experience markup and motion hooks exist', async () => {
  const html = await read('index.html');
  const css = await read('experience-system.css');
  const js = await read('experience-system.js');
  for (const id of ['hero-scene', 'thinking-process', 'process-summary', 'method-handoff']) {
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

test('hero exposes four exclusive narrative scenes and resolves with the method signature', async () => {
  const html = await read('index.html');
  const js = await read('experience-system.js');
  for (const hook of ['hero-phase-name', 'hero-proposition-a', 'hero-proposition-b', 'hero-resolution', 'hero-method-signature']) {
    assert.match(html, new RegExp(hook));
  }
  assert.equal((html.match(/data-hero-scene=/g) || []).length, 4);
  assert.doesNotMatch(html, /hero-discipline-scene/);
  assert.doesNotMatch(html, /hero-continuity-line/);
  assert.match(js, /setHeroScene/);
});

test('about preserves approved evidence without an arbitrary narrative spine', async () => {
  const html = await read('index.html');
  assert.doesNotMatch(html, /narrative-spine/);
  assert.match(html, /about-portrait/);
  assert.match(html, />40\+</);
  assert.match(html, />10\+</);
});

test('experience remains credible and no longer duplicates project case studies', async () => {
  const html = await read('index.html');
  const css = await read('experience-system.css');
  for (const evidence of ['5LMEET', 'PAN-CHINA CONSTRUCTION GROUP', 'University of Aberdeen', 'University of the Arts London', 'Shrewsbury School']) {
    assert.match(html, new RegExp(evidence));
  }
  assert.doesNotMatch(html, /class="career-selected"/);
  assert.doesNotMatch(css, /career-detail li:nth-child\(n\+4\)\s*\{\s*display:\s*none/);
  assert.doesNotMatch(html, /id="experience-bridge"/);
});

test('thinking process contains all six stages and replaces the card grid', async () => {
  const html = await read('index.html');
  const content = await read('content.js');
  const app = await read('app.js');
  assert.doesNotMatch(html, /id="capabilities-grid"/);
  assert.match(html, /id="thinking-process"/);
  for (const stage of ['INSIGHT', 'STRATEGY', 'CONCEPT', 'STORYTELLING', 'ALIGNMENT', 'EXECUTION']) {
    assert.match(content, new RegExp(stage));
  }
  assert.match(content, /洞察/);
  assert.match(content, /执行/);
  assert.match(app, /processIconSvg/);
  assert.match(app, /class="process-icon"/);
  assert.match(html, /id="process-summary"/);
  assert.match(html, /class="thinking-header-rule"/);
  assert.ok((html.match(/<circle\b/g) || []).length >= 13);
  assert.match(await read('experience-system.css'), /anchor-alias#capabilities[^}]*padding:\s*0!important/);
});

test('one top-level thinking timeline owns the pinned sequence', async () => {
  const js = await read('experience-system.js');
  assert.match(js, /id:\s*['"]thinking-sequence['"]/);
  assert.match(js, /const process = document\.querySelector\(['"]#thinking-process['"]\)/);
  assert.match(js, /trigger:\s*process/);
  assert.match(js, /pin:\s*true/);
  assert.match(js, /scrub:\s*(?:0?\.\d+|\d+)/);
  assert.match(js, /nodes\.length\s*!==\s*15/);
  assert.match(js, /scatterShapes/);
  assert.match(js, /orbitOffsets/);
});

test('method handoff replaces the unowned proof word and preserves work controls', async () => {
  const html = await read('index.html');
  for (const id of ['method-handoff', 'work-filters', 'work-grid', 'case-dialog']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.doesNotMatch(html, />PROOF</);
});

test('liquid actions have pointer-aware and reduced-motion fallbacks', async () => {
  const html = await read('index.html');
  const css = await read('experience-system.css');
  const js = await read('experience-system.js');
  assert.match(html, /liquid-action/);
  assert.match(css, /--pointer-x/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(js, /pointermove/);
});

test('reduced motion keeps core narrative content visible', async () => {
  const css = await read('experience-system.css');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.process-stage[^}]*opacity:\s*1/s);
  assert.match(css, /clip-path:\s*none/);
});
