# Coherent Digital Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved portfolio into one continuous cinematic and structured scroll narrative spanning Identity, Experience, Method and Proof without breaking bilingual content, project interactions or deployment.

**Architecture:** Keep the existing static HTML/CSS/JavaScript application and vendored GSAP stack. Add focused scene markup, a shared motion-token layer and one GSAP module that owns the Hero, section bridges and S4 process sequence; preserve content rendering and project-dialog responsibilities in `app.js`.

**Tech Stack:** Semantic HTML, CSS custom properties and responsive layout, vanilla JavaScript, GSAP 3, ScrollTrigger, existing WebGL radiant canvas, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-20-coherent-digital-experience-design.md`

## Global Constraints

- Preserve the existing bilingual content system, language switch, work filtering, project dialogs, guide dialog and contact section.
- Use the existing Inter font files and fallback stack; introduce no new font dependency.
- Radiant colour is atmospheric media only; lime remains the functional accent.
- Use `cubic-bezier(0.19, 1, 0.22, 1)` for the shared cinematic easing.
- Main scene movement lasts approximately `0.8–1.25s`; micro interactions last `0.3–0.5s`.
- Prefer transform, opacity, clip path, mask, scale and SVG stroke animation.
- Preserve complete content with `prefers-reduced-motion: reduce`.
- Avoid horizontal overflow and scroll locking at all supported widths.
- Do not redesign the final contact section or Selected Work gallery system.
- Run production build, automated tests and browser QA before committing and pushing to `main`.

## File Map

- `index.html`: semantic scene markup and content structure for S1, S3 ending, S4 and S5 entrance.
- `experience-system.css`: shared visual tokens, section bridges, S3 compression, S4 process system and responsive/reduced-motion states.
- `experience-system.js`: GSAP contexts and top-level ScrollTrigger timelines for S1–S5 continuity.
- `cinematic.css`: retain existing base styling; remove only rules superseded by the new focused stylesheet.
- `cinematic.js`: retain dialog/anchor integration; disable legacy Hero and capability timelines after the replacement is active.
- `app.js`: render the new S4 stage content in both languages and preserve re-render events.
- `content.js`: store English/Chinese labels, stage inputs and meanings for the six-stage process.
- `tests/experience-system.test.mjs`: static-contract and server checks for markup, content, script order and reduced-motion hooks.
- `scripts/build.mjs`: include new top-level CSS and JavaScript automatically through the existing copy rule.

---

### Task 1: Lock the DOM and motion-system contract

**Files:**
- Create: `tests/experience-system.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: existing `index.html`, `server.mjs` and Node test runner.
- Produces: regression checks for `#hero-scene`, `#experience-bridge`, `#thinking-process`, `#proof-transition`, shared motion tokens and page script order.

- [ ] **Step 1: Add failing structural tests**

Create a Node test that reads `index.html`, `experience-system.css` and `experience-system.js` and checks the required contract:

```js
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
```

- [ ] **Step 2: Run the tests and confirm the missing files fail**

Run: `npm test`

Expected: failure because `experience-system.css` and `experience-system.js` do not exist.

- [ ] **Step 3: Update the test script to include every test file**

Use:

```json
"test": "node --test tests/*.test.mjs"
```

- [ ] **Step 4: Add empty contract files and page includes**

Create `experience-system.css` with the shared tokens and `experience-system.js` with an IIFE guarded by `window.gsap` and `window.ScrollTrigger`. Add both to `index.html` after the existing content and GSAP files.

- [ ] **Step 5: Run the tests**

Run: `npm test`

Expected: contract tests still fail only on missing scene IDs.

- [ ] **Step 6: Commit the test contract**

```powershell
git add package.json tests/experience-system.test.mjs experience-system.css experience-system.js index.html
git commit -m "test: define continuous experience contract"
```

### Task 2: Build the five-phase Hero composition

**Files:**
- Modify: `index.html:19-27`
- Modify: `experience-system.css`
- Modify: `experience-system.js`
- Modify: `cinematic.js:17-50`
- Test: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: `window.radiantState`, `.ember-hero`, `.ember-name`, `.ember-description` and GSAP/ScrollTrigger.
- Produces: `buildHeroTimeline(context)` and `heroTrigger`, used by anchor correction and the S1→S2 bridge.

- [ ] **Step 1: Extend tests for Hero phases**

Assert that `#hero-scene` contains `.hero-phase-name`, `.hero-proposition-a`, `.hero-proposition-b`, `.hero-disciplines`, `.hero-cta` and `.hero-continuity-line`.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/experience-system.test.mjs`

Expected: failure naming the first missing Hero phase.

- [ ] **Step 3: Restructure Hero markup without changing copy**

Wrap existing content in `#hero-scene`; split the proposition into separately addressable spans and preserve the current CTA links, pause button, canvas and accessible heading.

- [ ] **Step 4: Add the full-viewport responsive composition**

Define a minimum `100svh` scene, viewport-cropped name, restrained metadata, late CTA state and a continuity line. Keep the radiant canvas behind all text and ensure content remains selectable and focusable.

- [ ] **Step 5: Implement `buildHeroTimeline`**

Use one timeline:

```js
function buildHeroTimeline({ mobile }) {
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      id: 'hero-sequence',
      trigger: '#hero-scene',
      start: 'top top',
      end: () => `+=${innerHeight * (mobile ? 1.55 : 2.75)}`,
      pin: true,
      scrub: mobile ? 0.45 : 0.75,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });
  timeline
    .to('.ember-name', { scale: mobile ? 0.72 : 0.58, xPercent: mobile ? -8 : -18, yPercent: -28 }, 0.12)
    .fromTo('.hero-proposition-a', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }, 0.28)
    .fromTo('.hero-proposition-b', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }, 0.48)
    .fromTo('.hero-disciplines', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.64)
    .fromTo('.hero-cta', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.78)
    .to('.hero-continuity-line', { scaleY: 1, transformOrigin: 'top' }, 0.82);
  return timeline.scrollTrigger;
}
```

Update `window.radiantState.progress` in the timeline callback without creating a second scroll listener.

- [ ] **Step 6: Disable the old Hero timeline**

Remove or guard the legacy Hero block in `cinematic.js`, keeping anchor correction, font refresh and content-motion behaviour intact.

- [ ] **Step 7: Verify tests and commit**

Run: `npm test`

```powershell
git add index.html experience-system.css experience-system.js cinematic.js tests/experience-system.test.mjs
git commit -m "feat: choreograph immersive hero sequence"
```

### Task 3: Connect Hero to the approved About section

**Files:**
- Modify: `index.html:28-30`
- Modify: `experience-system.css`
- Modify: `experience-system.js`
- Test: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: `.hero-continuity-line`, `#about`, `.about-portrait`, `.cv-evidence`.
- Produces: `buildAboutBridge()` and the persistent `.narrative-spine` element used by S3.

- [ ] **Step 1: Add a test for the narrative spine**

Assert that the About section contains `.narrative-spine` and retains its portrait, section marker and both metric values.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/experience-system.test.mjs`

- [ ] **Step 3: Add the structural spine without changing S2 content**

Insert one decorative line with `aria-hidden="true"`. Use the existing section marker and metrics as endpoints rather than adding a second decorative component.

- [ ] **Step 4: Add low-intensity About motion**

Use one non-pinned ScrollTrigger timeline to reveal the title mask, move the portrait no more than 3% vertically and extend the spine. Apply the shared cinematic duration and ease.

- [ ] **Step 5: Add reduced-motion state**

Ensure the title, portrait, metrics and spine are fully visible without transforms when reduced motion is active.

- [ ] **Step 6: Test and commit**

Run: `npm test`

```powershell
git add index.html experience-system.css experience-system.js tests/experience-system.test.mjs
git commit -m "feat: connect hero and about narrative"
```

### Task 4: Shorten Experience and create its process ending

**Files:**
- Modify: `index.html:31-33`
- Modify: `experience-system.css`
- Modify: `content.js`
- Modify: `cv-content.js`
- Test: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: existing employer, role, education and project-dialog data.
- Produces: `.career-proof`, `#experience-bridge`, four `.bridge-stage` labels and concise bilingual evidence copy.

- [ ] **Step 1: Add Experience content tests**

Assert that both employers, all three schools, the `40+` and `10+` metrics, and the four bridge stages remain present. Assert that `.career-selected` is absent from the main page.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/experience-system.test.mjs`

- [ ] **Step 3: Remove duplicate project case-study paragraphs from S3**

Delete the `.career-selected` block only. Preserve the GUOMAO, CAMP WOW and DONGSI shortcut buttons that open existing project dialogs.

- [ ] **Step 4: Condense 5LMEET evidence to three statements**

Keep evidence covering: 40+ concepts and positioning; executive-ready strategy and storytelling; cross-functional progression into implementation. Keep the Pan-China role and education unchanged.

- [ ] **Step 5: Add the process ending**

Build `#experience-bridge` as four semantic stage items with data attributes:

```html
<div id="experience-bridge" class="experience-bridge" aria-label="Working process">
  <span class="bridge-stage" data-next="INSIGHT">RESEARCH</span>
  <span class="bridge-stage" data-next="STRATEGY / CONCEPT">CONCEPT</span>
  <span class="bridge-stage" data-next="STORYTELLING / ALIGNMENT">EXPERIENCE</span>
  <span class="bridge-stage" data-next="EXECUTION">DELIVERY</span>
</div>
```

- [ ] **Step 6: Style S3 as concise evidence, not project cards**

Use thin horizontal divisions, large employer names, restrained role copy and editorial education rows. Keep logos aligned by optical size.

- [ ] **Step 7: Test and commit**

Run: `npm test`

```powershell
git add index.html experience-system.css content.js cv-content.js tests/experience-system.test.mjs
git commit -m "feat: distill experience into credible evidence"
```

### Task 5: Build the S3-to-S4 transformation and S4 process DOM

**Files:**
- Modify: `index.html:34`
- Modify: `app.js:58-76`
- Modify: `content.js`
- Modify: `experience-system.css`
- Test: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: `#experience-bridge` and bilingual process data.
- Produces: `renderThinkingProcess(language)`, `#thinking-process`, six `.process-stage` elements, `.process-field`, `.process-signal` nodes and `.process-trace` paths.

- [ ] **Step 1: Add S4 semantic and content tests**

Check that all six architectural stage words and their meanings exist in English data, Chinese equivalents exist, and the old `#capabilities-grid` identifier is absent.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/experience-system.test.mjs`

- [ ] **Step 3: Add bilingual process data**

Define six objects with stable IDs, English/Chinese titles, input arrays and meanings: `insight`, `strategy`, `concept`, `storytelling`, `alignment`, `execution`.

- [ ] **Step 4: Replace the capability grid with a process shell**

Use one sticky viewport containing metadata, a stage stack, a shared SVG structural field and progress rail. Keep all copy in the DOM so it remains accessible when animation is unavailable.

- [ ] **Step 5: Update `app.js` rendering**

Render stage labels, input lists and meanings from content data. Preserve `portfolio:render` dispatch so the animation module can re-query after language changes.

- [ ] **Step 6: Add the editorial visual system**

Use near-black, off-white, thin lines and one lime active accent. Large stage words use tight line-height and controlled viewport cropping; metadata uses uppercase wide tracking. Avoid filled cards, gradients on UI, glass and rounded containers.

- [ ] **Step 7: Test and commit**

Run: `npm test`

```powershell
git add index.html app.js content.js experience-system.css tests/experience-system.test.mjs
git commit -m "feat: build visual thinking process"
```

### Task 6: Animate the continuous S4 sequence

**Files:**
- Modify: `experience-system.js`
- Modify: `experience-system.css`
- Modify: `cinematic.js`
- Modify: `refinement.js`
- Test: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: six `.process-stage` elements and shared SVG field nodes/paths.
- Produces: `buildThinkingTimeline({ mobile })`, active-stage state and a stable final execution mark.

- [ ] **Step 1: Add source-contract tests for one top-level S4 timeline**

Check for `id: 'thinking-sequence'`, `trigger: '#thinking-process'`, `pin: true`, numeric `scrub`, and verify no `scrollTrigger` appears inside a child `.to()` configuration.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/experience-system.test.mjs`

- [ ] **Step 3: Implement stage-state preparation**

Set the first stage visible; other stages begin masked and offset. Set dispersed signal nodes and hidden paths with `strokeDasharray` / `strokeDashoffset`.

- [ ] **Step 4: Build one pinned timeline**

Use a single top-level timeline and repeat a consistent stage transition pattern. Each segment updates the large word, metadata, input labels, field node positions and persistent progress trace. Use `ease: 'none'` under scrub.

- [ ] **Step 5: Implement the field-state progression**

- INSIGHT: nodes dispersed.
- STRATEGY: nodes align around one axis.
- CONCEPT: nodes converge around a centre.
- STORYTELLING: paths radiate outward.
- ALIGNMENT: stakeholder nodes connect.
- EXECUTION: nodes settle into a stable mark.

- [ ] **Step 6: Remove duplicate capability animation ownership**

Delete legacy `#capabilities-grid` decoration and scroll handlers from `cinematic.js` and `refinement.js`. Keep work-card pointer behaviour and dialog motion.

- [ ] **Step 7: Rebuild safely after language changes**

On `portfolio:render`, kill only `thinking-sequence`, rebuild the S4 context and call one deferred `ScrollTrigger.refresh()`.

- [ ] **Step 8: Test and commit**

Run: `npm test`

```powershell
git add experience-system.js experience-system.css cinematic.js refinement.js tests/experience-system.test.mjs
git commit -m "feat: animate continuous thinking sequence"
```

### Task 7: Connect EXECUTION to PROOF and refine Selected Work entrance

**Files:**
- Modify: `index.html:35`
- Modify: `experience-system.css`
- Modify: `experience-system.js`
- Test: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: S4 final execution mark and current `#work-grid` rendering.
- Produces: `#proof-transition`, `buildProofBridge()` and a shared grid-line reveal.

- [ ] **Step 1: Add tests for the proof bridge and preserved Work controls**

Assert that `#proof-transition`, `#work-filters`, `#work-grid` and `#case-dialog` all exist.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/experience-system.test.mjs`

- [ ] **Step 3: Add the PROOF transition markup**

Place a short transition band between S4 and S5 with `EXECUTION`, an arrow and a large `PROOF` word. It must be decorative around the existing Selected Work heading, not replace it.

- [ ] **Step 4: Transform the final S4 geometry into Work boundaries**

Use a non-pinned timeline that scales the stable mark down, reveals `PROOF`, extends two structural lines and unmasks the first visible row of project covers.

- [ ] **Step 5: Refine Work hierarchy and spacing**

Keep filters and cards intact. Increase title contrast, align metadata to the structural grid and use the same mask language as the S4 exit.

- [ ] **Step 6: Test filtering and dialogs manually**

Verify every work filter updates visible projects, each project opens the correct dialog, gallery links remain functional and closing restores keyboard focus.

- [ ] **Step 7: Test and commit**

Run: `npm test`

```powershell
git add index.html experience-system.css experience-system.js tests/experience-system.test.mjs
git commit -m "feat: transform execution into project proof"
```

### Task 8: Complete mobile and reduced-motion translations

**Files:**
- Modify: `experience-system.css`
- Modify: `experience-system.js`
- Modify: `mobile-preview.html`
- Test: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: desktop Hero and S4 timelines.
- Produces: `gsap.matchMedia()` branches for desktop, mobile and reduced motion.

- [ ] **Step 1: Add tests for complete fallback content**

Assert that no required stage depends on `display:none`, and reduced-motion CSS sets visible opacity, neutral transforms and unclipped content.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/experience-system.test.mjs`

- [ ] **Step 3: Add mobile Hero choreography**

Use the same five phases with a shorter scroll distance, smaller translations and no pointer parallax. Keep CTA touch targets at least 44px high.

- [ ] **Step 4: Add mobile S4 choreography**

Use a shorter sticky interval when viewport height is stable; otherwise present a flowing six-stage sequence with the shared field in a sticky 40svh region. Limit simultaneous moving nodes to six.

- [ ] **Step 5: Implement reduced-motion setup**

Skip pinned timelines, set the Hero to its complete proposition state, show all S4 stage copy in a vertical list and show the final structural field without drift.

- [ ] **Step 6: Update the mobile preview shell only if needed**

Keep the 390×844 iframe and label; ensure it does not mask site overflow or interfere with real mobile breakpoints.

- [ ] **Step 7: Test and commit**

Run: `npm test`

```powershell
git add experience-system.css experience-system.js mobile-preview.html tests/experience-system.test.mjs
git commit -m "feat: translate narrative motion for mobile"
```

### Task 9: Browser QA, production build and deployment

**Files:**
- Modify as required by verified defects only.
- Test: `tests/experience-system.test.mjs`, `tests/server.test.mjs`

**Interfaces:**
- Consumes: completed S1–S5 experience.
- Produces: verified production output and deployed `main` commit.

- [ ] **Step 1: Run automated verification**

Run:

```powershell
npm test
npm run build
git diff --check
```

Expected: all tests pass, build exits 0 and whitespace check is clean.

- [ ] **Step 2: Verify desktop at 1440×900 and laptop at 1280×800**

Check the five Hero phases, S1→S2 continuity, shortened S3, S3→S4 transformation, all six S4 stages, PROOF entrance, Work filtering, dialogs, guide, language switch and anchors.

- [ ] **Step 3: Verify tablet and mobile**

Check 768×1024 and 390×844. Confirm readable typography, no clipped controls, no horizontal overflow, no unstable sticky/pin behaviour and complete process content.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm all content is visible, no pinning blocks navigation and ambient motion is stopped.

- [ ] **Step 5: Check browser runtime health**

Inspect console errors, verify images load, confirm `document.documentElement.scrollWidth === document.documentElement.clientWidth`, and check anchor destinations after ScrollTrigger refresh.

- [ ] **Step 6: Review the final diff against the specification**

Confirm S2, S5 interactions and final contact content remain intact; confirm no CMS, backend, admin, AI assistant or unrelated gallery work entered the change.

- [ ] **Step 7: Create the final commit and push**

```powershell
git add index.html app.js content.js cv-content.js cinematic.css cinematic.js refinement.js experience-system.css experience-system.js mobile-preview.html package.json tests/experience-system.test.mjs docs/superpowers
git commit -m "Redesign portfolio as a continuous digital experience"
git push origin main
git rev-parse HEAD
git rev-parse origin/main
```

- [ ] **Step 8: Report implementation details**

Report changes, files, Hero architecture, S3 simplification, S3→S4 logic, S4 visual system and sequence, S4→S5 logic, motion tokens, mobile strategy, performance decisions, build result and commit SHA.
