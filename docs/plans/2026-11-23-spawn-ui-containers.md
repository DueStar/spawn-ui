# spawn-ui Containers (plan 2 of 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Containers group of `@spawn-ui/react` (v0.2.0): every box, panel, popup and field spawn draws, merged into 13 components plus a scrollbar utility, each with ko/en docs pages — so spawn's screens can later swap their CSS for them without a pixel moving.

**Architecture:** Same shape as plan 1: one folder per component under `packages/react/src/` (`.tsx` + `.css` + test), global `sp-` CSS reading only tokens, presentational props. Popups with focus and keyboard rules (Dialog, Menu, Tooltip, Tabs) sit on Base UI (`@base-ui/react/dialog|menu|tooltip|tabs`, already a dependency); boxes and fields are plain React. Exact spawn values are pinned by tests that read the component CSS (the `rule()` helper of `test/review-fixes.test.tsx`, moved to a shared file).

**Tech Stack:** as plan 1 — TypeScript, React 18.3, Vite lib build, vitest + Testing Library + jsdom, `@base-ui/react` 1.9, `@phosphor-icons/react`, Astro Starlight docs, Changesets.

**Spec:** `docs/specs/2026-11-23-spawn-ui-design-system-design.md` (§ Components, Containers v0.2). Source of every value: `docs/inventory.md` §2.4, §3.1 and §4 (file shorthands at its top; `file:line` into spawn at `e39e553`). The implementer reads the cited spawn rule before writing each CSS rule.

## Global Constraints

- Everything in plan 1's Global Constraints holds (tokens only; `--t-*` font sizes; weights 380/400/500/600; radii `--r-*`/0/1px/2px/50 %; one focus ring; reduced motion off; Phosphor bold 12/14/16; presentational; ko first, then en). The guard tests already enforce the CSS ones on every new stylesheet.
- **No pixel moves on adoption:** a size, padding, colour, shadow or backdrop exists only because spawn has it, and every difference listed in inventory §4 (Menus, Dialogs, TextInput, SearchField, Focus ring rows) is kept as a variant. Raw literals spawn uses (`rgba(255,255,255,.1)` borders, `rgba(6,7,10,.55)` backdrops, shadows) are kept as written, as plan 1 did for the switch.
- **No yellow** in any container: the `--accent` allow-list stays `['switch.css']`. Attention is amber: `color-mix(in srgb, var(--amber) 38%, transparent)` (= spawn's `rgba(255,181,74,.38)`).
- Popups portal to `document.body` unless a `PortalProvider` gives a container (so the docs preview's `.sp-ts-N` text size reaches them).
- Keys: Esc closes every popup; focus returns to what opened it; Enter while an IME is composing (`event.nativeEvent.isComposing` or `keyCode === 229`) never submits.
- Package version 0.2.0 via Changesets (minor: new components). Release and Pages deploy run only on the owner's word.

## Review Focus

1. Keyboard only: Dialog traps Tab and returns focus to its opener on close; Menu opens with Enter/Space/ArrowDown, moves with arrows, closes on Esc — Tasks 5, 6 tests.
2. Korean IME: Enter that ends a composition in TextInput/SearchField/FindBar does not submit or jump — Task 4 tests.
3. Text size 130 %: menu items, tabs and fields grow (min-height, never a fixed height except where spawn fixes one: chat card field h30, find input h24) — Task 4/6/7 CSS tests.
4. Long Korean text: tab and menu labels truncate on one line with `title`; Banner, Notice, EmptyState text wraps — Tasks 2, 3, 6, 7 tests.
5. Popups inside the docs preview at 80–130 %: portaled content takes the preview's text size — Task 5 test (`PortalProvider`).

---

### Task 1: Shared CSS test helper and the scrollbar utility

**Files:**
- Create: `packages/react/test/css.ts`, `packages/react/src/styles/scroll.css`, `packages/react/test/Scroll.test.ts`
- Modify: `packages/react/test/review-fixes.test.tsx` (import the helper), `packages/react/scripts/build-styles.ts` (add `scroll.css` after `base.css`)

**Interfaces:**
- Produces: `css(dir: string, file: string): string` and `rule(text: string, sel: string): Record<string,string>` (later rules win; reduced-motion rules skipped) in `test/css.ts`; classes `.sp-scroll`, `.sp-scroll--0|6|8|10`.

- [ ] **Step 1: failing test** `Scroll.test.ts`: `.sp-scroll--8 ::-webkit-scrollbar` width 8px and thumb `#2c303b` with `2px solid transparent` border and `background-clip: padding-box` (spawn px:463); `--6` width 6px (w:245); `--10` track 10px, thumb `rgba(255,255,255,.1)` 4px wide (ch:161); `--0` `scrollbar-width: none` (we:615); thumb hover `#3a3f4c`.
- [ ] **Step 2:** `npm test -w @spawn-ui/react -- Scroll` → FAIL (no file).
- [ ] **Step 3:** move `rule`/`css` out of review-fixes into `test/css.ts`; write `scroll.css` from the four spawn rules.
- [ ] **Step 4:** whole react suite PASS (review-fixes still green). Commit `feat(react): scrollbar utility, shared css test helper`.

### Task 2: Card, Notice, EmptyState

**Files:** `src/Card/{Card.tsx,card.css}`, `src/Notice/{Notice.tsx,notice.css}`, `src/EmptyState/{EmptyState.tsx,empty-state.css}`, `test/Containers.test.tsx`

**Interfaces:**
- Produces:
  - `Card({ look?: 'surface'|'flat'|'well'|'section'; pad?: 'widget'|'chat'|'system'; well?: 'card'|'term'; attention?: boolean } & HTMLAttributes<HTMLDivElement>)` forwardRef, default `surface`/`widget`. surface: `--card`, `1px solid var(--line)`, `--r-l`; pad widget `10px 12px` (w:39), chat `12px 14px` + `gap: 10px` grid (ch:360), system `16px`; flat: no background, `--r-m`, `10px 12px` (px:515); well: `--card` or `--term-bg`, `--r-m` (ch:62/123/558); section: transparent, only a bottom hairline, `10px 16px` (we:395); attention: the 2px amber bar inside the left edge as ch:362 draws it.
  - `Notice({ tone?: 'plain'|'warn'|'ok'; size?: 'meta'|'ui'; ink?: 2|3; align?: 'start'|'center'; boxed?: boolean; divider?: boolean; action?: { label: string; onClick(): void }; onDismiss?(): void; dismissLabel?: string; children })`, default plain/meta/ink 3/start. warn `--amber`, ok `--green`; boxed = w:228 (`6px 9px`, hairline, `--r-s`, enters with `wNoteIn` .2s, off under reduced motion); divider = ch:173 (centered word between hairlines); action = `Button variant="link"`; onDismiss = `IconButton size="xs"` with `dismissLabel` (default `'Dismiss'`).
  - `EmptyState({ size: 'hero'|'pane'|'inline'; picture?: ReactNode; title?: ReactNode; hint?: ReactNode; actions?: ReactNode; loading?: boolean })`. hero = ch:249 (gap 8, pad 24, title `--t-head` `--ink-2`, hint `--t-meta`); pane = we:270 (centered, gap 8); inline = px:129 (pad 20, `grid-column: 1 / -1`); loading → `role="status"` `aria-live="polite"`, a centered word (ch:207).
- [ ] **Step 1: failing tests:** each look/pad's padding, background, border and radius via `rule()`; Card attention draws `inset 2px 0 0` amber; Notice warn/ok colours; Notice onDismiss is a button named by `dismissLabel` and calls once; Notice boxed animation `none` under reduced motion (guard covers it, assert the class is there); EmptyState loading has role status; a 60-character Korean title in EmptyState/Notice wraps (`white-space` not `nowrap`, no `sp-truncate`).
- [ ] **Steps 2–4:** FAIL → implement → PASS. Commit `feat(react): Card, Notice, EmptyState`.

### Task 3: Banner, ListRow, Toolbar

**Files:** `src/Banner/*`, `src/ListRow/*`, `src/Toolbar/*` (tsx + css each), tests appended to `test/Containers.test.tsx`

**Interfaces:**
- Produces:
  - `Banner({ layout?: 'card'|'compact'|'row'|'floating'; icon?: PhosphorIcon; title?: ReactNode; actions?: ReactNode; pulse?: boolean; children })`, default `card`, root `role="status"`. All layouts: amber-38 % border. card = ch:237 (`--card`, `--r-l`, `10px 12px`, amber icon, body `--t-meta`, title `--t-ui`, actions are `Button size="sm"`); compact = px:429 (`8px 10px`, `pulse` = the pulsing dot); row = px:440 (`--r-m`, no background); floating = fb:75 (fixed top, `6px 6px 6px 14px`, shadow `0 10px 30px rgba(0,0,0,.5)`).
  - `ListRow({ look?: 'setting'|'item'; title: ReactNode; description?: ReactNode; control?: ReactNode; trailing?: ReactNode; selected?: boolean; onClick?(): void })`. setting = we:533 (`12px 0`, bottom hairline, title `--t-name`, description `--t-meta`, control at the right); item = we:308 (`9px 11px`, `--r-s`, hover hairline + `--hover`, `trailing` shown on hover and `:focus-within`; a button when `onClick`, focus ring inset `.sp-inset-ring`).
  - `Toolbar({ label: string; pad?: 'dex'|'filter'|'rank'; children })` → `role="group"` + `aria-label`; pad `14px 20px` (px:132) / `8px 20px` (px:164) / `12px 20px` (px:508); bottom hairline; wraps. `Toolbar.Label` = the filter word (`--t-meta`, `--ink-3`).
- [ ] **Step 1: failing tests:** Banner's border is the amber-38 % mix in every layout; floating's position/shadow; ListRow item with onClick is a button and its trailing is hidden until hover/focus-within (CSS rule); ListRow setting puts `control` after the text; Toolbar has role group with its label; long Banner title wraps.
- [ ] **Steps 2–4**, commit `feat(react): Banner, ListRow, Toolbar`.

### Task 4: TextInput, SearchField, FindBar

**Files:** `src/TextInput/*`, `src/SearchField/*`, `src/FindBar/*`, `test/Fields.test.tsx`

**Interfaces:**
- Produces:
  - `TextInput({ label: string; look?: 'rename'|'form'|'card'|'note'; size?: 'times'|'tool'|'rank'; multiline?: boolean; mono?: boolean; width?: number; onSubmit?(value: string): void; onCancel?(): void } & InputHTMLAttributes)` forwardRef (to input or textarea); `aria-label=label` unless a `<label>` points at it. rename = w:302 (`--card`, `1px solid var(--ink-3)` at rest, `--r-s`, `2px 7px`, `--t-name` 500); form = we:553/581, px:523 (`--card`, `--line`, `--r-s`; size times `4px 6px`, tool `6px 9px`, rank `6px 10px` width 180); card = ch:592 (bg `--bg`, height 30px, `0 10px`, focus border `--line-hover`); note = fb:124 (textarea, bg `--bg`, `9px 11px`, min-height 78px, `--t-name`). Focus border `--ink-3` except card. Enter → `onSubmit` (single line; multiline needs Ctrl/⌘+Enter), Esc → `onCancel`, both skipped while composing.
  - `SearchField({ label: string; value: string; onChange(v: string): void; width?: 120|150|170; icon?: boolean; placeholder?: string })`, `type="search"`. 150 = px:182 (`5px 9px`); 170 + icon = px:327 (`5px 26px 5px 9px`, magnifier 13 → `Icon` 12 at right 9px); 120 = px:565 (`4px 8px`).
  - `FindBar({ label: string; value: string; onChange(v: string): void; count?: { current: number; total: number }; onNext(): void; onPrev(): void; onClose(): void; note?: ReactNode; size?: 'chat'|'term'; labels?: { next: string; prev: string; close: string } })`. Absolute top 10 right 18, `--card-2`, `rgba(255,255,255,.1)` border, `--r-m`, `4px 4px 4px 8px` (ch:479, tm:225); input width 200 (chat: height 24); count min-width 44 `--t-meta`, `aria-live="polite"`; buttons `IconButton` 24; chat adds the note column and `--line-hover` on `:focus-within`. Enter next, Shift+Enter prev, Esc close (none while composing).
- [ ] **Step 1: failing tests:** Enter calls onSubmit with the value; **Enter with `isComposing: true` does not**; Esc calls onCancel; multiline Enter alone does not submit, Ctrl+Enter does; card look height 30px and focus border `--line-hover`; rename rest border `--ink-3`; SearchField icon variant keeps 26px right padding; FindBar Enter/Shift+Enter/Esc call next/prev/close and a composing Enter calls nothing; count reads "2/5" in a live region; heights grow with text except the two spawn fixes (card 30, find input 24).
- [ ] **Steps 2–4**, commit `feat(react): TextInput, SearchField, FindBar`.

### Task 5: Dialog and PortalProvider

**Files:** `src/Dialog/{Dialog.tsx,dialog.css}`, `src/Portal.tsx`, `test/Dialog.test.tsx`

**Interfaces:**
- Produces:
  - `PortalProvider({ container: HTMLElement | null; children })` and `usePortalContainer(): HTMLElement | undefined` — every popup's Base UI `Portal` uses it.
  - `Dialog({ open: boolean; onClose(): void; title: string; kind?: 'picker'|'settings'|'full'|'lightbox'|'popover'; hideTitle?: boolean; head?: ReactNode; foot?: ReactNode; sidebar?: ReactNode; closeLabel?: string; children })` on `@base-ui/react/dialog` (Popup labelled by its Title; Esc and backdrop click → onClose; focus trapped and returned). Default `picker`. Per kind (inventory Dialog row + §4): picker = we:284 (backdrop `rgba(6,7,10,.55)`, width `min(520px, 94vw)`, max-height 80vh, shadow `0 16px 48px rgba(0,0,0,.5)`, head `11px 14px` `--t-name` 600 with bottom hairline); settings = we:511 (backdrop `.6` with 16px padding, 6px below 560px; `min(760px,100%)` × `min(560px,100%)`; `sidebar` column); full = ch:602 (backdrop `rgba(0,0,0,.55)`, width `var(--read-w)`, shadow `0 12px 36px rgba(0,0,0,.5)`, head `8px 10px 8px 16px`); lightbox = ch:322 (backdrop `.86`, no panel chrome); popover = fb:100 (width 340, shadow `0 18px 48px rgba(0,0,0,.55)`, `rgba(255,255,255,.1)` border). Panels `--card`, `1px solid var(--line)`, `--r-l`. Close button `IconButton` labelled `closeLabel` (default `'Close'`).
- [ ] **Step 1: failing tests:** open renders role dialog named by title; Esc and backdrop click call onClose once; Tab from the last control lands on the first (trap); closing returns focus to the opener button; each kind's backdrop, shadow and width via `rule()`; `hideTitle` keeps the accessible name; inside `<PortalProvider container={el}>` the dialog renders within `el` (so `.sp-ts-130` on it applies).
- [ ] **Steps 2–4**, commit `feat(react): Dialog, PortalProvider`.

### Task 6: Menu

**Files:** `src/Menu/{Menu.tsx,menu.css}`, `test/Menu.test.tsx`

**Interfaces:**
- Consumes: `usePortalContainer` (Task 5).
- Produces: `Menu({ trigger: ReactElement; label: string; items: MenuItem[]; onSelect(value: string): void; title?: ReactNode; look?: 'popover'|'control'; placement?: 'up'|'down'; align?: 'start'|'end'; width?: number; open?: boolean; onOpenChange?(open: boolean): void })`, `type MenuItem = { value: string; label: ReactNode; desc?: ReactNode; icon?: PhosphorIcon; checked?: boolean; disabled?: boolean }`, on `@base-ui/react/menu`. popover look = we:221/447 (panel `--card`, pad 4, `rgba(255,255,255,.1)` border, `--r-l`, shadow `0 12px 32px rgba(0,0,0,.45)`, offset 6; item grid `16px 1fr`, `6px 8px`, `--t-ui`, hover/highlight `--sel-bg`, check shown by opacity; title `6px 8px 4px` `--t-meta` `--ink-3`; `desc` `--t-meta`); control look = ch:550 (`--line` border, `--r-m`, shadow `0 8px 24px rgba(0,0,0,.45)`, offset 4, item `5px 8px` flex, hover `--hover`, 12px check). Checked items use `role="menuitemradio"` with `aria-checked`. Item focus ring inset (−2px).
- [ ] **Step 1: failing tests:** Enter on the trigger opens, ArrowDown moves the highlight, Enter selects → onSelect(value) once and closes; Esc closes and focus returns to the trigger; disabled item is skipped and never selected; checked item has aria-checked true; each look's panel border/radius/shadow and item padding/hover via `rule()`; item min-height grows with text (no fixed height); a long Korean item label truncates with `title`.
- [ ] **Steps 2–4**, commit `feat(react): Menu`. (The composer's mention/slash lists are driven by the text field, not a trigger; they reuse these item classes in plan 4.)

### Task 7: Tooltip and Tabs

**Files:** `src/Tooltip/*`, `src/Tabs/*`, `test/TooltipTabs.test.tsx`

**Interfaces:**
- Consumes: `usePortalContainer` (Task 5), `IconButton` (plan 1).
- Produces:
  - `Tooltip({ content: ReactNode; children: ReactElement; look?: 'note'|'tab'; placement?: 'top'|'bottom'|'left'|'right'; open?: boolean; onOpenChange?(open: boolean): void; timeout?: number })` on `@base-ui/react/tooltip`. note = we:169 (`--card`, `1px solid var(--line-hover)`, `--r-m`, `6px 10px`, `--t-meta`, line-height 1.5, max-width 300px); tab = we:693 (centered top, `7px 12px`, `--t-ui`). `timeout` closes a controlled-open note after that many ms (the lens note). spawn keeps native `title=` until the owner asks; this is offered, not imposed.
  - `Tabs({ label: string; value: string; onValueChange(v: string): void; items: TabItem[]; orientation?: 'vertical'|'top'; onClose?(value: string): void; closeLabel?(item: TabItem): string; children? })`, `type TabItem = { value: string; label: ReactNode; picture?: ReactNode; dot?: ReactNode; title?: string; disabled?: boolean }`, `TabPanel({ value: string; children })`, on `@base-ui/react/tabs`. vertical = we:516 (min-height 32, `7px 10px`, `--t-ui`, on `--sel-bg`; a row below 560px as spawn's media rule); top = we:669 (radius `var(--r-s) var(--r-s) 0 0`, `0 4px 0 8px`, on `--hover` + `inset 0 -2px 0 var(--ink-2)`, picture 18 → 20 when on). Close × is an `IconButton size="xs"` **beside** the tab (never nested in it), shown on hover/focus-within.
- [ ] **Step 1: failing tests:** Tooltip shows its content on focus of the trigger and hides on Esc; controlled `open` with `timeout={50}` calls onOpenChange(false) after 50 ms (fake timers); Tabs arrow keys move between tabs, the chosen has aria-selected; `onClose` renders a separate button per tab named by `closeLabel` and it is not inside the `role="tab"` element; top on-state underline and vertical min-height via `rule()`; long Korean tab label truncates with `title`.
- [ ] **Steps 2–4**, commit `feat(react): Tooltip, Tabs`.

### Task 8: Docs — the Containers group

**Files:**
- Modify: `apps/docs/astro.config.mjs` (sidebar group 담는 것 / Containers after Status), `apps/docs/src/components/Demo.tsx` (demos), `apps/docs/src/components/Preview.tsx` (wrap children in `PortalProvider` with the preview root), `apps/docs/src/content/docs/components/index.mdx` (+ en), `apps/docs/test/build.test.ts`
- Create: `apps/docs/src/content/docs/components/containers/*.mdx` (13 pages) and `en/…`; `components/foundations/scrollbar.mdx` (+ en)

- [ ] **Step 1: failing test:** extend build.test: the sidebar has 담는 것 / Containers; the scrollbar page exists in both languages. (The existing "every exported component has a page" test already fails for the 13 new exports.)
- [ ] **Step 2:** `npm run build && npm test -w @spawn-ui/docs` → FAIL.
- [ ] **Step 3:** one page per component in plan 1's order (title + one line, Demo, a section per prop with a Demo, an example from spawn's real use — e.g. Dialog: the resume picker; Menu: the text-size menu; Banner: the permission ask; FindBar: the chat's find — PropsTable, 접근성, "spawn에서 합친 것" listing the merged classes from inventory §2.4). Korean first, then English. Popup demos open from a button inside the preview so the 80–130 % switch reaches them.
- [ ] **Step 4:** build + docs tests PASS; screenshot the Dialog and Menu pages at 100 % and 130 % (`scripts/shot.mjs`) and look at them. Commit `docs: containers`.

### Task 9: Release notes and version

**Files:** `.changeset/*.md`, `packages/react/package.json`, `packages/react/CHANGELOG.md`

- [ ] **Step 1:** a changeset for `@spawn-ui/react` minor: "Containers: Card, Notice, EmptyState, Banner, ListRow, Toolbar, TextInput, SearchField, FindBar, Dialog, Menu, Tooltip, Tabs; scrollbar utility; PortalProvider." (tokens unchanged).
- [ ] **Step 2:** `npx changeset version` → react 0.2.0; `npm run build && npm run typecheck && npm test` green; the releases test shows 0.2.0. Commit `chore: release notes 0.2.0`.
- [ ] **Step 3:** report to the owner; push, run the release workflow and the Pages deploy only on their word.
