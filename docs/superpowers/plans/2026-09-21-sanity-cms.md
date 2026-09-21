# Sanity CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hard-coded Selected Work content layer with an owner-friendly Sanity Studio while preserving the locked portfolio front end.

**Architecture:** Keep the current static HTML/CSS/JavaScript application. Add a small browser-side published-content adapter that queries Sanity's public CDN and normalizes results into the existing card/filter/dialog view model; render the existing local content immediately and retain it whenever configuration, content, or the network is unavailable. Host Sanity Studio as an independent application under `studio/`, with typed schemas and an idempotent migration dataset.

**Tech Stack:** Native browser JavaScript, Sanity Content Lake HTTP API/GROQ, Sanity Studio v4, Node test runner, existing static build.

**Spec:** `C:/Users/admin/.codex/attachments/02408033-559b-4c22-8be4-313581004be8/已粘贴的文本.txt`

## Global Constraints

- Do not redesign Hero, About, Experience, How I Think & Make, Selected Work controls, AI Lab, Contact, navigation, or the global motion system.
- Production queries only published projects whose visibility is public.
- Never place a Sanity token or private credential in browser code.
- Existing local project data remains the instant render and network-failure fallback.
- Preserve bilingual rendering, project filtering, case dialogs, current typography, and responsive behavior.

---

### Task 1: Define the CMS adapter contract

**Files:**
- Create: `cms-projects.js`
- Create: `cms-config.js`
- Create: `tests/cms-projects.test.mjs`

**Interfaces:**
- Produces: `window.portfolioCms.loadProjects(fallbackCases, fallbackCategories)` and exported test helpers through `globalThis.portfolioCms`.
- Produces normalized project properties used by the existing view: `en`, `zh`, `tagEn`, `tagZh`, `category`, `image`, `sections`, and ordered image metadata.

- [ ] Write failing tests for normalization, order, visibility, AUTO layout inference, optimized CDN URLs, empty results, and failed fetch fallback.
- [ ] Run `npm test` and verify the CMS tests fail because the adapter is absent.
- [ ] Implement the public GROQ request, normalization, image URL sizing, and local fallback behavior.
- [ ] Run `npm test` and verify the adapter tests pass.

### Task 2: Integrate CMS data without changing presentation

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `cinematic.css`
- Modify: `scripts/build.mjs`
- Modify: `tests/experience-system.test.mjs`

**Interfaces:**
- Consumes: `window.portfolioCms.loadProjects(...)`.
- Produces: existing Selected Work UI backed by normalized CMS projects after asynchronous hydration.

- [ ] Write failing tests proving script order, published-only query, config generation, bilingual fields, flexible sections, and layout-mode hooks.
- [ ] Run `npm test` and verify failures reflect the missing integration.
- [ ] Add CMS config and adapter scripts before `app.js`; keep local data as the first render.
- [ ] Update card and dialog rendering to handle cover hotspots, flexible sections, multiple images, captions, missing optional data, and inferred layout modes.
- [ ] Add only project-modal layout rules required for WIDE/STANDARD/PORTRAIT/AUTO; preserve the modal design language.
- [ ] Generate `dist/cms-config.js` from public environment values during production build.
- [ ] Run tests and inspect desktop/mobile Selected Work.

### Task 3: Build the owner-facing Sanity Studio

**Files:**
- Create: `studio/package.json`
- Create: `studio/sanity.config.ts`
- Create: `studio/sanity.cli.ts`
- Create: `studio/tsconfig.json`
- Create: `studio/schemaTypes/project.ts`
- Create: `studio/schemaTypes/projectSection.ts`
- Create: `studio/schemaTypes/projectImage.ts`
- Create: `studio/schemaTypes/category.ts`
- Create: `studio/schemaTypes/index.ts`
- Create: `tests/sanity-schema.test.mjs`

**Interfaces:**
- Produces document types `project` and `category`, object types `projectSection` and `projectImage`.
- Keeps Sanity's built-in publish, unpublish, duplicate, and delete actions.

- [ ] Write failing schema tests for all required fields, hotspot support, sortable arrays, visibility states, validation, previews, and approachable labels.
- [ ] Run `npm test` and verify the schema tests fail because Studio is absent.
- [ ] Implement the Studio configuration and schemas with clear field groups, descriptions, defaults, and previews.
- [ ] Install Studio dependencies and run its type/build check with placeholder environment values.
- [ ] Run all tests.

### Task 4: Create an idempotent migration path

**Files:**
- Create: `scripts/export-cms-seed.mjs`
- Create: `studio/seed/selected-work.ndjson`
- Create: `studio/seed/README.md`
- Modify: `package.json`
- Create: `tests/cms-seed.test.mjs`

**Interfaces:**
- Produces deterministic project/category documents using stable IDs and display orders `10, 20, 30...`.
- Preserves current copy and local image references as migration notes until assets are uploaded into Sanity.

- [ ] Write failing tests that require all current projects/categories and stable display order in the generated seed.
- [ ] Run tests and verify the seed test fails.
- [ ] Implement seed generation from the current data model and generate the checked-in NDJSON snapshot.
- [ ] Document the authenticated Sanity CLI import command and image-upload limitation.
- [ ] Run tests and verify the migration snapshot is complete.

### Task 5: Configuration and owner documentation

**Files:**
- Create: `.env.example`
- Create: `docs/CMS_GUIDE.md`
- Modify: `.gitignore`
- Modify: `README.md`
- Modify: `package.json`

**Interfaces:**
- Documents public site variables and Studio variables separately.
- Gives the owner a no-code workflow for creating, duplicating, previewing, publishing, hiding, reordering, and deleting work.

- [ ] Add tests for placeholder-only environment examples and required guide topics.
- [ ] Run tests and verify documentation/config tests fail before the files exist.
- [ ] Add safe placeholders, scripts, and the complete owner guide.
- [ ] Verify `.env`, tokens, and credentials remain ignored.

### Task 6: Final regression and deployment

**Files:**
- Verify all changed files.

**Interfaces:**
- Produces a deployable static portfolio and a separately deployable Studio.

- [ ] Run `npm test` with zero failures.
- [ ] Run `npm run build` and verify `dist/` contains the CMS adapter and generated public config.
- [ ] Run the Studio build with placeholder configuration.
- [ ] Verify local fallback, filtered cards, bilingual modal content, flexible media layouts, and desktop/mobile views without console errors.
- [ ] Inspect Git diff for front-end design regressions and secret leakage.
- [ ] Commit and push `main`; report the commit SHA and the one-time Sanity account steps still required.
