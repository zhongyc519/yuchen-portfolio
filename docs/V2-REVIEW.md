# V2 review and return path

Preview: http://127.0.0.1:4174/

Original website remains in `../../yuchen-portfolio` relative to this document's directory. The stable copy is `../../backups/yuchen-portfolio-stable-20260915-123038/yuchen-portfolio`. 70 non-Git files in the backup were hash-compared with the original; no differences. To return to the original presentation, serve the original directory instead of V2; no file replacement is necessary.

V2 separates its presentation in studio.css, studio.js and studio-content.js. Existing project assets, galleries and CV facts are retained. Career project buttons open their project summaries directly.

Checks: JavaScript syntax passed; existing preview-server test passed. Browser checked at desktop and 390×844 mobile: no horizontal document overflow; no missing loaded images; English/Chinese toggle; realization filter returns one project; CAMP WOW dialog includes five groups and 21 images; guide closes and navigates to contact. Corrected smooth-scroll/focus ordering and mobile long-title wrapping. No captured console errors during review.

Motion responds to reduced-motion preferences in source; physical-device performance and FPS have not been benchmarked. In-progress collections and AI experiments retain their status. Nothing published.
