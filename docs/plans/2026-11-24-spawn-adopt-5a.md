# Plan 5a: spawn takes spawn-ui in — groundwork (no visible change)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use `- [ ]`.

**Goal:** spawn installs `@spawn-ui/tokens` and `@spawn-ui/react`, loads their CSS, and gets the tools that prove every later swap changes nothing on screen: a pixel diff and one command that shoots and runs the whole regression set. The app looks and behaves exactly as 1.10.14.

**Architecture:** The two packages are packed (`npm pack`) in spawn-ui and kept as tarballs in spawn (`vendor/spawn-ui/`), referenced by `file:` from **devDependencies** (Vite bundles the renderer, so nothing new ships in the app folder, and the Mac CI's `npm ci` needs no sibling checkout). spawn's `tokens.css` keeps its non-token rules and takes the tokens from the package. The components' CSS loads before spawn's own, so where both declare the same global rule, spawn's wins and the values are checked equal by a test.

**Tech stack:** spawn (React 18, Vite 5, Electron, vitest node env, Playwright harness `tests/visual/shots.mjs`), pngjs 7 (already a dependency).

**Spec:** the owner's words — "Spawn 앱의 모양이 바뀌거나 기능충돌이 일어나거나 버그가 있으면 안돼. 꼼꼼히 진행해줘." — and plan 1's design-system scope (spawn-ui README).

## Global constraints

- **Nothing visible changes.** Every pixel diff of the regression set is 0 against the 1.10.14 baseline (same machine, same build flags). A non-zero file is a stop: explain it or undo it.
- **Nothing behaves differently.** Every harness flow that passes on the baseline passes after; the vitest suite and `tsc` stay green.
- Where spawn-ui and spawn differ, **spawn is right**: the fix goes into spawn-ui (new package version), never into spawn's look.
- spawn-ui packages are devDependencies, from `vendor/spawn-ui/*.tgz`; no npm publish, no sibling path.
- Work on branch `feat/spawn-ui-5a` in spawn; never on `chat-view`; no push or release without the owner's "푸시해".
- Ends with a local test build (`npm run pack` → `release/win-unpacked/spawn.exe`) for the owner.
- Record before → after numbers (bundle size of `dist/assets`, CSS bytes, test counts) in the ledger.

## Review focus

1. A global rule in spawn-ui's `styles.css` that spawn also has (`:root`, `:root.ts-*`, `.tier-*`, `.tdot`) — same value today, but a later spawn-ui change could silently restyle spawn. The guard test must fail on any drift.
2. Clean-clone install: the Mac CI runs `npm ci` on a fresh checkout — the tarball paths and lockfile must resolve there.
3. Packaged app: `release/win-unpacked/resources/app/node_modules` must not gain `@spawn-ui` or `@base-ui`.
4. CSS order: the components' CSS before spawn's in every entry (Widget, SystemPage, Toast, QaPage) — an entry that loads it after would let a `:root` rule win.
5. Pixel diff noise: font anti-aliasing between two runs of the *same* build must already be 0, or the tool is useless; prove it first.

---

### Task 1: Pixel diff tool

**Files:** Create `tests/visual/diff.mjs`; Test `tests/pixel-diff.test.ts`

**Interfaces — Produces:** `diffDirs(before: string, after: string, out?: string): Promise<{ file: string, pixels: number, size?: 'mismatch' | 'missing' }[]>` (exported); CLI `node tests/visual/diff.mjs <before> <after> [--out <dir>]` prints one line per file with differences, writes a red-on-grey diff PNG per differing file into `--out`, exits 1 if any file differs, is missing on one side, or changed size.

- [ ] Test: two 4×4 PNGs written with pngjs in a temp dir — identical → `[]`; one pixel changed → `[{ file, pixels: 1 }]`; a 4×5 → `size: 'mismatch'`; a file only in `before` → `size: 'missing'`. RED, then implement (exact RGBA compare, no threshold), GREEN.
- [ ] Commit `test(visual): a pixel diff of two shot folders`.

### Task 2: One regression command + the 1.10.14 baseline

**Files:** Create `tests/visual/regress.mjs`; Modify `tests/visual/README.md`, `.gitignore` (`tests/visual/.regress/`)

**Interfaces — Produces:** `node tests/visual/regress.mjs --out <dir>` builds nothing itself (expects a fresh `npx vite build`), then runs `shots.mjs` for: every surface in `--help` at both sizes; `session,dex,box,log,rank,settings,chat` at `--text small` and `--text xlarge`; `session,dex,chat` in `--lang en` and `--lang ja`; `--side 240` for `session`. Then every `--flow` named in the README (except `chat-soak`, `chat-perf`, `chat-off` — long or needing their own baseline), each recorded `pass|fail` in `<dir>/flows.json`. `--compare <baseDir>` runs `diffDirs` on the shots and lists flows that passed in the base and fail now; exits 1 on either.

- [ ] Prove the tool is quiet: build 1.10.14, run regress twice into two dirs, `--compare` → 0 files, 0 flow changes. If fonts jitter, find why (it must not be "tolerate it"), ledger it.
- [ ] Keep that run as the baseline `tests/visual/.regress/base-1.10.14/` (git-ignored; its `flows.json` notes the flows that already fail at baseline, so they are not counted as new).
- [ ] Commit `test(visual): one command shoots and runs the regression set and compares it with a base`.

### Task 3: Install the packages

**Files:** Create `vendor/spawn-ui/spawn-ui-tokens-0.1.0.tgz`, `vendor/spawn-ui/spawn-ui-react-0.4.0.tgz`, `vendor/spawn-ui/README.md` (how to refresh: `npm pack` in spawn-ui's packages, copy, `npm i -D`); Modify `package.json`, `package-lock.json`

- [ ] In spawn-ui: `npm run build`, `npm pack -w @spawn-ui/tokens -w @spawn-ui/react`, copy the two tarballs. `@spawn-ui/react` depends on `@spawn-ui/tokens ^0.1.0` — install tokens first so npm takes the local one, never the registry; check `package-lock.json` resolves both to `file:vendor/...`.
- [ ] `npm i -D file:vendor/spawn-ui/spawn-ui-tokens-0.1.0.tgz file:vendor/spawn-ui/spawn-ui-react-0.4.0.tgz`.
- [ ] Test (`tests/spawn-ui-install.test.ts`): both are in `devDependencies` with `file:vendor/spawn-ui/` specs and not in `dependencies`; the lock entries' `resolved` start with `file:vendor/`. RED before the install, GREEN after.
- [ ] Clean clone check: `git worktree add` a temp copy, `npm ci` there, `npx tsc --noEmit`, remove. Expected: no error, no registry fetch of `@spawn-ui/*`.
- [ ] `tsc` and full `vitest` green. Commit `build: spawn-ui packages from vendor tarballs (dev only)`.

### Task 4: Tokens from the package

**Files:** Modify `src/styles/tokens.css`; Test `tests/tokens.test.ts` (extend)

- [ ] Test: every custom property `src/styles/tokens.css` resolves to (after its `@import`) equals 1.10.14's value — the old file's declarations are copied into the test as the expected table; the file itself no longer declares `--ink`, `--t-ui`, … (it imports `@spawn-ui/tokens/tokens.css` and keeps only `.tier-*`, `.tdot` and what the package lacks). RED, then change the file, GREEN.
- [ ] `npx vite build`, regress `--compare base-1.10.14` → 0. Ledger the CSS bytes before → after.
- [ ] Commit `style(tokens): take the tokens from @spawn-ui/tokens (same values)`.

### Task 5: The components' CSS, guarded

**Files:** Modify the four entries (`src/Widget.tsx`'s entry, `src/SystemPage.tsx`, `src/Toast.tsx`, `src/QaPage.tsx`): `import '@spawn-ui/react/styles.css'` **before** `./styles/tokens.css`; Test `tests/spawn-ui-css.test.ts`

- [ ] Test 1 (drift guard): parse `node_modules/@spawn-ui/react/dist/styles.css`; every rule whose selector list is not entirely `sp-`-scoped (`.sp-*`, `[a-z]+.sp-*`, `:where(.sp-*)`, `.sp-ts-*`) — today `:root`, `:root.ts-80…130`, `.tier-*`, `.tdot` — must have the same declarations as spawn's rule for that selector, or be listed in an explicit allowlist with a reason. Keyframes must all be `sp-`. RED with a fake drifted copy, GREEN on the real one.
- [ ] Test 2 (order): in each of the four entries the `@spawn-ui/react/styles.css` import comes before any `./styles/*.css` import.
- [ ] Build, regress `--compare` → 0 pixels, no flow changes; ledger `dist/assets` size before → after.
- [ ] Commit `style: load spawn-ui's component CSS ahead of spawn's (guarded against drift)`.

### Task 6: Test build and hand-over

- [ ] `npm run pack`; check `release/win-unpacked/resources/app/node_modules` has no `@spawn-ui` or `@base-ui`; open `spawn.exe` once (sessions list, a chat, the dex) to see it starts.
- [ ] Final review (opus) over the branch with this plan's review focus. Fixes RED→GREEN; minors to `spawn-ui/docs/ISSUES.md`.
- [ ] Tell the owner what to try; wait for "푸시해" (release 1.10.15 then, as a no-visible-change release) or go on to 5b.

---

## The road after 5a (each its own plan, written after reading that area's code)

Each area: swap spawn's markup for the spawn-ui component; first fix spawn-ui wherever it differs (new spawn-ui version, new tarball); then regress `--compare` → 0 pixels and no flow changes; harness selectors that named spawn's old classes move to roles or `data-` hooks in the same commit; local test build at the end.

| Plan | Area | Components | Known differences to settle first (from ISSUES.md) |
|---|---|---|---|
| 5b | Small parts | Button, IconButton, Switch, SegmentedControl, Tag, Meter, Kbd, Notice, EmptyState, Banner | SegmentedControl md; disabled text stays 0.45/0.5 |
| 5c | Left panel and headers | SessionRow, Rail, ListHead, Launcher, Account, SessionHeader, PaneHead, TopBar, UsageBars, UpdateButton, TextSizeControl, ResizeHandle, DragCard, DropZone, QueueStrip | ListRow trash 3px; rail usage bars; Launcher icons stay spawn's; magnifier 13px |
| 5d | Game | MonCell, DexStrip, StatTile, WildRow, CatchToast, LeaderboardRow, LogRow, StepCount, DexDetailCard, PatchNotes | StepCount paw stays spawn's |
| 5e | Chat | Prose, CodeBlock, MdDoc, turns, tools, DiffBlock, AnswerCard, Composer, chips, SidePanel, Lightbox | the plan-4 pixel list; question options keep spawn's plain rows; stop button 26px |
| 5f | Overlays (last: they change focus and portals) | Dialog, Menu, Tooltip, Tabs, FindBar | find arrows stay ↑↓; menu titles; tooltip names |

The docs-site redesign (spawn's look instead of Starlight's) runs in spawn-ui alongside, its own plan, and touches nothing in spawn.
