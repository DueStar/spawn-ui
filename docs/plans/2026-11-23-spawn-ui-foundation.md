# spawn-ui Foundation (plan 1 of 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A new public repo `spawn-ui` with the token package, the first components (foundations, actions, status), and a bilingual docs site that shows them live — usable on its own.

**Architecture:** npm workspaces: `packages/tokens` (one TS source → generated CSS + TS), `packages/react` (presentational components, global `sp-` CSS reading only tokens; Base UI for switch/checkbox/radio), `apps/docs` (Astro Starlight, ko + en, React previews as islands, props tables generated from the TS types). spawn's design rules become tests that run on the package CSS.

**Tech Stack:** TypeScript 5, React 18.3, Vite library build, vitest + @testing-library/react + jsdom, `@base-ui/react`, `@phosphor-icons/react`, Astro + @astrojs/starlight + @astrojs/react, react-docgen-typescript, Changesets, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-23-spawn-ui-design-system-design.md` (copied into the repo in Task 1).

**Later plans** (one each, written after this one ships): 2 containers (Card, Banner, EmptyState, Dialog, Menu, Tooltip, Tabs, TextInput, SearchField) · 3 spawn sessions + game · 4 spawn chat · 5 adoption in spawn (pixel diff, area by area).

## Global Constraints

- Repo: `C:\Users\hoo20\Documents\spawn-ui`, GitHub `DueStar/spawn-ui` (public), MIT, npm workspaces (not pnpm).
- Token names and values exactly spawn's `src/styles/tokens.css` as of 2026-11-23 (baseline copied in Task 2); no renames.
- Text sizes: 100 % on `:root`; 80/90/110/120/130 as `:root.ts-N` **and** `.sp-ts-N` (so a docs preview can scale on its own). Component CSS uses only `var(--t-*)` for font-size (no px font sizes).
- Yellow (`--accent`) is rare (spawn: the chosen session, the picked cell, send, the update button). In this plan's components it appears **only** on `Switch` checked (spawn's `.set-switch.on`). `Button variant="solid"` fills with `--ink` (spawn's `.chat-btn.solid`); `SegmentedControl`'s on-state is `--sel-bg` + `--ink`. The focus ring is never yellow.
- Weights only 380/400/500/600 or `--w-*`; radii only `--r-*`, 0, 1px, 2px, 50 %; 999px only on Switch and Badge.
- One focus ring: `outline: 2px solid var(--ink-2); outline-offset: 1px` on `:focus-visible` (rows/menu items −2px), never on mouse click, never yellow.
- Every animation/transition stops under `prefers-reduced-motion: reduce`. Easing `cubic-bezier(0.2, 0, 0, 1)`.
- Icons: Phosphor, weight `bold`, sizes 12/14/16 only (spawn `src/components/Icons.tsx` `ICON_SIZES` / `iconStep`).
- Components are presentational: props in, callbacks out; no stores, no IPC.
- Docs: Korean at `/`, English at `/en/`; Korean written first. Code, commits, prop descriptions in English.
- Deploying the site or publishing a release is asked first (workflows exist; they run on manual dispatch only).

## Review Focus

1. Text size 80 %/130 %: a component's text and box grow with `--t-*` and never clip — Task 4 guard test (no px font sizes) + docs preview switch (Task 10).
2. Keyboard-only use: every interactive component shows the ring on Tab and none on click — Task 4 guard test + per-component `:focus-visible` assertion (Tasks 5–7).
3. Reduced motion: Switch knob slide and Segmented transitions off — Task 4 guard test.
4. Long Korean labels in SegmentedControl / Tag / Pill: one line, ellipsis, title keeps the whole — Tasks 6, 8 tests.
5. Disabled controls: not clickable, `aria-disabled`/`disabled` set, still readable (`--ink-3` ≥ 3:1 on `--card`) — Tasks 5, 7 tests.

---

### Task 1: Repository and workspace

**Files:**
- Create: `spawn-ui/package.json`, `tsconfig.base.json`, `vitest.workspace.ts`, `.gitignore`, `LICENSE`, `README.md`, `README.en.md`, `.github/workflows/ci.yml`, `docs/specs/2026-11-23-spawn-ui-design-system-design.md` (copy), `docs/plans/2026-11-23-spawn-ui-foundation.md` (copy)

**Interfaces:**
- Produces: workspaces `packages/*`, `apps/*`; root scripts `build`, `test`, `typecheck`, `docs:dev`, `docs:build`.

- [ ] **Step 1:** `git init` in `C:\Users\hoo20\Documents\spawn-ui`; root `package.json` `{ "private": true, "workspaces": ["packages/*", "apps/*"] }`, Node ≥ 20, scripts above; `tsconfig.base.json` strict, `jsx: react-jsx`, `moduleResolution: bundler`.
- [ ] **Step 2:** README (ko) / README.en.md: one paragraph on what spawn-ui is, links to spawn and the docs; MIT LICENSE (holder as in spawn's LICENSE).
- [ ] **Step 3:** CI workflow: on push/PR, `npm ci && npm run typecheck && npm test && npm run build`.
- [ ] **Step 4:** `npm install` succeeds with empty workspaces; commit `chore: workspace`.
- [ ] **Step 5:** `gh repo create DueStar/spawn-ui --public --source . --push` (gh account `DueStar`, switch back to `chanho-byte` after). *Ask the owner before this push.*

### Task 2: Inventory of every component spawn uses

**Files:**
- Create: `docs/inventory.md`

- [ ] **Step 1:** Walk spawn's `src/components/**`, `src/Widget.tsx`, `src/*.tsx` and every class family in `src/styles/*.css`; one row per visual thing: name, files, class names, variants seen, measured sizes, which spawn-ui component it maps to (groups from the spec: Foundations, Actions, Status, Containers, spawn·sessions, spawn·game, spawn·chat), or "stays in spawn" with the reason (used once, like nothing else).
- [ ] **Step 2:** Count for the portfolio: families, duplicate definitions per family, CSS lines per family (`wc` on the matched rules). Commit `docs: inventory`.

### Task 3: `@spawn-ui/tokens`

**Files:**
- Create: `packages/tokens/package.json`, `src/tokens.ts`, `src/contrast.ts`, `scripts/build-css.ts`, `test/fixtures/spawn-tokens-2026-11-23.css` (spawn's tokens.css copied verbatim), `test/tokens.test.ts`

**Interfaces:**
- Produces: `tokens: { color: Record<string,string>; tier: Record<Tier,string>; weight; radius; measure; type: Record<'micro'|'meta'|'ui'|'name'|'prose'|'num'|'head'|'big'|'code', number>; typeScale: Record<80|90|110|120|130, typeof type>; motion: { ease: string; fast: number; base: number } }` keyed by the CSS var name without `--` (`color.ink`, `color['ink-2']`); `type Tier = 'common'|'rare'|'sub'|'legendary'|'mythical'`; `contrast(fg: string, bg: string): number` (WCAG); `@spawn-ui/tokens/tokens.css`.

- [ ] **Step 1: failing tests** — `test/tokens.test.ts`:
  - `every var in the spawn baseline has the same value in dist/tokens.css` (parse both `:root` blocks; equal maps).
  - `text classes: :root.ts-N and .sp-ts-N carry the baseline's ts-N values` for N in 80/90/110/120/130.
  - `tier classes and .tdot are kept as in the baseline`.
  - `--ink on --bg/--side-bg/--card/--card-2 ≥ 4.5; --ink-2 and --ink-3 ≥ 3` and `every tier ≥ 3 on --bg, --card, --toast-bg` (using `contrast`).
  - `motion: --ease is cubic-bezier(0.2, 0, 0, 1)` (new token, the only addition).
- [ ] **Step 2:** run `npm test -w @spawn-ui/tokens` → FAIL (no dist).
- [ ] **Step 3:** write `tokens.ts` from the baseline (plus `motion`), `build-css.ts` emitting `dist/tokens.css` (`:root{…}`, `:root.ts-N, .sp-ts-N{…}`, tier classes, `.tdot`) and `dist/index.js` + `.d.ts`; `contrast.ts` from spawn `tests/tokens.test.ts:37-55`.
- [ ] **Step 4:** tests PASS. Commit `feat(tokens): spawn's tokens as a package`.

### Task 4: `@spawn-ui/react` scaffold, Icon, focus ring, guard tests

**Files:**
- Create: `packages/react/package.json`, `vite.config.ts` (lib mode, externals react/react-dom/@base-ui/react/@phosphor-icons/react), `src/index.ts`, `src/styles/base.css` (focus ring, `.sp-visually-hidden`, reduced-motion), `src/Icon/Icon.tsx`, `src/Icon/icon.css`, `test/setup.ts`, `test/guards.test.ts`, `test/Icon.test.tsx`

**Interfaces:**
- Consumes: `@spawn-ui/tokens/tokens.css`, `tokens`.
- Produces: `Icon({ icon: PhosphorIcon; size?: number; label?: string })` (size snapped by `iconStep` to 12/14/16, weight `bold`, class `sp-icon`, `aria-hidden` unless `label`); `VisuallyHidden`; `@spawn-ui/react/styles.css` = tokens + base + every component's css, in that order.

- [ ] **Step 1: failing tests** — `guards.test.ts` reads every `src/**/*.css`:
  - `no px font-size; font-size only var(--t-*) or calc() of one`
  - `font-weight only 380/400/500/600 or var(--w-*)`
  - `border-radius only var(--r-*), 0, 1px, 2px, 50 %; 999px only in switch.css and badge.css`
  - `var(--accent) appears only in switch.css` (an allow-list later plans extend: send, chosen row, picked cell)
  - `every transition/animation has a reduced-motion rule that turns it off`
  - `the one focus ring: :focus-visible outline 2px solid var(--ink-2)`; no `:focus {` outline rules.
  - `Icon.test.tsx`: `size 13 renders 14, 20 renders 16, 11 renders 12; weight bold; aria-hidden without label, role img + aria-label with`.
- [ ] **Step 2:** FAIL. **Step 3:** implement; `iconStep` copied from spawn `src/components/Icons.tsx`. **Step 4:** PASS. Commit `feat(react): scaffold, icon, guards`.

### Task 5: Button and IconButton

**Files:** `src/Button/{Button.tsx,button.css}`, `src/IconButton/{IconButton.tsx,icon-button.css}`, tests beside each.

**Interfaces:**
- Produces: `Button(props: { variant?: 'solid'|'outline'|'ghost'|'link'; size?: 'sm'|'md' } & ButtonHTMLAttributes<HTMLButtonElement>)` forwardRef, default `outline`/`md`, classes `sp-button sp-button--{variant} sp-button--{size}`, `type="button"` by default. `IconButton(props: { label: string; icon: PhosphorIcon; size?: 'xs'|'sm'|'md'|'lg' } & ButtonHTMLAttributes)` → `aria-label=label`, `title=label`, box 20/22/26/38px.

- [ ] **Step 1: failing tests:** variants → classes; default type button; `disabled` → onClick not called; IconButton sets aria-label + title from `label`; IconButton boxes 20/22/26/38px; Button sm height 28px (`.chat-card-btn`). Colours, borders and paddings are copied exactly from spawn `chat.css:71-74` (`.chat-btn`, `.chat-btn.solid`) and `widget-expanded.css:541-571` (`.set-btn`, `.ghost`); a test pins the solid fill to `var(--ink)`.
- [ ] **Steps 2–4:** FAIL → implement → PASS. Commit `feat(react): Button, IconButton`.

### Task 6: SegmentedControl

**Files:** `src/SegmentedControl/{SegmentedControl.tsx,segmented.css,SegmentedControl.test.tsx}`

**Interfaces:**
- Produces: `SegmentedControl<T extends string>(props: { label: string; value: T; options: { value: T; label: ReactNode; title?: string; disabled?: boolean }[]; onChange(value: T): void; size?: 'sm'|'md' })` — `role="group"` + `aria-label`, buttons with `aria-pressed`, ←/→ move focus between buttons (Enter/Space choose), on-state `--sel-bg` + `--ink`, hover keeps words `--ink-2` and never restyles the chosen (spawn calm-review rule). Values from spawn `pokedex.css:167-181` (`.dex-seg`).

- [ ] **Step 1: failing tests:** chosen has aria-pressed true; click calls onChange once with value; clicking the chosen does not call it; ArrowRight moves focus; long label gets `sp-truncate` (one line, ellipsis) and `title` falls back to the label text.
- [ ] **Steps 2–4**, commit `feat(react): SegmentedControl`.

### Task 7: Switch, Checkbox, Radio

**Files:** `src/Switch/*`, `src/Checkbox/*`, `src/Radio/*` (component, css, test each)

**Interfaces:**
- Produces: `Switch({ checked; onCheckedChange(v: boolean); label: string; disabled? })` on Base UI `Switch` (knob `<i>`, on-fill `--accent`, 999px, knob slide transition off under reduced motion; values from spawn `widget-expanded.css:546` `.set-switch`). `Checkbox({ checked; onCheckedChange; label; disabled? })`, `RadioGroup({ value; onValueChange; label; options })` on Base UI, marks drawn like spawn's `.chat-card-mark` (radio) / `.multi` (checkbox).

- [ ] **Step 1: failing tests:** role switch/checkbox/radio with names; Space toggles; disabled blocks change; switch checked uses accent (class), unchecked track `--track`.
- [ ] **Steps 2–4**, commit `feat(react): Switch, Checkbox, Radio`.

### Task 8: Status — StatusDot, Tag, Pill, Badge, Meter

**Files:** one folder each under `src/`, with css and test.

**Interfaces:**
- Produces:
  - `StatusDot({ tone?: 'neutral'|'green'|'amber'|'danger'; tier?: Tier; label?: string })` 6px circle, `--tier` when tier; label → visually hidden text (never colour alone).
  - `Tag({ children; tier?: Tier })` hairline `1px solid var(--line)`, `--r-xs`, no fill, `--t-micro`; with tier: `StatusDot` + word (a tier is a dot beside its word, never a filled chip).
  - `Pill({ mood: 'working'|'needs-you'|'error'|'idle'; children; onClick? })` from spawn `widget.css:177` `.w-pill`; button when onClick.
  - `Badge({ children; tone: 'new'|'count' })` 999px, `--new-badge` / `--new-dot`.
  - `Meter({ kind: 'usage'|'hp'|'stat'; value: number; label: string })` value 0–1 clamped; usage 2px: `--bar` < 0.8 ≤ `--bar-warn` < 0.9 ≤ `--bar-danger`; hp 3px: `--hp` > 0.5 ≥ `--hp-warn` > 0.2 ≥ `--hp-low`; `role="meter"` with aria-valuenow (0–100) and aria-label.
- [ ] **Step 1: failing tests:** the thresholds exactly (usage 0.79/0.8/0.9; hp 0.51/0.5/0.21/0.2), clamp −0.1→0 and 1.4→1, Tag with tier renders dot + word and no background, long Tag/Pill text truncates with title.
- [ ] **Steps 2–4**, commit `feat(react): status components`.

### Task 9: Docs site skeleton (Starlight, ko + en)

**Files:** `apps/docs/{package.json, astro.config.mjs, src/content/docs/**, src/components/Preview.tsx, src/components/PropsTable.astro, src/components/TokenTable.astro, scripts/props.ts, src/styles/site.css}`

**Interfaces:**
- Consumes: `@spawn-ui/react`, `@spawn-ui/react/styles.css`, `tokens`.
- Produces: `<Preview code={string}>{children}</Preview>` (dark spawn surface `--bg`, text-size switch 80–130 % setting `.sp-ts-N` on the preview root, a code tab); `<PropsTable of="Button" />` from `scripts/props.ts` (react-docgen-typescript → `src/data/props.json`, run before build); `<TokenTable group="color" />` reading `tokens`.

- [ ] **Step 1:** Starlight with `locales: { root: { label: '한국어', lang: 'ko' }, en: { label: 'English' } }`, sidebar groups: 시작하기(소개·디자인 원칙·설치·플레이그라운드) / 토큰(색·크기·글꼴·모서리·움직임) / 컴포넌트(전체·Foundations·Actions·Status) / 릴리스(tokens·react). Site theme dark, spawn fonts (Pretendard) and accent.
- [ ] **Step 2:** `npm run docs:build` builds with the placeholder pages; a smoke test (`apps/docs/test/build.test.ts`) asserts `dist/index.html` and `dist/en/index.html` exist and the sidebar lists the four groups.
- [ ] **Step 3:** Getting Started pages (ko, then en): Introduction (what and why; link to spawn), Design Principles (the Global Constraints rules, each with the reason, plus "why yellow is rare", contrast floors), Installation (tarball / npm later, `import '@spawn-ui/react/styles.css'`), Playground (Preview of a small composed screen).
- [ ] **Step 4:** Token pages from `TokenTable` (swatches with contrast on `--bg`/`--card`, type steps at every scale, radii, motion). Commit `feat(docs): site, getting started, tokens`.

### Task 10: Component pages (v0.1) and the portfolio page

**Files:** `apps/docs/src/content/docs/components/*.mdx` (+ `en/`), `apps/docs/src/content/docs/why.mdx` (+ en)

- [ ] **Step 1:** One page per component (Icon, Button, IconButton, SegmentedControl, Switch, Checkbox, Radio, StatusDot, Tag, Pill, Badge, Meter) in Vapor's order: title + one line, Preview, one section per property (each a Preview), examples taken from spawn's real uses (e.g. Meter: the session row's HP bar at 62 %), PropsTable, Accessibility (keys, roles, what never relies on colour).
- [ ] **Step 2:** "왜 spawn-ui인가" page: the inventory numbers from Task 2 (before: families × copies, CSS lines; after: components) and the rules-as-tests story.
- [ ] **Step 3:** build test extended: every component in `src/index.ts` has a ko and an en page. Commit `docs: component pages`.

### Task 11: Releases

**Files:** `.changeset/config.json`, `.github/workflows/release.yml`, `.github/workflows/pages.yml`, `apps/docs/src/content/docs/releases/{tokens,react}.mdx`

- [ ] **Step 1:** Changesets (independent versions, start 0.1.0); first changesets for tokens and react.
- [ ] **Step 2:** `release.yml` (workflow_dispatch): version, build, `npm pack` each package, `gh release create v<react-version>` with both tarballs + notes from CHANGELOGs. `pages.yml` (workflow_dispatch): docs build → GitHub Pages.
- [ ] **Step 3:** Releases pages render each package's CHANGELOG.md (Vapor's format: version → component → change, **Breaking Change** marked). Commit `chore: releases`.
- [ ] **Step 4:** Report to the owner; push / run release / deploy Pages only on their word.
