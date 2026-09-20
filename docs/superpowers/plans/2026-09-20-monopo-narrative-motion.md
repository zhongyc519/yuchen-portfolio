# Monopo-Inspired Narrative Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the hero, experience handoff and Section 04 as a clear single-message scroll narrative with dedicated desktop and mobile behavior.

**Architecture:** Keep the existing HTML/content-rendering system and centralize the new experience behavior in `experience-system.css` and `experience-system.js`. Extend the existing process renderer with icon hooks and a final tableau, then let one GSAP ScrollTrigger timeline own each pinned sequence.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, GSAP 3, ScrollTrigger, Node test runner.

**Spec:** `docs/specs/2026-09-20-monopo-narrative-motion.md`

## Global Constraints

- Preserve all verified CV, education, case-study and bilingual content.
- Keep black as the base, acid lime as the interaction/focus accent and fluid light as the hero atmosphere.
- Do not add dependencies or redesign project galleries.
- No overlapping hero narrative scenes, stale pinned spacers or horizontal overflow.
- Reduced-motion mode must expose all essential content without pinned animation.

---

### Task 1: Structural hooks and regression tests

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `tests/experience-system.test.mjs`

**Interfaces:**
- Produces: `.hero-scene-copy`, `.process-icon`, `#process-summary`, `.method-handoff` hooks.
- Consumes: `window.portfolioContent.process` and existing navigation/content renderer.

- [ ] Replace the two simultaneously rendered proposition spans with five semantic hero scenes.
- [ ] Replace `#proof-transition` with the final method/work handoff.
- [ ] Render one stage icon SVG per process item plus a six-step final summary.
- [ ] Update tests to assert exclusive hero scenes, six icon hooks, final summary and removal of `PROOF`.
- [ ] Run `npm test` and confirm the new assertions initially fail, then pass after markup changes.

### Task 2: Hero relay and liquid actions

**Files:**
- Modify: `experience-system.css`
- Modify: `experience-system.js`

**Interfaces:**
- Consumes: `.hero-scene-copy[data-hero-scene]` and pointer coordinates.
- Produces: `buildHeroTimeline({ mobile })` and liquid-action CSS variables `--pointer-x`, `--pointer-y`.

- [ ] Establish one absolute hero stage with mutually exclusive scene layers.
- [ ] Implement separate desktop and mobile five-scene timing with complete exits before entrances.
- [ ] Add dimensional translucent action styling, animated border light and pointer-following highlight.
- [ ] Add touch and reduced-motion fallbacks.
- [ ] Verify top, middle and final hero frames at desktop and 390px mobile widths.

### Task 3: Experience to method ownership

**Files:**
- Modify: `index.html`
- Modify: `experience-system.css`
- Modify: `experience-system.js`

**Interfaces:**
- Consumes: `#experience`, `#experience-bridge`, `#thinking-process`.
- Produces: a natural-flow CV ending and a discrete four-step bridge into Section 04.

- [ ] Give the CV a visible terminal boundary and adequate post-content spacing.
- [ ] Make `RESEARCH → CONCEPT → EXPERIENCE → DELIVERY` occupy its own readable composition without an additional headline.
- [ ] Ensure the Section 04 pin begins after the handoff leaves the viewport.
- [ ] Verify direct navigation to `#experience` and `#capabilities` lands on the intended owner section.

### Task 4: Six process cycles and final tableau

**Files:**
- Modify: `app.js`
- Modify: `experience-system.css`
- Modify: `experience-system.js`

**Interfaces:**
- Consumes: six process items with stable `id`, `number`, labels and meanings.
- Produces: `buildThinkingTimeline()` with converge, icon hold, disperse and summary phases.

- [ ] Author six consistent inline SVG icons.
- [ ] Add a clear Section 04 arrival state before the first process cycle.
- [ ] For every stage animate distributed nodes to the centre lime point, reveal the icon, hold the copy and disperse the nodes.
- [ ] Add a seventh timeline state containing the complete six-stage summary.
- [ ] Hold the final summary before releasing the pin into selected work.
- [ ] Replace the previous `PROOF` bridge logic with a restrained method-to-work reveal.

### Task 5: Typography, responsive QA and verification

**Files:**
- Modify: `experience-system.css`
- Modify: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: final desktop/mobile layouts.
- Produces: production-ready responsive and reduced-motion behavior.

- [ ] Proof all new English/Chinese line breaks, casing and measure.
- [ ] Run `npm test` and `npm run build`.
- [ ] Inspect desktop, mobile, Section 03→04, final Section 04 tableau and Section 04→05 in the browser.
- [ ] Check for console errors and horizontal overflow.
- [ ] Run `impeccable.cmd detect --json index.html experience-system.css experience-system.js app.js` once and resolve relevant findings.
- [ ] Commit the final implementation with verification evidence.
