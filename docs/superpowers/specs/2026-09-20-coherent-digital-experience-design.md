# Coherent Digital Experience Design

## Objective

Evolve the approved Yuchen Zhong portfolio into one continuous, high-end coded experience without redesigning the whole site. The result must communicate strategic thinking, creative judgement, AI-assisted making and technical confidence to recruiters and prospective clients.

The narrative is:

`IDENTITY → EXPERIENCE → METHOD → PROOF → NEXT`

## Design Direction

The visual system combines cinematic atmosphere with precise information architecture:

- Near-black canvas, off-white typography and restrained fluorescent lime.
- Radiant colour remains atmospheric media, used only in the Hero, major transitions and the S4 signature visual.
- Large display type, medium reading type and small museum-signage metadata create strong hierarchy.
- Thin structural lines, deliberate asymmetry and negative space replace card chrome.
- Motion uses one patient personality based on `cubic-bezier(0.19, 1, 0.22, 1)`.

## Preserved Systems

- Existing bilingual content system and language switch.
- Current S2 portrait, copy, metrics and editorial structure.
- Existing employer, education and international-background evidence.
- Selected Work data, filtering, project galleries and dialogs.
- Contact section content and WeChat QR implementation.
- Existing radiant/WebGL renderer with a static fallback.
- Anchor navigation, guide dialog and accessibility affordances.

## Replaced or Consolidated Systems

- The current Hero sequence becomes a coordinated five-phase scroll timeline.
- Repetitive generic reveal effects are consolidated into the GSAP motion system.
- S3 project case-study paragraphs move out of the CV narrative; S5 remains the project evidence layer.
- The six-card capability grid is replaced by a continuous visual thinking process.
- Section boundaries become transformations rather than independent entrances.

## S1 — Hero

The Hero is a full-viewport pinned composition with five phases:

1. **Identity:** `YUCHEN ZHONG` dominates the viewport over the radiant field.
2. **Reposition:** The name scales, crops and moves while remaining visible.
3. **Proposition A:** `From insight to concept.` enters through a mask.
4. **Proposition B / Role:** `From complexity to clarity.` and `STRATEGY / CONCEPT / CREATIVE / AI` complete the professional proposition.
5. **Action:** Work and Experience CTAs appear after the identity and proposition have landed.

The timeline uses transforms, opacity and clip paths. The radiant field responds subtly to timeline progress and recedes near the transition.

## S1 → S2

A thin line and the small portfolio caption descend from the Hero composition into the About section marker. The radiant field fades to a residual atmospheric trace. This turns the opening composition into an information structure without a hard visual cut.

## S2 — About

The existing section remains intact. Motion is limited to:

- A calm masked title entrance.
- A small portrait depth shift.
- Metric-line continuation toward S3.

No new decorative system is introduced.

## S3 — Experience

S3 establishes credibility through:

- Employer and role history.
- Career trajectory and dates.
- Three concise evidence statements for the lead role.
- Key project and implementation metrics.
- Urban development foundation.
- Education, school logos and UK experience.

The four detailed project descriptions are removed from the main CV flow because the projects already appear in Selected Work. Project links may remain as direct proof shortcuts.

The section ends with a structural process line:

`RESEARCH → CONCEPT → EXPERIENCE → DELIVERY`

## S3 → S4

The process line becomes the S4 framework:

- `RESEARCH` expands into `INSIGHT`.
- `CONCEPT` becomes the strategy and concept centre.
- `EXPERIENCE` expands into storytelling and alignment.
- `DELIVERY` resolves into execution.

Lines extend, words reposition and a technical grid emerges. The transition communicates that professional evidence produces a repeatable method.

## S4 — How I Think & Make

S4 is one pinned, scroll-driven sequence rather than six independent slides or cards.

### Content stages

1. **INSIGHT** — research, trends, users, market, site, context and signals. Gather complexity.
2. **STRATEGY** — positioning, prioritisation, judgement, direction and business context. Decide what matters.
3. **CONCEPT** — narrative, naming, experience, scenarios and spatial thinking. Give the idea form.
4. **STORYTELLING** — presentations, visual language, story structure, communication and executive narrative. Make the idea persuasive.
5. **ALIGNMENT** — CEO, clients, government, design, branding, leasing, operations and cross-functional teams. Bring perspectives into one direction.
6. **EXECUTION** — translation into action, review, iteration, implementation and consistency. Move possibility to delivery.

### Signature visual

One structural field changes state throughout the sequence:

- Dispersed signal labels and nodes.
- Clustering into a directional axis.
- Condensation into a central concept form.
- Expansion into an outward narrative.
- Stakeholder nodes connected through shared geometry.
- Collapse into a stable resolved mark.

Each stage leaves a trace: a line, number, node or word fragment. The visual remains editorial and abstract, avoiding HUD, gaming and dashboard aesthetics.

### Motion implementation

- One top-level GSAP timeline with one ScrollTrigger.
- Transform, opacity, clip path and SVG stroke animation only.
- Desktop pinning with measured scroll distance and numeric scrub.
- No nested ScrollTriggers inside the sequence.
- A static complete state for reduced motion.

## S4 → S5

The stable execution mark compresses into the word `PROOF`. Structural lines become the Selected Work grid boundaries, and the first project imagery is revealed from that structure. The work section keeps its current content and interaction model.

## S5 — Selected Work

Changes are limited to:

- Stronger entrance from S4.
- Clearer title and metadata hierarchy.
- More intentional spacing.
- Consistent image masking and hover movement.

Filtering, case data and dialog behaviour remain unchanged.

## Motion Tokens

- `--ease-cinematic: cubic-bezier(0.19, 1, 0.22, 1)`
- `--duration-scene: 1.1s`
- `--duration-reveal: 0.9s`
- `--duration-micro: 0.38s`
- Scroll scrub: approximately `0.65–0.9`

Animation uses compositor-friendly transforms and opacity. `will-change` is limited to active scene elements.

## Mobile Strategy

- Preserve the same narrative order and stage language.
- Shorten the Hero scroll range and reduce crop distance.
- Convert the S4 pin into a shorter sticky or sequential flow depending on viewport stability.
- Reduce parallax and simultaneous node movement.
- Keep all six process stages readable and retain the persistent structural trace.
- Maintain touch targets, anchor navigation and language switching.

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Disable pinning and scrubbed transformations.
- Display the complete Hero proposition in a stable layout.
- Present S4 as a readable vertical sequence with the final resolved field.
- Remove ambient drift while preserving all content and navigation.

## Performance and Compatibility

- Reuse the existing GSAP and ScrollTrigger vendor files.
- Keep a single radiant canvas and pause it when off-screen or hidden.
- Avoid layout-property animation and repeated bounding-box reads during scroll.
- Lazy-load project media and preserve explicit image dimensions.
- Refresh ScrollTrigger only after content, fonts or viewport-dependent layout changes.
- Prevent horizontal overflow at every breakpoint.
- Use Safari-compatible clipping with appropriate fallbacks.

## Verification

Verify at desktop 1440px+, laptop, tablet and 390px mobile widths. Check:

- No horizontal overflow.
- Correct anchor positions.
- Language switch remains functional.
- Work filtering and project dialogs remain functional.
- Guide dialog remains functional.
- No animation overlap or scroll lock.
- Reduced-motion presentation remains complete.
- No console errors.
- Production build and existing tests pass.

After verification, commit to `main`, push to GitHub and allow Vercel to deploy.
