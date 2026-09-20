# Yuchen Zhong — visual and motion source of truth

Updated: 2026-09-13

## Status and authority

This file is the permanent entry point for subsequent visual implementation. Read it before changing visual or motion code.

Status: implemented using the complete monopo saigon style export supplied directly by the user. The source-lock addendum below supersedes earlier provisional decisions.

The user requires Refero's **monopo saigon** style as the primary art-direction reference. Refero search was attempted twice and returned `NO_SUBSCRIPTION`. The user subsequently supplied the complete style export, tokens and motion guidance directly. That supplied export is the accepted reference; the source-lock addendum supersedes the provisional notes below.

Primary art direction: user-supplied monopo saigon style export.
Motion architecture: user-requested Apple-style pinned, scrubbed storytelling; not Apple visual styling.
Content foundation: the existing local portfolio. No rebuild or framework migration is required.

Source brief: user attachment `aa3c03e7-04b0-402e-87d8-5dd292705efe/pasted-text.txt`.

## Content lock

Preserve current English and Chinese strings, navigation labels, project titles, descriptions, Profile and section headings. Layout examples in the brief are not replacement copy.

- Header: retain `THINK BEFORE ACTION.` with its existing period unless explicitly instructed otherwise. The latest brief omits the period in an example, while the earlier instruction explicitly requires it.
- Hero name: `YUCHEN` / `ZHONG`.
- Statement: `From insight to concept.` / `From complexity to clarity.`
- Supporting text: `I connect insight, strategy and creative thinking to turn complex ideas into clear directions — and move them from possibility towards execution.`
- Hero CTAs: `Explore my work` and `View my experience`; do not restore About CTA.
- Navigation: retain existing About, Expertise, Work, AI Lab, CV / Contact. Simplify their visual treatment, not their wording.
- Thinking: retain all six existing items and descriptions: Strategy & research; Concept development; Brand & creative; Storytelling; Collaboration; AI-enabled workflows.
- Do not substitute OBSERVE / CONNECT / SHAPE / MAKE; those are illustrative examples.
- Keep the supplied portrait and verified Profile. Preserve project placeholders honestly; do not invent client images, dates or outcomes.
- Ask me remains a clearly described guide; no implied live AI functionality.

Capture and compare both HTML text and content files before and after implementation.

## Philosophy and reference lock

PRECISION × EDITORIAL × IRIDESCENCE.

Nothing floats. Light travels. Surfaces react. Typography moves.

User-locked traits: near-black canvas, pearl type, huge low-to-medium-weight display text, asymmetry, generous negative space, minimal interface, color restricted principally to atmospheric light, sharp or very small-radius surfaces.

Reject: pillars, particles, rings, cubes, spheres, decorative floating objects, obvious gradient blobs, mirrored radial circles, neon cyan/purple UI, rainbow gradients, card grids with heavy chrome, pill CTAs, heavy shadows and repeated fade-up animations.

The existing column field is to be replaced, not recolored. Existing imagery and content are to be reused.

## Palette roles — proposed values, pending reference validation

| Token | Proposed value | Role |
| --- | --- | --- |
| background | #0b0b0d | Main canvas |
| surface | #171719 | Rare structural surfaces |
| text | #eeeae3 | Main type, pearl white |
| text-secondary | #b9b5b1 | Readable supporting content |
| border | #474449 | Thin structural boundaries |
| focus | #eeeae3 | Keyboard focus |
| light-surface | #e5e1d9 | Selective quiet punctuation |
| sage | #899382 | Atmospheric field only |
| amber | #ac7444 | Atmospheric field only |
| oxblood | #542d36 | Atmospheric field only |
| dirty-violet | #716475 | Atmospheric field only |
| pearl | #d9d5cb | Reflective field highlights |
| champagne | #b1a185 | Rare field highlight, not UI accent |

Convert approved values to a single semantic OKLCH token system during implementation. Shader uniforms and CSS must consume one palette definition. No ad hoc component colors. Test actual text/background contrast independently of the shader. Do not let chromatic light become a button fill or persistent glow.

## Typography and spacing

Display: existing sans-serif or a licensed local equivalent approved after reference inspection. No unverified claims about monopo's font.
Chinese fallback: PingFang SC, Noto Sans SC, Microsoft YaHei, sans-serif.
Hero display target from user: clamp(72px, 10vw, 160px), weight 300–400, tracking -0.03em to -0.05em, line height 0.85–0.95.
Body: proposed 14–17px, line height 1.55–1.75. Avoid more than one dominant text idea in a scene.
Spacing scale: proposed 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 144px, responsive outer gutter 6vw with a mobile floor of 20px.
Align typography with consistent page edges; use deliberate offsets rather than centered stacks. Do not add content to fill empty space.

## Radiant field

Preferred implementation: a bounded-resolution WebGL fragment shader with procedural domain-warped noise, asymmetric reflective folds and a subtle grain component. It is a continuous light field, not discrete geometry or obvious blobs.

Color progression: muted sage → amber → oxblood → dirty violet → pearl. Keep transitions irregular, low-frequency and low-saturation. UI remains monochrome.

Time advances extremely slowly; scroll controls displacement and color balance. Cursor contribution is tiny and disabled on coarse pointers. Dark masks protect text contrast. Pause control continues to stop ambient motion; reduced motion displays a static atmospheric frame.

Provide a lightweight static/canvas fallback when WebGL fails. Handle context loss, offscreen suspension, visibility changes and teardown. Cap render resolution and device pixel ratio; benchmark instead of claiming 60fps without evidence.

## Scroll architecture

Use GSAP + ScrollTrigger if compatible with the existing static site. Load pinned versions locally with licenses. Do not migrate to React or stack overlapping animation drivers on the same elements.

Pinned scenes use normal document scroll, finite distances and reversible timelines. No wheel interception or manual scroll trapping. ScrollTrigger must refresh after layout/media changes. Anchors must land at readable scenes; keyboard focus must never land on masked or invisible controls.

Desktop Hero: proposed 250–320vh total scene distance; mobile: simplified 160–200vh. Values must be adjusted after QA, not maximized for effect. Reduced motion: no long pin spacing, static readable content.

Hero timeline, user requested:

| Progress | Composition |
| --- | --- |
| 0–15% | Name dominates; slow field; barely perceptible scale |
| 15–30% | Name lines separate slightly; field migrates |
| 30–50% | Name exits; existing statement revealed with clipping |
| 50–70% | Statement dominates, supporting copy and CTAs readable |
| 70–85% | Field darkens; principle becomes dominant |
| 85–100% | Principle resolves to small signature; next chapter enters; pin releases |

Use an aria-hidden visual duplicate of the existing principle if necessary; do not create new spoken content. Keep canonical content in semantic reading order. Make all information available without waiting through animation for keyboard and reduced-motion users.

Time-based transitions: 0.8 / 1 / 1.25 seconds where appropriate, easing cubic-bezier(0.19, 1, 0.22, 1). Scrubbed timelines derive progress from scrolling, not arbitrary timed entrances. No spring/bounce/typewriter/glitch/per-letter flight.

## Thinking chapter

Retain the six existing stages and descriptions as one editorial sequence. Use a finite pinned or semi-pinned scene on desktop with successive stage emphasis and directional continuity. No clickable cards, no boxed menu and no invented replacement headings. Mobile uses a shorter timeline or naturally scrolling sequence with progressive emphasis; all items stay accessible.

## Projects

Use large editorial spreads with existing visuals, titles and metadata. Minimal borders, no rounded card chrome. Project imagery carries color. A finite scrubbed transition may gently scale or clip an image as the next spread enters. Maintain native project buttons and existing detail dialogs. Case studies remain drafts until supplied with real evidence.

## About and other chapters

About should read as a later, quiet personal chapter with the existing portrait. It may move later in document order per the latest brief, but all text stays verbatim and navigation anchors remain stable. AI Lab, Experience, archive and contact remain existing content, not opportunities to add sections. Any scene reordering must be documented and verified against navigation.

## Navigation, borders and interactions

Simple text navigation; preserve labels. CTAs use modest padding, sharp/subtle radii, aligned arrows and thin boundaries where useful. No large pills or broad neon bloom. Hover may shift an underline or a small reflective edge; provide equivalent visible keyboard focus. Avoid custom cursor replacements.

## Accessibility and performance

- 44px touch targets where appropriate; 320px navigation usable without overflow.
- Body contrast at least 4.5:1; large type at least 3:1; visible focus independent of atmospheric colors.
- Semantic headings and logical reading order; no animation-only access to essential content.
- Decorative canvas hidden from assistive technology; meaningful images have alt text and dimensions.
- Reduced motion disables heavy scrub and ambient loops, retaining complete content and static atmosphere.
- Lazy-load noncritical images; avoid unbounded pin distances and layout thrashing.
- Cleanup listeners, observers, timelines and WebGL resources; do not run offscreen loops.
- Do not remove more content or change copy to solve a layout issue.

## Decision ledger

| Decision | Authority | Verification |
| --- | --- | --- |
| Monopo art direction | Explicit Refero requirement | Blocked: NO_SUBSCRIPTION |
| Liquid field replaces columns | Latest user brief §4 | Locked |
| Pinned scrub hero | Latest user brief §5–8 | Locked, implementation pending |
| Existing six stages stay verbatim | Latest user brief §21 and previous explicit item lock | Locked |
| Existing nav wording retained | Content-preservation requirement | Locked |
| Mineral palette confined to atmosphere | Latest user brief §3 | Roles locked; numeric values proposed |
| Quieter later About | Latest user brief §13 | Locked direction |
| Mobile and reduced-motion alternatives | Latest user brief §17–19 | Required QA |

## Before implementation

1. Obtain Refero monopo saigon full style/screens, or explicit authorization to use a different reference source.
2. Record reference IDs, URLs, screenshots and supplied tokens; inspect all supplied implementation guidance.
3. Separate observed static traits, documented behavior and inferred motion. Never infer exact timings from a still image.
4. Replace proposed values with evidence-based commitments, preserving explicit user constraints.
5. Snapshot working files; implement in bounded slices without rebuilding.

## Acceptance checks

Compare desktop and mobile to the locked reference; compare all content against baseline. Test forward/backward scrub, pin release, every anchor, keyboard access, project dialog, viewport resize, WebGL fallback, pause, reduced motion and offscreen suspension. Report observed performance and limitations honestly. This document does not certify an implementation that has not yet been built.

## 2026-09-13 — Primary reference supplied; implementation lock
This update supersedes the pending-reference gate and proposed palette above. The user supplied the full “monopo saigon — Style Reference”, including tokens, components, typography, spacing, CSS and motion descriptions. This is the accepted primary source; no claim is made that Refero subscription access was restored. Source code snippets and semantic description are available; a live motion recording is not, so timeline behavior below is the user's requested architecture, not a measured source-site reproduction.

Locked traits: black/white/neutral interface; one full-bleed liquid iridescent Hero; very large 300–400 weight sans typography; spacious 4px rhythm; 1078px content measure; 46px+ editorial gaps; zero shadow elevation; sharp images/cards and 75px radius exclusively on ghost buttons. No source branding or assets copied.
Reference tokens: #000000 Obsidian, #ffffff Paper, #181818 Inkstone, #6d6d6d Felt Gray, #636363 Slate Pill, #9a9a9a Ash Mist, #808080 Pewter. In the dark adaptation, white is text and neutral gray is secondary text; Paper is not a filled marketing CTA. The source's light primary canvas yields to the user's explicit dark identity. Existing light Lab remains punctuation.
Atmosphere only: sage rgb(160,224,171), amber rgb(255,172,46), oxblood rgb(165,45,37), with subdued pearl and dirty violet permitted by the user. These never color interface controls. Shader mixes must remain asymmetric and fluid rather than obvious gradient circles.
Typography: use locally licensed Inter as the reference's stated Roobert substitute; system sans fallback if unavailable. Desktop name approaches 225px with responsive clamping; 78px weight300 statement moments; 12px labels; 16–18px body with accessible line height. Use .9 display line-height rather than clipping ascenders at .7. Resolve contradictory reference radius-lg10px by following explicit 0px/75px role rules.
Motion: cubic-bezier(.19,1,.22,1), time-based transitions .8–1.25s; GSAP ScrollTrigger for finite pinned/scrubbed scenes, not identical fade-ups. Hero progresses name → existing principle → existing statement (held through unpin); Thinking retains six original stages. Desktop thinking scene semi-pins its heading while emphasis advances. Work uses full-width editorial spreads with mild scrubbed crop movement. Mobile shorter Hero pin and natural-flow Thinking/Work. Reduced-motion disables pins and renders all content statically. Ambient pause remains available.
About must be the first content section immediately after Hero; all original text, photo and anchors remain. This is an authorized layout change under the latest brief, not copy editing.
Implementation order: new isolated theme/shader/story files, retain old theme files and source assets; remove old wave/refinement animation loading on the current homepage only. Static fallback must be readable without WebGL, JS or GSAP.



## Scroll repair and small additions
User requested centered statement, smoother scrolling, About return and A PERSONAL PORTFOLIO below ZHONG. Keep statement centered without drift; scrub smoothing 0.65s, one background render loop, max render width 960 desktop / 480 mobile and three noise octaves. Caption 12px desktop / 9px mobile, same monochrome reference.

## Current sequence lock
Name 0–24%, principle reveal 24–38%, principle hold to 50%, exit to 60%; statement reveal 60–74%, then hold unchanged through 100% and unpin. About is first after Hero, before discipline strip and capabilities. Supersedes earlier ordering.

## Compact capabilities — latest user override
Section 02 uses six compact non-clickable cells, desktop 3 by 2, tablet 2 by 3, mobile one column. Removes the previous long editorial scroll and sticky heading. Preserve six titles/descriptions. Original consistent line icons with neutral radiant glow; darker, softer animated atmospheric background, no second WebGL loop. This supersedes no-grid constraints for Section 02 only.

## Unified Work — current user request
Merge sections 03 and 04 into one Work collection. Filter by Concept Planning, 0–1 Realization, Branding & Visual, Presentations & Proposals and Personal Explorations. Use existing dark editorial art direction and sharp two-column project entries. Equal prominence for all work; no three-featured-project hierarchy. User-mentioned collections may be named but must clearly indicate that individual works and assets are still being assembled.

## Liquid metal controls — user reference override
Apply supplied LiquidMetalButton art direction to existing framed action controls only: hero CTA links, ambient pause, floating guide, primary actions and dialog close buttons. Preserve labels, roles, anchors and handlers. Native CSS/JS adaptation: silver moving border, dark inset, press and ripple. No React migration or per-control WebGL contexts; visual approximation of supplied shader, not the identical Paper shader. Keep readable text and reduced-motion support.

## Project detail squeeze carousel
User-supplied carousel-squeeze reference controls project detail interaction: one dominant panel, narrower neighbouring panels, one-second easeOutExpo sizing, matching copy below, previous/next and keyboard controls. Adapt to existing vanilla site and dark identity; preserve real project text/media. No demo stock photographs or fabricated project imagery. Single-slide collections do not duplicate slides to fake volume.

## Project detail rollback
User rejected squeeze-carousel interaction. Restore the previous project modal with complete image and contribution text. Carousel assets remain inactive; Work filters, project content and liquid-metal controls remain unchanged. This supersedes the carousel entry above.


### CAMP WOW imagery — 2026-09-14
Use all 21 supplied photographs and design boards, ordered Scenery → Before & after → Activities → Merchandise → Design. Golden wheat field (64) is the project cover and first full-width detail image. Preserve original image proportions; two columns on desktop and one on mobile, static linked images with lazy loading. Keep existing dark identity and project text. No carousel.


## About atmosphere — 2026-09-15
User reference: supplied EMBER composition, warm red/amber grain against deep black. Adapt contrast and texture only; retain portrait, copy, grid and navigation. Existing Monopo reference remains typography/spacing authority. Latest request authorizes warm atmospheric color in About: oxblood and amber on the right, a faint sage undertone at left. Add original abstract city-plan linework (not a real geographic map), sharp geometry, low opacity behind text. Static grain and SVG linework; no extra render loop, scrolling animation, or portrait alteration. Mobile keeps existing stacked content and limits texture contrast for readability.


## About atmosphere rollback — 2026-09-15
User rejected the warm color and city-plan texture experiment. Restore the previous black About background and neutral text styling. The About atmosphere entry above is superseded; portrait, copy, layout, and all other sections remain unchanged. Texture SVG files are inactive.
