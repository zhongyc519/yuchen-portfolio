# Monopo-Inspired Narrative Motion Redesign

## Objective

Turn the portfolio into a continuous, legible sequence in which every viewport communicates one idea. Keep Yuchen's black, acid-lime and fluid-light visual identity while adopting the editorial restraint, monumental typography and patient motion rhythm observed in the Monopo Saigon reference.

## Approved direction

The approved direction is a single-message relay. Content must exit before the next message enters. Desktop and mobile use the same narrative but receive separate compositions and timing.

## Hero sequence

The hero has five mutually exclusive scenes:

1. `YUCHEN ZHONG`
2. `From insight to concept.`
3. `From complexity to clarity.`
4. Restrained `STRATEGY / CONCEPT / CREATIVE / AI` metadata.
5. A short positioning line with `Explore my work` and `View my experience` actions.

The fluid background remains the only large chromatic atmosphere. Lime is punctuation, progress and focus, not a field behind paragraphs. Each scene must remain readable for a meaningful portion of the pinned scroll. No narrative blocks may overlap.

Mobile uses the same five-part narrative with its own scale, spacing and timing. It must not inherit desktop positioning or leave blank pinned states.

## Liquid actions

Primary actions use a dimensional translucent surface, a restrained animated border highlight and pointer-following specular light. The effect applies to meaningful actions only. Touch and reduced-motion users receive a stable version with the same contrast and affordance.

## Experience to method transition

The CV remains complete and naturally scrolling. After the final education/context content, it ends with the four-step bridge `RESEARCH → CONCEPT → EXPERIENCE → DELIVERY`. Section 04 begins only after this bridge has fully cleared the viewport; no extra transition headline competes with it.

## Section 04 process system

Section 04 first establishes ownership with `Different lenses. Connected thinking.` and a short explanation. Each of the six stages then performs one complete cycle:

1. Information nodes are distributed.
2. Nodes converge into one acid-lime point.
3. The point resolves into the stage's authored SVG icon.
4. The icon and stage copy hold together.
5. The icon disperses into nodes for the next stage.

Icons: Insight/eye, Strategy/compass, Concept/spark, Storytelling/wave, Alignment/network and Execution/arrow. All icons share one stroke language. After Execution, the pinned sequence holds on a final tableau containing all six icons, labels and the full method chain.

## Method to work transition

Remove the large `PROOF` word and its transition. Replace it with a quiet editorial handoff inside the final method tableau: `METHOD → SELECTED WORK` and `See how the process becomes real work.` Work begins in a separate section after the tableau releases.

## Typography and copy

Use one claim per scene, sentence case for narrative copy, compact uppercase only for navigation and metadata, and consistent punctuation. Large text uses regular or light weight, tight but readable line height and no more than two lines on mobile. Body measure stays within 65–75 characters where possible.

## Accessibility and performance

Animations use transforms, opacity, clip paths and SVG stroke properties. Every GSAP timeline is scoped and killed on remount. Reduced-motion mode shows all essential content without pinning. Keyboard focus, link semantics and contrast must remain intact. No horizontal overflow is permitted at desktop or mobile widths.

## Validation

Run source tests, production build, desktop and 390px mobile visual inspection, scroll-transition inspection, console check and the Impeccable mechanical detector on changed files.
