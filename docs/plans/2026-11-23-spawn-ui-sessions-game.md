# spawn-ui Sessions & Game (plan 3 of 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** spawn's own components (v0.3.0): the session list, rail, headers, panes and meters (spawn · 세션), and the Pokémon parts — sprites, cells, tiers, toasts, rows (spawn · 게임) — presentational, with spawn's exact values, so its screens can later be built from them.

**Architecture:** As plans 1–2: a folder per component under `packages/react/src/` (tsx + css), `sp-` global CSS on tokens only, tests pinning spawn's values with `test/css.ts` `rule()`. Every component takes data and callbacks as props (a row gets `{ name, mood, hp, … }`, `onOpen`, `onClose`), never stores or IPC. Pictures are passed in (`src` / a ReactNode); spawn-ui ships no Pokémon art. Composition over copies: SessionRow uses SessionPicture, Meter, Pill, StatusDot, IconButton; the toast uses PokemonSprite and TierLabel.

**Tech Stack:** as plans 1–2.

**Spec:** `docs/specs/2026-11-23-spawn-ui-design-system-design.md` (Components: spawn: sessions v0.3, spawn: game v0.3). Values: `docs/inventory.md` §2.5, §2.6 and §4 (Chosen marks, Sprites, StatusDot, Meter), each citing spawn's CSS at `e39e553`; read the cited rule in `Documents/spawn/src/styles` before writing each CSS rule. Where spawn changed after `e39e553` (1.10.14: the list head lost its count), spawn's current `main` wins.

## Global Constraints

- Everything in plans 1–2 holds; the guard tests enforce the CSS rules on every new stylesheet.
- **Yellow allow-list grows only to spawn's own yellow:** the chosen row's 2px bar and the rail's (`--accent`), the update button (`--accent` fill), the drop zone's dashed edge (accent 60 %), the picked cell's inset ring. Extend `ACCENT_OK` in `test/guards.test.ts` by file, each with its spawn source in a comment; nothing else turns yellow.
- **Tiers are a dot and a word**, never a filled chip; the word is always there (colour never alone).
- **Sprites:** smooth everywhere, `image-rendering: pixelated` only in WildRow; never scaled up past their natural size where spawn caps them (`max`); the silhouette filter is one class (`brightness(0) invert(0.32)`), not three copies.
- **The toast never takes the text step** (spawn fixes `--t-*` at 100 % in the toast window): its CSS reads fixed values where spawn's does (title 15px is spawn's one fixed size — allowed in the toast's file only, listed in the guard as an exception with its source).
- **Motion:** hop 1.2s (needs-you), toast in .3s / out .35s, fold-away .22s, rotate .15s, drop slide 120ms — all off under reduced motion.
- Inventory drift: ListHead has no count since 1.10.14 (mode first, actions at the right); write it as spawn has it now.

## Review Focus

1. A session row from the keyboard: it is a button named by its name and status; Enter opens; F2 renames; its × is reachable (shown on focus) and asks once before closing (`onClose` gets a confirm step).
2. Colour never alone: mood, tier, HP tone and the update state are each said in words (visible or `VisuallyHidden`).
3. Text size 130 %: rows, headers and the usage grid grow; the toast does not (its fixed scale).
4. Long Korean names and branches: one line, ellipsis, `title` with the whole.
5. Reduced motion: the needs-you hop, toast entrance, strip fold and notes chevron do not move.

---

### Task 1: Leftovers from plans 1–2 that this plan owns

**Files:** `src/Tag/*`, `src/Meter/*`, tests beside them; `docs/ISSUES.md` (strike the two lines)

- [ ] **Step 1: failing tests:** `Tag` `tone?: 'plain' | 'run' | 'setting' | 'change'` — run = `.resume-badge.run` (amber text and border at spawn's values), setting = `.set-tag`, change = `.chat-ch-tag` (read each rule; radius `--r-xs` or `--r-s` as written; paddings `0 5` / `0 6` / `1 6` / `0 4` per inventory §4 Tags). `Meter` `full?: boolean` on kind hp → class `sp-meter--full` at opacity 0.35 (spawn `.hp-full`).
- [ ] **Steps 2–4:** FAIL → implement → PASS (whole react suite). Commit `feat(react): Tag tones, Meter full`.

### Task 2: Pictures and tiers — PokemonSprite, SessionPicture, TierLabel, TypeTag

**Files:** `src/PokemonSprite/*`, `src/SessionPicture/*`, `src/TierLabel/*`, `src/TypeTag/*`, `test/Pictures.test.tsx`

**Interfaces:**
- Produces:
  - `PokemonSprite({ src: string; alt?: string; size: number; max?: boolean; silhouette?: boolean; faded?: boolean; pixelated?: boolean })` — `<img>` `width/height = size`, `object-fit: contain`, `draggable={false}`; `max` → `max-width/height: size` with natural size kept (no upscaling); silhouette class `sp-silhouette` (`filter: brightness(0) invert(0.32)`); faded = opacity .4 + grayscale .6 (the log); `alt=""` when no alt (decorative).
  - `SessionPicture({ kind: 'picture' | 'glyph' | 'shell'; src?: string; size: 18 | 20 | 22 | 24 | 26 | 64 | 96; hop?: boolean; label?: string })` — glyph: 1px `--line` box `--r-s` (64: `--r-l`) with the terminal icon in `--ink-3`; shell: `>_` mono 10px in a hairline box; hop: the needs-you hop 1.2s (off under reduced motion).
  - `TierLabel({ tier: Tier; children?: ReactNode; gap?: 4 | 5 })` — `.tdot` + the tier's word (default: the tier name passed by the app; spawn-ui exports `TIER_WORDS` ko/en as a convenience) in `--tier`, `--t-meta` 500.
  - `TypeTag({ type: PokemonType; children: ReactNode })` — hairline Tag in the type's text colour (17 types, values from spawn `pokedex.css` `.type-*`), `type PokemonType`.
- [ ] **Step 1: failing tests:** sprite never upscales with `max`; pixelated only when asked; one silhouette class in the package (grep the CSS: one `brightness(0)`); SessionPicture sizes and kinds via `rule()`; hop animation off under reduced motion (guard) and its name; TierLabel renders dot + word, no background, word colour `var(--tier)`; TypeTag 17 classes match spawn's colours.
- [ ] **Steps 2–4**, commit `feat(react): sprites, session pictures, tiers, types`.

### Task 3: SessionRow

**Files:** `src/SessionRow/*`, `test/SessionRow.test.tsx`

**Interfaces:**
- Consumes: SessionPicture, Meter (hp, full), Pill, StatusDot, IconButton, Tag (plans 1–3).
- Produces: `SessionRow({ name: string; project?: string; branch?: string; model?: string; lv?: number; species?: string; tool?: string; context?: string; hp?: number; hpFull?: boolean; mood: 'working' | 'needs-you' | 'error' | 'idle' | 'ended'; moodLabel: string; picture: ReactNode; chosen?: boolean; compact?: boolean; lifted?: boolean; widget?: boolean; asking?: ReactNode; onOpen(): void; onRename?(): void; onClose?(): void; closeLabel?: string; closeConfirmLabel?: string })`. Detailed (w:147…): pad `8px 8px 8px 10px`, margin `0 -8px`, `--r-m`, picture 24 + gap 10, line 2 `--t-meta` min-h 16; compact: pad `5px 8px 5px 10px`, picture 20, the HP tick (Meter colour only) instead of the bar, × in the dot's place on hover/focus. States: hover `--hover`; chosen `--row-sel-bg` + 2px `--accent` bar at left −8 (widget −4) top/bottom 10 (compact 6); ended .45; lifted `--card-2` + `0 10px 28px rgba(0,0,0,.45)`. Name `--t-name` 500 `--ink-2` (chosen `--ink`); branch mono `calc(var(--t-meta) - 0.5px)`, max 120, `⎇ ` prefix. Root `role="button"` `tabIndex=0`, `aria-current` when chosen, name = `${name}, ${moodLabel}`; Enter/Space → onOpen; F2 → onRename; × first click shows `closeConfirmLabel` pill, second calls onClose (spawn's two-step).
- [ ] **Step 1: failing tests:** the paddings and states above via `rule()`; keyboard (Enter, Space, F2); × two-step; × reachable by Tab and shown on `:focus-within`; mood said in words; long name/branch truncate with title; hop only when mood needs-you; `--accent` allowed in `session-row.css` (guard allow-list + comment `.w-row.chosen::before`).
- [ ] **Steps 2–4**, commit `feat(react): SessionRow`.

### Task 4: The side panel — Rail, RailButton, ListHead, Launcher, Account

**Files:** `src/Rail/*` (Rail + RailButton), `src/ListHead/*`, `src/Launcher/*`, `src/Account/*`, `test/SidePanel.test.tsx`

**Interfaces:**
- Produces: `Rail({ children; label: string })` (56w, gap 2, pad `0 0 10px`, `--side-bg`, right hairline) with `Rail.Separator`; `RailButton({ label: string; icon?: PhosphorIcon; picture?: ReactNode; mood?; chosen?; ended?; onClick })` (38, `--r-m`, `--ink-3`; session: picture 26, chosen `rgba(255,255,255,.05)` + 2px accent bar at left −9, mood dot 6 at right 4 bottom 4); `ListHead({ mode: 'compact' | 'detail'; onMode; labels: { compact; detail; group }; actions?: ReactNode })` (gap 4, margin `2px 0 6px`, `--t-meta` `--ink-3`; mode first, actions pushed right by `margin-left: auto`); `Launcher({ newLabel; onNew; folderLabel?; onFolder?; resumeLabel?; onResume? })` (main ghost Button min-h 34 with Plus 15 → `Icon` 16, alts IconButton 30); `Account({ user?: { name; email?; photo? }; sync?: ReactNode; signInLabel; onSignIn; onSignOut?; signOutLabel? })` (avatar 24 round, initial `--t-meta` 500).
- [ ] **Step 1: failing tests:** values via `rule()`; RailButton named by label, `aria-current` when chosen, mood in words; ListHead has no count and its mode group is first; Launcher buttons named; Account initial from the name when no photo, image alt "".
- [ ] **Steps 2–4**, commit `feat(react): rail, list head, launcher, account`.

### Task 5: Headers and edges — SessionHeader, PaneHead, AppHeader, TopBar, ResizeHandle

**Files:** `src/SessionHeader/*`, `src/PaneHead/*`, `src/AppHeader/*` (AppHeader + TopBar), `src/ResizeHandle/*`, `test/Headers.test.tsx`

**Interfaces:**
- Produces: `SessionHeader({ picture; name; project?; branch?; tools?: ReactNode; lens?: ReactNode; onRename?; onClose?; closeLabel?; closeConfirmLabel? })` (bar `--sess-bar-h` 40, pad `0 8px 0 10px`, bottom hairline, `--bg`; name `--t-name` 500, project `--t-meta` `--ink-3`, branch mono max 220; container queries at 700 and 420 hide the project and branch); `PaneHead({ on?: boolean; children; more?: ReactNode })` (flex 1, pad `0 6px 0 10px`, left hairline, on `--hover`); `AppHeader({ brand: ReactNode; actions?; windowControls?; platform?: 'win' | 'mac' })` (42, pad `6px 8px 6px 12px`, mac left 78, `-webkit-app-region: drag`, its buttons `no-drag`); `TopBar({ children })` (`--head-h`, pad `0 8px 0 10px`, gap 2, bottom hairline); `ResizeHandle({ label: string; edge: 'left' | 'right'; hit?: 7 | 22; lineAtRest?: boolean; value: number; min: number; max: number; step?: number; onResize(v: number): void; onReset?(): void })` — `role="separator"` `aria-orientation="vertical"` `aria-valuenow/min/max`, ←/→ step, Home → onReset, double-click → onReset, pointer drag (setPointerCapture) clamped; line 1px transparent at rest (pane: `--line`), hover/drag `rgba(255,255,255,.3)`, focus `--ink-3`.
- [ ] **Step 1: failing tests:** values; header container-query rules exist; ResizeHandle keys (← → Home) and clamping, aria values; drag region on AppHeader and no-drag on its controls.
- [ ] **Steps 2–4**, commit `feat(react): headers, pane head, resize handle`.

### Task 6: Small live parts — DragCard, DropZone, QueueStrip, UpdateButton, TextSizeControl, UsageBars

**Files:** one folder each, `test/LiveParts.test.tsx`

**Interfaces:**
- Produces: `DragCard({ picture; label; x; y })` (fixed, max 220, `5px 10px 5px 6px`, `--r-m`, `--card-2`, 1px `--line-hover`, `0 8px 24px rgba(0,0,0,.45)`, `aria-hidden`); `DropZone({ left: number; width: number; hint: string; full?: boolean })` (fractions → %, dashed accent 60 %, `color-mix(in srgb, var(--accent) 9%, var(--bg) 55%)`, `--r-l`, slide 120ms; full → `--red-text`; `aria-hidden` with the hint also in a live region); `QueueStrip({ count; items: ReactNode[]; open; onToggle; label })` (h30, `0 12px`, `rgba(255,255,255,.025)`, top `--r-l`, dot 5, list max-h 180, chevron flips, `aria-expanded`); `UpdateButton({ state: 'available' | 'downloading' | 'ready' | 'failed'; progress?: number; label: string; onClick })` (22 `--accent` square; downloading .5 with `n%`; ready a pill `0 7px 0 6px`; failed inset danger 45 % + `--red-text`; the state always in words: visible in the pill or as its name); `TextSizeControl({ step; steps: { value; label }[]; onStep; compact?; labels: { smaller; larger; menu } })` (boxed h28, −/+ 24×26, current `--t-meta` between hairlines; compact → one 가 button opening `Menu`); `UsageBars({ limits: { label; pct; reset; tone? }[]; loading?; idle?: ReactNode; orientation?: 'grid' | 'rail' })` (grid `minmax(36px, max-content) 1fr 30px 74px`, gap `10px 7px`, pad `9px 12px`; pct `--num-ink`, warn `--amber`, danger `--red-text`; loading shimmer off under reduced motion; rail: two vertical Meters 26 tall).
- [ ] **Step 1: failing tests:** values; UpdateButton says its state in words in every state; QueueStrip `aria-expanded` flips; TextSizeControl − / + call onStep with the neighbour and stop at the ends (disabled); UsageBars tones at spawn's thresholds (reuse `meterTone`); accent allowed in drop-zone.css and update-button.css (allow-list + comments).
- [ ] **Steps 2–4**, commit `feat(react): drag card, drop zone, queue, update, text size, usage`.

### Task 7: Game cells — MonCell, DexStrip, StatTile

**Files:** `src/MonCell/*`, `src/DexStrip/*`, `src/StatTile/*`, `test/GameCells.test.tsx`

**Interfaces:**
- Consumes: PokemonSprite, TierLabel.
- Produces: `MonCell({ look: 'dex' | 'box' | 'box-icon' | 'picker' | 'partner'; sprite?: ReactNode; label: string; picked?: boolean; unknown?: boolean; no?: string; shiny?: boolean; count?: number; working?: boolean; dragging?: boolean; onClick?(): void })` — a button named by `label` (unknown says so), `aria-pressed` when picked; all on `--mon-bg` (hover `--mon-bg-hover`), `--r-m`; dex square min 88, sprite 62, corner labels `--t-micro`, unknown `--unknown-bg` with `?` in `--q-ink`; box 96 pad 16 sprite 50; box-icon min 76 pad 14 sprite ≤48; picker min 64 pad `8px 4px 6px`, border transparent → `--line-hover`, label `--t-micro`; partner 44 sprite 36; picked = `inset 0 0 0 1px var(--accent)` (dex, box) or `--ink-3` border + `--sel-bg` (partner); dragging .4. `DexStrip({ label; count; total; recent: { key; sprite }[]; isNew?: boolean; onOpen })` (grid label · count · recent, gap 10; sprites 21 margin 3; fold-away .22s; new dot 5). `StatTile({ label; value; of?; pct?; tone?: Tier | 'plain' })` (value `calc(var(--t-num) + 8px)` 500, −2 % letter-spacing; tier column `calc(var(--t-num) + 3px)`, its 2px Meter in `--tier`).
- [ ] **Step 1: failing tests:** each look's values; picked rings (accent only for dex and box — allow-list `mon-cell.css` with its comment); unknown named and drawn; DexStrip button named with count; StatTile font-size calc on `--t-num` (guard accepts calc).
- [ ] **Steps 2–4**, commit `feat(react): mon cells, dex strip, stat tile`.

### Task 8: Game rows and cards — WildRow, CatchToast, LeaderboardRow, LogRow, StepCount, DexDetailCard, PatchNotes

**Files:** one folder each, `test/GameRows.test.tsx`

**Interfaces:**
- Consumes: PokemonSprite, TierLabel, Tag, Badge, Button, Dialog.
- Produces: `WildRow({ sprite; name; result: 'caught' | 'fled'; resultLabel: string; tier; tierLabel; ball?: ReactNode; appear?: boolean })` (min-h 34, `4px 12px 4px 6px`, `--r-m`, hairline, `rgba(255,255,255,.015)`, opacity .72, sprite 24 **pixelated**, ball 14, enter .5s); `CatchToast({ kind: 'catch' | 'flee' | 'levelup'; sprite; eyebrow; title; meta?; via?; viaWarn?; tier?; shiny?; more?: number; onClose?; closeLabel? })` (grid `64px 1fr`, gap 14, `14px 18px 14px 14px`, `--r-toast`, `--toast-bg`; art 64 `--r-l` sprite 48; title 15px 600 — the one fixed size, allowed in `catch-toast.css` only; border by tier as spawn's `.w-toast.tier-*`; flee: silhouette; in .3s, out .35s; `role="status"`); `LeaderboardRow({ place; icon?; name; value; unit?; me?; meLabel?; npc?; medal?: ReactNode })` (grid `36px 30px 1fr auto`, gap 10, `6px 10px`, top 3 `8px 10px`, `.me` `--sel-bg`, name `--t-name` 500 + the "나" Tag); `LogRow({ time; icon; text; sub?; kind?: 'catch' | 'flee' | 'levelup' })` and `LogDay({ label })` (sticky head −6 top) (row min-h 60, `12px 0`, gap 12, time 5.6em, icon 32); `StepCount({ steps: number; label: string })` (inline-flex gap 4, paw glyph, `aria-label`); `DexDetailCard({ art; name; no?; facts: { label; value }[]; owned?: ReactNode; flavor?: ReactNode; actions?; onClose?; closeLabel? })` (art 160h `--r-l` `--mon-bg`, name 16px → `--t-head` per the guard's rule? use spawn's value: if spawn writes 16px, take `--t-head` only when equal; else ledger a ruling; facts grid `84px 1fr` with hairlines; flavor lh 1.7); `PatchNotes({ releases: { version; date?; items: ReactNode[] }[]; open; onClose; title; okLabel })` (a Dialog; `<details>` groups whose `›` rotates .15s; body `4px 16px 8px` `--t-name` lh 1.55; foot solid Button h36).
- [ ] **Step 1: failing tests:** values; WildRow is the only `pixelated` in the package; toast fixed sizes only in its file (guard exception), role status, close named; LeaderboardRow `me` says it in words; StepCount named; PatchNotes is a dialog with expandable groups and its chevron rotation off under reduced motion.
- [ ] **Steps 2–4**, commit `feat(react): wild row, toast, leaderboard, log, steps, dex card, patch notes`.

### Task 9: Docs — the two spawn groups (minimal pages)

**Files:** `apps/docs/astro.config.mjs` (groups `spawn · 세션` / `spawn · sessions`, `spawn · 게임` / `spawn · game`), `src/components/Demo.tsx`, `src/content/docs/{,en/}components/{sessions,game}/*.mdx`, both index pages, `test/build.test.ts`.

- [ ] **Step 1: failing test:** the two groups in the sidebar (ko, en); the existing "every exported component has a page" test fails for the new exports.
- [ ] **Step 2:** FAIL. **Step 3:** one minimal page per component (line, demo, props, accessibility, merged classes), Korean then English; demo pictures are drawn shapes or the docs' own small sprite placeholders (spawn-ui ships no Pokémon art; the docs may load sprites from spawn's public URLs only if they are already public — else a neutral placeholder). **Step 4:** build + tests PASS; screenshot SessionRow, the toast and MonCell at 100 / 130 %. Commit `docs: spawn sessions and game`.

### Task 10: Release notes and version

- [ ] **Step 1:** changeset `@spawn-ui/react` minor: the lists of Tasks 1–8. **Step 2:** `npx changeset version` → 0.3.0; build, typecheck, test green. Commit `chore: release notes 0.3.0`. **Step 3:** add any new deferred items to `docs/ISSUES.md`.
