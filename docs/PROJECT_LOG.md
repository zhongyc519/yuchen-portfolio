# Yuchen Digital Projects — Project Log

## Purpose
This document is the single source of truth for the two highest-priority projects:
1. Yuchen Personal Portfolio
2. Urban Pulse

It records decisions, priorities, milestones, next actions, unresolved questions, and key product logic so work can resume without losing context.

## Working Mode
- Yuchen provides ideas, source material, judgment, and approvals.
- ChatGPT acts as execution partner: structures ideas, tracks decisions, identifies gaps, prioritizes work, and turns inputs into actionable outputs.
- Work is iterative. We ship working versions early, then refine.
- Every major decision should be recorded here.

## Priority
Both projects are now top priority.

## Weekly Availability
- Weekend: approximately 2 hours/day
- Monday–Friday: approximately 7–8 hours/day

## Project 01 — Personal Portfolio

### Goal
Create an English-first, Chinese-supported interactive career website that expands Yuchen's CV into an immersive digital portfolio and demonstrates strategy, concept development, creative direction, presentation, research, and AI capability.

### Core Concept
CV exploded into an experience:
Who I am → What I do → Proof → Projects → Selected work → AI capability → Full CV → Contact.

### Core Sections
- Hero
- About / Profile
- Capabilities
- Selected Case Studies
- Selected Work / Archive
- AI Lab
- Experience
- Full CV
- Contact
- Persistent “Talk to Yuchen” assistant
- EN / 中文

### Visual Direction
- Apple-like clarity and restraint
- Motion Sites-style polished interaction
- Premium, international, editorial, technology-aware
- Avoid generic portfolio templates
- Mature visual effects are acceptable as placeholders in early versions

### Important Design Principle
CLAIM → PROOF
Every capability should be backed by evidence.

### Legal / Portfolio Rule
Use a portfolio legal filter:
- Low risk: already-public promotional material
- Medium risk: internal decks, recreate/redact
- High risk: client or unpublished project content, describe process rather than publish originals
- Never publish confidential financial, contract, client, user, or strategic data
Always state exact personal contribution and avoid implying sole authorship where not accurate.

### Target Timeline
- V0.1 running: 1 day
- Strong visual version: 3–5 days
- Shareable with HR: 7–10 days
- Refined version: 2–3 weeks

---

## Project 02 — Urban Pulse

### Product Definition
An AI-powered global reference intelligence platform for urban regeneration, architecture, placemaking, spatial innovation, hospitality, retail, mixed-use and related design fields.

### Origin of the Problem
Finding relevant references for real projects can take days or a full week. The difficult part is not seeing examples; it is identifying which references genuinely match the project context.

### Core Value Proposition
Compress a week of reference research into minutes or hours.

### Core Product Loop
Describe Project
→ AI understands brief
→ Search trusted public sources
→ Return relevant references
→ Match Score
→ Explain why each reference matches
→ Save
→ Ask follow-up questions
→ Build reference board / export

### Key Differentiator
Not simply “find projects.”
The product should answer:
“Which references are right for MY project, and why?”

### Matching Dimensions
Initial proposed dimensions:
- Typology
- Scale
- Location / context
- Audience
- Business model
- Budget / investment logic
- Project stage
- Spatial strategy
- Programming
- Operational model
- Brand positioning

### Potential Match Display
- Overall Match
- Typology Match
- Scale Match
- Audience Match
- Business Model Match
- Context Match
- Design Strategy Match

### Core Experiences

#### Search / Project Mode
User describes a project or challenge.
AI parses the brief and finds relevant global precedents.

#### Discover Mode
Latest signals, emerging typologies, projects worth watching, global trends, new openings.

#### Reference Card
Each case should include:
- Project
- Location
- Type
- Status
- Why it matters
- Why it matches
- What can be borrowed
- What may not translate
- Source attribution
- Original source link

#### Reference Library
Save, tag, organise and reuse references by project or theme.

#### Ask Urban Pulse
Conversational research copilot that clarifies project needs, searches, compares and explains references.

#### Reference Board / Export
Select cases and generate:
- research board
- PDF
- PPT
- shareable link

### Copyright / Legal Principle
Prefer legal public inputs such as:
- RSS
- official APIs
- search APIs
- public webpages
Use source attribution and original links.
Do not republish full articles or copyrighted image libraries without permission.
Avoid indiscriminate scraping.

### MVP
The first usable version should validate one golden path:
Describe project
→ AI analyses brief
→ Find 10 relevant references
→ Explain match
→ Save
→ Ask follow-up questions

### Suggested Technical Direction
- Next.js / React
- OpenAI API
- Search APIs / RSS / approved public sources
- Supabase
- Vercel
Later:
- Stripe
- PPT / PDF generation
- Team workspaces
- API / enterprise features

### Monetisation Ideas
- Free tier
- Pro subscription
- Team / Studio subscription
- Enterprise intelligence
- Paid research reports
- API / data licensing
- Clearly-labelled sponsored intelligence
- Project Intelligence reports
- AI Deck Builder

### Long-Term Positioning
Urban Pulse should evolve from a reference search tool into a research copilot and eventually an industry intelligence layer.

### Target Timeline
- Visual prototype: 2–3 days
- Functional MVP: 5–7 days
- Search/data/save/reference board: 2–3 weeks
- Mature product: 4–8+ weeks

---

## Current Strategic Decision
Urban Pulse has equal or potentially higher strategic value than the portfolio because it is both a useful product and proof of Yuchen's product, AI, strategy, and problem-solving capability.

The personal portfolio remains important and can feature Urban Pulse as a flagship AI Lab project.

## Immediate Next Actions
1. Set up the personal portfolio development environment.
2. Define Urban Pulse MVP architecture and project brief.
3. Create a separate GitHub repository for Urban Pulse.
4. Start Portfolio V0.1.
5. Build Urban Pulse product wireframe / V0.1.
6. Maintain this log continuously.

## Log
### 2026-09-12
- Created GitHub repository: zhongyc519/yuchen-portfolio.
- Agreed on portfolio information architecture and Talk to Yuchen concept.
- Defined Urban Pulse idea and product direction.
- Established Urban Pulse core value around project-to-reference matching, not generic news aggregation.
- Agreed that both projects are highest priority.
- Agreed weekly working availability: weekends ~2 hours/day, weekdays ~7–8 hours/day.
- Established this project log as the continuity system.

- Environment check: VS Code not detected; Node.js v24.19.0 and Git 2.53.0 are available only inside the current Codex environment, with no standalone system installation detected.
