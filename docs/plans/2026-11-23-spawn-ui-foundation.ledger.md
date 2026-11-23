# SDD ledger — plan: docs/plans/2026-11-23-spawn-ui-foundation.md
Pre-flight: Task3 produces tokens/contrast → Task4,8,9 consume (names match); Task4 produces Icon/styles.css → Task5 IconButton consumes PhosphorIcon type (ok); Task8 Tier type from Task3 (ok); Task9 PropsTable reads TS types of Tasks 4-8 (ok).
Task 1: Ruling: LICENSE holder DueStar, not spawn's W17ANT (W17ANT is the upstream fork author; spawn-ui is new work) — cost if wrong: a one-line change.
Task 1: Ruling: step 5 (gh repo create + push) deferred until the owner says so — pushing to a public repo is outward-facing.
Task 1: complete (commits 19013b3..46f9b2b, tests: npm install → ok)
Task 3: Ruling: added --dur-fast/--dur-base (120/180ms) beside --ease — the spec says motion durations; spawn's CSS uses 120–180ms — cost if wrong: two unused vars. Ruling: added tokens.fonts (sans, mono) — spawn's stacks are literal in CSS (chat-virtual rule forbids var() fonts), so they are exported as values, not CSS vars.
Task 3: complete (commits 46f9b2b..e9575ee, tests: npm test -w @spawn-ui/tokens → 7/7 pass; mutation check: a changed --ink fails 1)
Task 4: Ruling: base.css carries .sp-truncate (used by Tasks 6, 8) and .sp-inset-ring (rows/menu items, offset -2px) — plan names .sp-truncate in Task 6; one shared place. Ruling: dist/styles.css = tokens + base + component css, built by scripts/build-styles.ts (vite lib css not used: components import no css, so the order is explicit).
Task 4: complete (commits e9575ee..060ab28, tests: npm test → tokens 7/7, react 10/10)
Task 5: Ruling: Button sizes xs/sm/md (24px .chat-btn, 28px .chat-card-btn, .set-btn 6px 12px), default sm — spawn has three heights, not two; each size keeps its source's colours (md text --ink, hover --hover) so adoption moves no pixel — cost: a third size in the API. Ruling: IconButton md is 24×22 (.w-icon), not 26 — the plan's 26 was wrong against spawn's CSS. Ruling: added pressed (aria-pressed) — the rail and header toggles need it.
Task 5: complete (commits 060ab28..22c4353, tests: npm test -w @spawn-ui/react → 17/17)
Task 6: Ruling: sizes sm (.dex-seg 4px 9px, --t-meta) and md (5px 10px, --t-ui) — md is not a spawn copy yet; sm carries every current one. Ruling: disabled items skipped by arrows.
Task 6: complete (commits 22c4353..0c453a8, tests: react → 22/22)
Task 2: complete (commit ea0f1b6, docs/inventory.md: 73 families, 257 definitions, 1,862 CSS lines; 35 dead rules / 66 lines in spawn; written by a research subagent, read by me)
Task 2: Ruling: catalogue grows to the inventory's 73 families across plans 2–4 (the owner: every component); IconButton sizes beyond xs–lg (12 seen, up to 56×44) are added when their screens are adopted (plan 5), not now.
Task 7: Ruling: Radio exported as RadioGroup (the plan's Interfaces already named RadioGroup); marks shared in checkbox.css as .sp-mark. Ruling: switch track #2c303b and knob #c9cdd6 kept as raw colours, as spawn's .set-switch has them (the inventory lists raw colours to tokenise later).
Task 7: complete (commits ea0f1b6..acd6bb4, tests: react → 28/28)
Task 8: Ruling: Meter stat is 4px with --ink-2 fill (spawn's .dex-stat-bar varies; refined when the dex screen is adopted). Ruling: a tier Tag has no hairline (spawn's .chat-wild-tier is dot + word, no border).
Task 8: complete (commits acd6bb4..4654420, tests: react → 37/37, build ok)
Task 9: Ruling: the site is dark only (ThemeProvider sets dark, no theme picker) — spawn is dark only and its colours fail on light. Ruling: a surface's contrast column shows — (surface on surface means nothing). Ruling: docs test 'every component has a page' lands red here and turns green in Task 10 (its owner). Ruling: scripts/shot.mjs uses spawn's playwright-core copy (no new browser download).
Task 9: complete (commits 4654420..2777ea3, tests: docs build 27 pages; vitest apps/docs → 2/3, the 3rd is Task 10's)
Task 10: Ruling: demos live in one React registry (Demo.tsx) referenced by name from MDX — MDX children of a React island render static, so interactive demos (Switch, Segmented) need their own state; one place also keeps each demo's code beside its render. Ruling: the playground page is a composed scene (session row + permission card), not a props editor.
Task 10: complete (commits 2777ea3..2753923, tests: docs build 51 pages; vitest apps/docs → 3/3)
Task 11: Ruling: ran 'changeset version' locally (0.1.0 + CHANGELOGs, nothing published) so the Releases pages have notes to render; release.yml then only builds, tests, packs and creates the GitHub Release, on manual dispatch. Ruling: both workflows are workflow_dispatch only — nothing publishes or deploys without the owner.
Task 11: complete (commits 2753923..69f3790, tests: tokens 7/7, react 37/37, docs 4/4, typecheck clean, docs build 51 pages)
Final review: opus reviewer — Critical 0, Important 5, Minor 11; re-graded: the pixel mismatches (Minor) raised to Important — the spec's anti-goal is an adoption that moves pixels; Tag truncation and the tarball dependency raised to Important (Review Focus 4; install fails).
Final: fixed bare :focus-visible restyling the host app — guards 'one focus ring, only on spawn-ui's own controls' RED→GREEN, suite 50/50
Final: fixed guard false negatives (font shorthand, radius longhands, nested at-rules, reduced motion per kind/selector, outline:none) — guards 'the guard itself catches…' + rewritten guards RED→GREEN, suite 50/50
Final: fixed per-component ring coverage — review-fixes 'the ring rule names each control's focusable class' RED→GREEN (focusability test passed before: all controls reachable)
Final: fixed IconButton header size (head 26×26 ink-3 hover --hover) — review-fixes RED→GREEN
Final: fixed Button xs disabled 0.5, link inherits font + hover underline --ink, ghost md hairline; Switch disabled no fade; Pill button 1px 0; Meter hp transition + flex — review-fixes RED→GREEN
Final: fixed Tag min-width 0 — review-fixes RED→GREEN
Final: fixed @spawn-ui/tokens pinned ^0.1.0, README + LICENSE in both packages — review-fixes RED→GREEN; npm pack + install into a fresh app: 17 exports, styles.css present
Final: Ruling: disabled controls keep spawn's fades (0.45 / 0.5) though --ink-3 at 0.45 is about 1.9:1, under the plan's 3:1 — the spec says adoption moves no pixel; making disabled text readable is a visible change for the owner to decide — cost if wrong: disabled labels stay hard to read in spawn and the docs.
Final: Ruling: Meter hp-full (opacity .35 at full context) not added — no prop for it yet; comes with the session row (plan 3) — cost: one prop later.
Final: minor (deferred): Tag merges only .chat-wild-tag today; .resume-badge (amber .run), .set-tag, .chat-ch-tag join as variants in plan 3 (comment corrected).
Final: minor (deferred): docs app not built by the reviewer — I built it (51 pages) and its tests pass 4/4.
