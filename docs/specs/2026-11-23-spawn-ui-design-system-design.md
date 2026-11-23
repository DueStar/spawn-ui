# spawn-ui — spawn's design system and its public docs site

Date: 2026-11-23 · Status: approved (the owner: "나머지는 알아서 진행해줘"; the calls marked *(call)* are mine)

## Intent

spawn (the Pokémon desktop app for Claude Code) gets a design system of its own: tokens and React components that
spawn itself uses, documented on a public site in the manner of Vapor UI (https://vapor-ui.goorm.io/docs), the
owner's favourite design system. The site is the design system's documentation and the owner's portfolio piece;
anyone can read it.

Why: (1) a portfolio that shows the system, its rules and how it was made; (2) spawn's next screens are built from it,
and new components are made on top of it. A docs site of pictures alone fails the second reason.

## Goals

- A public GitHub repository `DueStar/spawn-ui` (same account as spawn; spawn is public too) holding:
  - `@spawn-ui/tokens`: the design values, as CSS custom properties and as a typed TS object.
  - `@spawn-ui/react`: **every component spawn's screens use** — not only the generic ones (button, switch, menu)
    but spawn's own (the session row, the HP bar, the Pokédex cell, the chat's permission and question cards, the
    wild Pokémon row, the toast …). Look-alikes are merged into one component with variants (the owner's ask:
    "묶을 수 있어보이는 놈들은 묶고").
  - `apps/docs`: the docs site.
- A docs site with Vapor's shape: Getting Started (introduction, design principles, installation, playground),
  Tokens (color, size, typography, radius, motion), Components (one page each), Releases (per package).
- Every component page in Vapor's order: title and one line, a live preview with its code, one section per
  property (variant, size, state…) each with preview and code, examples, a props table, and an accessibility note.
- spawn adopts the packages, one area at a time, with no visible change unless the owner asks for one.

## Non-goals

- A general-purpose library for other products. It is spawn's: its dark calm look, its rules.
- A Figma library (the Figma connection is down; see Open questions).
- Re-designing spawn. Adoption keeps every screen as it looks today (the owner's rule: change only what was asked).

## Anti-goals (a failure even if it works)

- A docs site whose components are not the ones spawn runs (screenshots, or copies that drift).
- A component that breaks a rule spawn already enforces in tests (yellow only on the chosen thing, one focus ring,
  weights 380–600, radii from tokens, no animation where the chat has none, contrast floors).
- An adoption that moves pixels: a spawn screen that looks different after a component replaced its CSS.

## Constraints

- spawn: Electron + React 18.3 + Vite + TypeScript, plain global CSS (`src/styles/*.css`, ~2,700 lines), all values
  in `src/styles/tokens.css`; Phosphor icons through one wrapper (`src/components/Icons.tsx`: weight bold, sizes
  12/14/16). Text sizes scale 80–130 % by swapping `--t-*` on `:root` (`:root.ts-90` …): components must read the
  tokens, never fixed sizes. Mac and Windows. The renderer is Chromium (Electron), so modern CSS is safe.
- spawn's design rules live as tests (tests/tokens.test.ts, chat-virtual, icons, session-list, calm-review-fixes);
  they become the docs' principles and spawn-ui's own tests.
- Korean is the owner's language; spawn ships ko/en/ja.

## What spawn has today (inventory, 2026-11-23)

Each family is drawn several times under different names (chat-, w-, set-, dex-, fb-):

| Family | Today | Component |
|---|---|---|
| Buttons | `.chat-btn`(+`.solid`), `.set-btn`(`.ghost` `.primary`), `.fb-btn`, `.w-list-btn`, `.chat-card-btn` (28px) | `Button` variant solid/outline/ghost, size sm/md |
| Icon buttons | `.w-icon`, `.w-rail-btn`, `.chat-copy`, `.chat-ichip-x`, `.w-sess-tab-x` … at 20/22/26/38px | `IconButton` size xs/sm/md/lg (keeps each) |
| Link buttons | `.chat-link-btn` (13 uses) | `Button variant="link"` |
| Segmented | `.dex-seg`, `.dex-chips`, `.w-view-switch`, `.w-list-mode`, `.chat-mddoc-tabs` | `SegmentedControl` |
| Switch / check | `.set-switch`, `.rank-npc-toggle`; marks `.chat-card-mark`, `.w-textsize-ck` | `Switch`, `Checkbox`, `Radio` |
| Tags / chips | `.chat-wild-tag`, `.resume-badge`, `.set-tag`, `.fchip`, `.chat-ichip`, `.w-pill` | `Tag`, `Chip`, `Pill` |
| Status dots | `.tdot`, `.chat-dot`, `.w-pill-dot`, `.w-rail-dot`, `.w-sess-tab-dot` (all 6px) | `StatusDot` tone/mood/tier |
| Cards | `.chat-card`(`.ask`), `.w-card`, `.dex-card`, `.chat-banner` | `Card`, `Banner` |
| Menus | `.chat-menu`, `.chat-ctrl-menu`, `.w-textsize-menu`, `.w-dens-menu` (twins) | `Menu` |
| Tooltips | native `title` only (100+) | `Tooltip` (offered; spawn keeps `title` until asked) |
| Inputs | `.chat-card-field`, `.box-search`, `.rank-field`, `.set-tool-form` | `TextInput`, `SearchField` |
| Tabs | `.w-sess-tab`, `.w-term-tabs` | `Tabs` |
| Meters | `.w-bar` (2px usage), `.w-hp` (3px HP), `.dex-stat-bar` | `Meter` kind usage/hp/stat |
| Empty states | `.chat-empty`, `.dex-empty`, `.resume-empty`, `.w-empty` … | `EmptyState` |
| Dialogs | `.set-modal`, `.resume-modal`, `.chat-lightbox` | `Dialog` |
| Focus ring | one rule copied ~15× (offset 1px / −2px for rows) | one shared rule in tokens |
| Icons | `Icons.tsx` (28) + `ChatIcons.tsx` (26) over Phosphor | `Icon` (size snapping) |

## Approaches considered

- **A. A separate public repo with the packages and the docs site (chosen by the owner).** Vapor's own shape;
  the history tells only the design system's story (a portfolio reads it); spawn's private bits (`chat-view`) stay
  out. Cost: a change reaches spawn through a package version.
- B. Inside spawn's repo (`src/ui/` + a docs app). One place, instant; but the portfolio is tied to the whole app,
  and the system is not shown on its own.
- C. Docs first, library later. Fastest; fails the reuse goal (dropped).

## Design

### Repository

```
spawn-ui/                       npm workspaces (spawn uses npm), TypeScript, MIT like spawn
├ packages/tokens               tokens.css (the values, light-free: spawn is dark only) + tokens.ts + rules.ts
├ packages/react                components, one folder each: Button/{Button.tsx, button.css, Button.test.tsx}
├ apps/docs                     the site
├ .changeset/                   versions and per-package release notes (Vapor's Releases)
└ .github/workflows             test on push; build and publish the site; publish packages on release
```

### Tokens (`@spawn-ui/tokens`)

- Source: spawn's `tokens.css`, moved as is (names kept: `--ink`, `--ink-2`, `--line`, `--accent`, `--t-ui` …),
  grouped as Vapor does: color (surface, ink, line, accent, status, tier, reward), size (radius, measures, gaps),
  typography (steps at 100 % plus the 80–130 % classes, weights, the font stacks), motion (durations and the one
  easing spawn uses: `cubic-bezier(0.2, 0, 0, 1)`, and reduced motion).
- Exported as CSS (`@spawn-ui/tokens/tokens.css`) and as TS (`tokens.color.ink`…), both generated from one
  source file so they cannot drift.
- spawn's guard rules (yellow, weights, radii, contrast floors) become `rules.ts` plus tests that run against
  the package's own CSS, and the same rules are what the docs' Design Principles page states.

### Components (`@spawn-ui/react`)

- Global CSS with an `sp-` class prefix, shipped as one stylesheet (`@spawn-ui/react/styles.css`), reading only
  tokens. No CSS-in-JS: spawn is plain CSS and the text-size swap works by variables.
- Behaviour that needs care (focus, keyboard, menus, tooltips, dialogs) on Base UI (`@base-ui-components/react`),
  the headless layer Vapor uses. Simple ones (Button, Tag, StatusDot, Meter, Card, EmptyState) are plain React.
- spawn's own components are **presentational**: they take data and callbacks as props (a session row gets
  `{ title, mood, hp, model, branch, sprite }`, `onOpen`, `onClose`), never the app's stores, bridge or IPC; the app
  keeps the wiring. That is what lets the docs show them with demo data and spawn reuse them.
- Every component: typed props, `className` passthrough, a ref, `data-*` state attributes, and tests for its rules
  (vitest + Testing Library).
- The catalogue, in groups (the docs' sidebar follows them). Phases are build order, all of it is in scope:
  - **Foundations** (v0.1): Icon, FocusRing (shared rule), Text (steps), VisuallyHidden.
  - **Actions** (v0.1): Button (solid/outline/ghost/link × sm/md), IconButton (xs/sm/md/lg), SegmentedControl
    (the five copies: dex filters, view switch, list mode, doc tabs), Switch, Checkbox, Radio.
  - **Status** (v0.1): StatusDot (mood / tone / tier), Tag (hairline: new, shiny, tier word, run, tool),
    Pill (mood pill), Meter (usage 2px / HP 3px / stat), Badge (toast new / count).
  - **Containers** (v0.2): Card (chat card incl. the ask edge, widget card, dex card), Banner, EmptyState,
    Dialog (settings / resume / lightbox shells), Menu (chat menu, control menu, text-size, density: the twins merged),
    Tooltip (offered; spawn keeps `title` until asked), Tabs (session tabs, terminal tabs), TextInput, SearchField.
  - **spawn: sessions** (v0.3): SessionRow (full / compact, every mood), RailButton, SessionHeader, PaneHead,
    DragCard, QueueStrip, UpdateButton, TextSizeControl, UsageBars.
  - **spawn: game** (v0.3): PokemonSprite (art / box icon / ball), DexCell, BoxCell, TierLabel, WildRow,
    LevelUp/Toast cards, Leaderboard row.
  - **spawn: chat** (v0.4): UserMessage, TurnHead/TurnFoot, ToolRow, DiffBlock, PermissionCard, QuestionCard,
    PlanCard, Composer shell (field, chips, control row), FileChip, ImageChip, LinkCard, Notice, PendingBubble.
  - The exact list is settled by a full inventory in the plan's first task (every component file and every class
    family in spawn's CSS); a thing used once and like nothing else stays in spawn.
- A size or variant exists only when spawn uses it today (e.g. IconButton keeps 20/22/26/38 as xs/sm/md/lg), so
  adoption moves nothing. Unifying sizes is a later choice, asked, never done along the way.

### The docs site (`apps/docs`)

- *(call)* Astro Starlight: static, MDX, sidebar, built-in search (Pagefind) and i18n, React previews as islands;
  the owner asked for the efficient choice, not Fumadocs specifically. It builds fast and needs no server.
- Navigation: Getting Started (Introduction · Design Principles · Installation · Playground) / Tokens (Color ·
  Size · Typography · Radius · Motion) / Components (All · one page each) / Releases (tokens · react).
- Component pages render the real package components on spawn's dark surface, a text-size switch (80–130 %)
  on every preview, and the props table generated from the TS types.
- Portfolio pages: "Why spawn-ui" (the inventory above, before → after with numbers: families, duplicate CSS
  lines, components) and a link to spawn.
- Hosted on GitHub Pages from the repo (free, public, no other account). Deploying is asked first, as always.
- *(call)* Korean and English from the start (a public portfolio; i18n is cheap at the start, costly later).
  Korean is written first; English follows per page. Props descriptions in the TS types are in English (code),
  the pages' prose in both.

### Adoption in spawn

- *(call)* How spawn gets the packages: each spawn-ui release attaches the packages' built tarballs
  (`npm pack`) to its GitHub Release, and spawn depends on those tarball URLs (pinned versions; Mac CI and Windows
  builds can fetch them, no npm account needed). Publishing to npm under `@spawn-ui` is a later step, when the owner
  makes an npm account; nothing else changes then.
- *(call)* Tests: a rule pinned on spawn's CSS moves with that CSS into spawn-ui (its tests there); spawn keeps
  thin checks that it uses the package, and its own behaviour tests. Adopted elements keep their old class names
  next to the new ones (`className`), so spawn's harness flows keep finding them.
- *(call)* spawn's in-app design page `?system` (src/SystemPage.tsx) stays and is rebuilt on the packages as they
  arrive (it is the QA page inside the app); the docs site is the public one. Its demos are the docs' first demos.
- The harness has screenshots but no pixel diff yet: the plan adds a compare step (before/after per surface).
- tokens first: spawn's `tokens.css` becomes an import of the package's; every existing test must still pass.
- then one area at a time, smallest first: the settings modal buttons (`.set-btn`) → segmented controls → status
  dots → switches → icon buttons → cards. Each step: the harness screenshots before and after must match
  (pixel diff, the spawn harness already takes them), all spawn tests and flows green, then a local test build.
- Each step is a normal spawn change: local test build, then "푸시해".

### Release and versions

- Changesets: each change says which package and why; the Releases pages are those notes (Vapor's format: per
  version, per component, Breaking Change marked). Packages start at 0.1.0; 1.0.0 when spawn runs on it fully.

## Left to the builder

- Exact Fumadocs layout, the playground's controls, the props-table generator, the pixel-diff tolerance.
- The order inside phase 2.

## Settled after review

- Docs tool: efficient over Fumadocs → Starlight *(call)*. Languages: ko + en *(call)*.
- Scope: every component the service uses, look-alikes merged (the owner).
- A Figma file: not now (the connection is down); the tokens' TS export can feed one later.
