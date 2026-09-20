# Portfolio V0.1 — implementation plan

Goal: deliver the previously agreed English-first, Chinese-supported career portfolio as a working local preview.

Scope: hero, profile, capabilities, case studies, archive, AI Lab, experience, CV/contact and a persistent guided-navigation panel. Missing career facts and assets remain explicitly marked as draft. No fabricated clients, metrics, contact details, or AI responses.

Environment decision: downloading npm dependencies is denied by the current session. Deliver a dependency-free HTML/CSS/JavaScript preview now; React/Vite migration remains pending. The page must also work when index.html is opened directly, without a server or internet connection.

Files: index.html (structure), styles.css (responsive presentation), content.js (bilingual content), app.js (interaction), server.mjs (optional loopback-only preview), tests/server.test.mjs (HTTP behavior), docs/MAKING_OF.md (ongoing tutorial).

1. Write and run meaningful HTTP tests: serve a page, reject missing routes, reject requests escaping the project root, allow query strings.
2. Implement optional Node preview server and pass those tests.
3. Build the bilingual layout and interactions. Use original CSS artwork labelled as visual studies, not completed client work. Respect reduced motion.
4. Verify desktop and narrow mobile layouts, language switch, archive filters, keyboard-accessible dialogs, navigation and absence of JavaScript errors in a real browser.
5. Record limitations and next content requests. Preview locally; no public deployment or GitHub write is part of this increment.
