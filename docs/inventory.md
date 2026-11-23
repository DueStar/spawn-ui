# spawn UI inventory

Every visual piece spawn draws, grouped into the spawn-ui catalogue, with look-alikes merged into one component with variants.

- **Source:** `Documents\spawn` at `e39e553` (release 1.10.13). Components are in `src/*.tsx`, `src/components/**`, and `src/components/chat/**`. All CSS is in `src/styles/*.css` (10 files, 2,730 raw lines).
- **Read-only:** nothing in spawn was changed.
- **Shorthands:** `we` = `widget-expanded.css`, `px` = `pokedex.css`, `w` = `widget.css`, `ch` = `chat.css`, `cg` = `chat-game.css`, `fb` = `feedback.css`, `to` = `toast.css`, `tm` = `terminal.css`, `tk` = `tokens.css`. `file:line` points at the first rule of a definition.
- **Values** are token names (`--ink-3`, `--r-s`, `--t-meta` …) wherever spawn uses a token. Raw literals are quoted as written.

---

## 1. Counts (for the portfolio)

**How the lines were counted.** A small parser read the 10 CSS files:

1. Comments were stripped, keeping their line breaks so line numbers stay true.
2. Every rule was split out, including rules inside `@media` and `@container`. Each rule was mapped to one family by its **subject** (the last compound of each selector). For example, `.w-head .w-icon` counts as IconButton and `.w-rows.compact .w-row` counts as SessionRow.
3. The first matching family wins, so a rule is never counted twice.
4. A rule's lines are its first to last line. A one-line rule counts 1; a 13-line block counts 13.
5. Lines that belong to no rule were not counted: comments, blank lines, and the `@media`/`@container` wrapper lines (576 lines in all).

A **definition** is a separately written class family that draws the same visual thing, such as `set-btn`, `chat-btn` and `fb-btn` for Button. The script and its raw output were kept in a temporary folder outside spawn.

| Group | spawn-ui components | Separate definitions | CSS rules | CSS lines |
|---|---:|---:|---:|---:|
| Foundations (Icon, focus ring, text, visually hidden) | 4 | 8 | 16 | 20 (+19 focus-ring rules counted inside their components) |
| Actions | 5 | 75 | 273 | 433 |
| Status | 5 | 37 | 121 | 131 |
| Containers | 11 | 57 | 255 | 366 |
| spawn·sessions | 16 | 29 | 220 | 333 |
| spawn·game | 11 | 17 | 179 | 244 |
| spawn·chat | 19 | 30 | 302 | 302 |
| No group (Scrollbar, find Highlight) | 2 | 4 | 33 | 33 |
| **Components total** | **73** | **257** | **1,399** | **1,862** |
| Tokens (`tokens.css` `:root`, `ts-*`, tier and type colours) | – | 3 | 32 | 73 |
| Motion `@keyframes` | – | 12 | 12 | 12 |
| Stays in spawn (frames, view layouts, FeedbackPin, QA and System pages) and the dead widget composer | – | 7 | 134 | 207 |
| **All CSS** | | **279** | **1,577** | **2,154** of 2,730 raw |

### The families with the most duplicates

| spawn-ui component | Definitions | Rules | Lines |
|---|---:|---:|---:|
| Button (incl. 2 accent send buttons) | 38 | 141 | 208 |
| IconButton | 23 | 73 | 133 |
| StatusDot | 12 | 42 | 45 |
| Tag | 12 | 15 | 15 |
| Notice | 11 | 19 | 30 |
| Scrollbar (owners) | 11 | 30 | 30 |
| SegmentedControl | 10 | 45 | 78 |
| Meter | 8 | 34 | 38 |
| TextInput | 8 | 27 | 47 |
| EmptyState | 8 | 16 | 24 |
| SearchField (incl. FindBar ×2) | 5 | 20 | 30 |
| Dialog | 5 | 20 | 42 |
| Card | 5 | 36 | 49 |
| MonCell (DexCell + BoxCell + pickers) | 4 | 29 | 45 |
| Menu | 4 | 37 | 53 |
| FileChip | 4 | 12 | 12 |
| ResizeHandle | 4 | 14 | 30 |

**Dead CSS** (no class reference anywhere in `src/**/*.ts(x)`): 35 rules, 66 lines. These cover the widget's old instruction box (`w-input`, `w-send`, `w-input-pointer`, `w-input-to`, `w-compose-pointer`), `w-tab-drop`, `w-mode-switch`, `w-list-sort`, `w-textsize-g`, `xterm-viewport` scrollbar, `chat-tools`, `dex-help`, `dex-box`, `rank-gap`, `fb-kind(s)`, `fb-lead` and `fb-note`. Do not port them.

---

## 2. Catalogue

### 2.1 Foundations

| spawn-ui | Merges (spawn) | Variants / measured | Props |
|---|---|---|---|
| **Icon** | `Icons.tsx` `ph()` and `Svg` (window shapes), `ChatIcons.tsx` (re-exports `ph`), `.ico` we:386, `.pokeball` we:387 | Phosphor **bold** only. Size steps via `iconStep()`: **12** (caret, ×), **14** (inline), **16** (button); above 17 is picture-sized (**18**, **20**). Seen in use: 10→12, 11→12, 12, 13→14, 14, 15→16, 16, 18, 20. PokeBall: 13/14/16/20. Colour `currentColor`. | `name`, `size: 12\|14\|16\|18\|20`, `className`; PokeBall: `ball`, `title` |
| **FocusRing** (token + util) | global `:focus-visible` w:18. Restated 11× at the same value: we:179, 204, 220, 261, 437; w:124; ch:156, 424; px:123 … | **default** 2px `--ink-2`, offset 1px. **inset** offset −2px (w-row w:174, compact × w:326, menu items we:233, 460). **loose** offset 2px (fb:148, 169). **hairline** `box-shadow 0 0 0 1px --ink-3` (chat-card ch:363) or inset (tree row ch:446). | `variant: default\|inset\|loose\|hairline` |
| **Text** (steps) | `--t-micro/meta/ui/name/prose/num/head/big/code` tk:38. Steps `.ts-80…130` tk:42–46. `.w-label` w:47 | 100% values: 10/11/12/12/13/12/14/15/12. 80% steps never go below 9px. Weights `--w-body` 400, `--w-name/strong` 500, `--w-head` 600, `--w-mono` 380. Fixed sizes outside the steps: brand 17px, dex-card-name 16px, toast title 15px, `.dex-q` 14/48px. | `step`, `weight`, `tone: ink\|ink-2\|ink-3`, `mono` |
| **VisuallyHidden** | `.chat-sr` ch:175, `.w-lens-word` we:183, `.w-dens-name` we:241 and we:248 (twice: `@media` and `@container`), `.chat-sentinel:focus-visible` ch:177 (reveals on focus) | One recipe: 1×1, `clip-path: inset(50%)`, nowrap. The sentinel variant shows on focus as a 22px hairline label. | `focusable` (reveal on focus) |

### 2.2 Actions

**Button**: 38 definitions. One component with `variant` × `size`, plus `tone` and `full` props.

| Variant | spawn definitions (CSS) | Measured |
|---|---|---|
| **outline** (hairline) | `set-btn` we:541; `chat-btn` ch:71; `fb-btn` fb:160; `fb-bar-btn` fb:83; `box-act` px:381; `w-account-actions button` px:313; `resume-warn-actions button` we:325; `resume-ask-acts`/`resume-undo button` we:343; `w-setup-again` px:287; `w-ask-open` px:433; `w-ask-quick` px:453; `w-swap-more` px:575; `w-chat-failed button` we:259; `chat-ch-open` ch:456; `w-pane-more` we:709; `dex-release` px:262; `w-term-empty .w-launch-*` px:425; `qa-fire` px:487 (QA only) | 1px `--line`, hover `--line-hover` + `--hover`. Paddings: chat-btn min-h **24** 0 10 `--t-meta`/500; banner/card chat-btn min-h **28** 0 12 `--t-ui`; set-btn 6/12 `--t-ui`; presets 3/10 `--t-meta`; fb-btn h **34**; fb-bar-btn h **28** 0 11; box-act 7/0 full-width; resume-warn 7/13; resume-ask/undo 4/11; account 5/11; setup-again 5/12; ask-open 2/9 `--r-xs`; ask-quick 3/10 `--r-xs`; swap-more 4/12; chat-failed min-h 28 0 12; ch-open min-h 24 0 8; pane-more h **22** min-w 26; dex-release 2/7 `--t-micro`; term-empty 9/18 min-w 200. |
| **solid** (`--ink` bg, `--accent-ink` text) | `set-btn.primary` we:568; `chat-btn.solid` ch:73; `fb-btn.primary` fb:167; `w-notes-ok` we:482 (h **36**, `--r-l`); `w-setup-go` px:285 (6/10, no border) | Hover: chat-btn → `#fff`; all the others → `filter: brightness(1.08)`. |
| **accent** (yellow, send/update only) | `chat-send` ch:292; `w-send` w:209 (dead); `w-update` w:271 (see UpdateButton) | 30×30 `--r-m` `--accent`; empty state `rgba(255,255,255,.06)` + `--ink-3`. |
| **danger** (confirm fill) | `resume-warn-actions .danger` we:328; `resume-ask-acts .danger` we:345; `box-act.danger.confirm` px:385; `dex-release.confirm` px:264; `w-row-close.confirm` we:94; `w-sess-head-close.confirm` we:163 | `--danger` bg, `#fff` text. Before confirming: box-act.danger shows `--ink-3` → hover `--danger` text + 40% danger border. |
| **ghost** (no border) | `chat-copy` ch:67; `w-launch-main` we:37; `w-signin` px:292; `w-rail-signin` we:640; `w-row-edit` w:300; `fb-spot-acts button` fb:143; `resume-old-toggle` we:337; `chat-diff-more` ch:149; `chat-ch-more` ch:458; `chat-mddoc-more` ch:574; `set-btn.ghost` we:543 (keeps its border); `fb-bar-btn.ghost` fb:89 (keeps its border) | chat-copy min-h 24 0 8 `--t-meta` `--ink-3`; launch-main min-h **34** 7/8 `--t-ui` `--ink-2`; signin 3/10 `--t-meta` (rail 46×28); row-edit 2/5; spot-acts h24 0 8; old-toggle 6/12 full-width; the "more" rows are full-width min-h **26** with a top hairline (diff pad-left 52, ch 0 14, mddoc 6/0). |
| **toolbar** (ghost + icon + label) | `w-chg` we:195; `w-dens` we:212: byte-identical | h **26** 0 8, gap 6, `--t-meta` `--ink-2`; `.on`/`.open` use `--sel-bg`/`--hover`; at ≤760px or ≤700px container: 0 6, label visually hidden. |
| **link** | `chat-link-btn` ch:221; `set-help-toggle` we:529; `.chat-prose a` ch:26 | Underline `rgba(255,255,255,.28)`, offset 3px, hover `--ink`; min-h 22 (buttons). |
| **dashed** | `fb-spot-btn` fb:134 | h28 0 10, 1px dashed `rgba(255,255,255,.22)`. |

Button props: `variant: outline|solid|accent|danger|ghost|toolbar|link|dashed`, `size: 22|24|26|28|34|36` (min-height), `pad` (dense/regular), `radius: xs|s|m|l`, `full`, `icon`, `kbd` (`.chat-btn kbd` ch:313), `confirming`, `disabled` (.45 or .5 opacity), `on`.

| spawn-ui | Merges (spawn) | Variants / measured | Props |
|---|---|---|---|
| **IconButton** | `w-icon` w:74; `.w-head .w-icon` w:88; `w-win-controls .w-icon` we:422; `w-widget-toggle` we:420; `w-list-btn` w:118; `w-rail-btn` we:596; `chat-ib` ch:288; `chat-ch-x` ch:435; `chat-ichip-x` ch:277; `w-sess-tab-x` we:681; `w-sess-head-close` we:157; `box-close` px:375; `fb-x` fb:107; `resume-trash` we:333; `w-toast-close` to:318; `chat-lightbox-x` ch:327; `chat-lightbox-nav` ch:330; `w-row-close` we:82; `w-row-swap` px:267; `w-launch-alt` we:55; `set-close` we:524; `chat-find button` ch:485; `term-search button` tm:233; `resume-head button` we:301 | **Sizes:** 20 (sess-tab-x, `--r-xs`); 22 (list-btn, ichip-x `--r-xs`, toast-close round, compact row-close); **24×22** (w-icon default, set-close); 24 (ch-x, box-close, find buttons, sess-head-close); 26 (head icons, fb-x, resume-trash); 28 (chat-ib); 30×stretch (launch-alt); **30×28** (window controls, widget toggle); 32 bordered on `--card` (lightbox ×); 38 `--r-m` (rail); 40 round bordered (lightbox nav); 56×`--head-h` (rail brand). **Rest colour:** `--ink-3`; `--ink-2` for w-icon, find buttons and resume-head. **Hover:** `--hover`, except w-icon `--sel-bg` and toast `rgba(.1)`. **danger-hover:** row-close and sess-head-close (`--danger` text + 12% bg), win-close (16%), resume-trash (`--red-text` + `--hover`). | `size`, `shape: square\|round`, `radius`, `bordered`, `tone: neutral\|danger`, `icon` or `glyph` (×, −/+), `label` (aria), `onSurface` (card bg) |
| **SegmentedControl** | `w-list-mode` w:109 (and dead `w-list-sort`); `w-lens` we:166; `w-view-switch` px:44 (the view tabs); `dex-seg` px:167 (Pokédex, Box, Leaderboard, Settings `Choice`); `dex-chips` px:175; `chat-mddoc-tabs` ch:561; `w-throw-tools button` px:589; `rank-npc-toggle` px:510 (single toggle); `w-mode-switch` we:382 (dead) | **boxed:** list-mode (1px `--line`, `--r-s`, pad 1, buttons 1/7 `--t-micro`, 22px hit area `::after`); lens (1px `--line`, `--r-m`, pad 1, gap 2, buttons h **24** 4/8 `--t-ui`, icon-only below 760px). **bare:** view-switch (gap 2, 5/11 `--t-ui`, icon 14, icon-only 5/8, new dot); dex-seg (4/9 `--t-meta`, min-w 26); dex-chips (5/9 = 24px tall, tier dot gap 5, `--ink-2`). **track:** mddoc-tabs (`rgba(.04)` track, pad 2, buttons 1/8 `--r-xs`, on = `--hover`). **chips:** throw-tools (bordered 4/10 `--t-ui`, on `--sel-bg` + `--line-hover`); npc-toggle (4/10 `--t-meta`). Selected: `--sel-bg` + `--ink` everywhere except mddoc. | `items[] {value,label,icon,dot}`, `value`, `onChange`, `look: boxed\|bare\|track\|chips`, `size: micro\|meta\|ui`, `iconOnly`, `disabled` |
| **Switch** | `set-switch` we:546 (Settings `Toggle`, SystemPage) | 32×18 pill, `#2c303b` track, 14px knob `#c9cdd6`; on: `--accent` + `--accent-ink` knob, translateX 14; .15s. | `checked`, `onChange`, `disabled`, `label` |
| **Checkbox** | `chat-card-mark.multi` ch:542/598; `fb-shot input` fb:155 (native, `accent-color: --hp`) | 12×12, 1.5px `--ink-3`, `--r-xs`; on: `--ink` fill + inset 2px `--card`. Native box in FeedbackPin. | `checked`, `onChange`, `label`, `description` |
| **Radio** | `chat-card-mark` ch:541; `chat-card-opt.pick` ch:543; `chat-card-other.on` ch:599 | 12px round mark; option row = chat-btn opt (see AnswerCard); on: border `--ink-2` + `--hover`. | `checked`, `name`, `label`, `description` |

### 2.3 Status

| spawn-ui | Merges (spawn) | Variants / measured | Props |
|---|---|---|---|
| **StatusDot** | `w-pill-dot` w:178; `w-conn` w:70; `w-rail-conn` we:607; `w-rail-dot` we:627; `w-sess-tab-dot` we:678; `chat-dot` ch:75; `chat-agent-mark i` ch:627; `chat-ag-state i` ch:642; `w-ask-dot` px:432; `box-working` px:359; `chat-queue-label::before` ch:265; `dex-new`/`w-new-dot` px:77; `.tdot` tk:51 | **Sizes:** 5 (dex-new in a cell, new dot on tabs/strip, box-working, queue); 6 (pill, conn, rail-dot, tab-dot, chat-dot, agent dots, tdot); 7 (compact pill, rail-conn, ask-dot, new-dot base). **Ring:** 2px `--side-bg` (rail) or 2px `--card` (new-dot base). **Tones:** `--ink-3` idle, `--green` working, `--amber` needs you, `--danger` error or offline, `--new-dot` red, `--tier`, transparent (tab, idle). **Motion:** pulse 1.4s (ask-dot), breathe `chat-halo` 1.6s (agents). | `tone`, `size: 5\|6\|7`, `ring: none\|side\|card`, `pulse\|breathe` |
| **Pill** (dot + words) | `w-pill` w:177 (+ `.as-button` we:80); `chat-jump` ch:231; `chat-ag-state` ch:641 | **status** (w-pill): gap 5, `--t-meta`, `--ink-3` (needs-you `--ink-2`), no fill; compact hides the text. **floating** (chat-jump): h **28** 0 12, `--card-2`, `rgba(.12)` border, `--r-l`, shadow `0 6px 18px .45`; `.wait` = amber dot + `--ink`. | `tone`, `label`, `as: span\|button`, `floating`, `hideLabel` |
| **Tag** (hairline label) | `today-new`/`today-tag` px:416; `chat-wild-tag` cg:24; `resume-badge` we:320; `rank-name small` px:541; `dex-type` px:221; `w-row-tool` px:593; `chat-mi-kind` ch:348; `chat-sugg-key` ch:505 (kbd); `chat-cc` ch:375; `resume-warn code` we:323; text-only `set-tag` we:576, `chat-ch-tag` ch:449 | 1px `--line`, `--r-xs`, 0 5px, `--t-micro` (today, wild). resume-badge 0 5 inherit size, `.run` amber 38%. rank "나" uses border `rgba(.18)`, `--w-name`. dex-type 0 6 `--t-meta` 500 in `.type-*` text colour. w-row-tool `--r-s` 1/6. mi-kind `--r-s` 0 5 `--t-meta`. sugg-key lh 16. cc 0 2 `--line-hover`. | `tone: default\|amber\|type-*`, `radius: xs\|s`, `size: micro\|meta`, `bordered`, `as: kbd` |
| **Badge** (filled or numeric) | `w-toast-new`/`w-toast-badge` to:298; rank medal `.rank-row.top .rank-place` px:550; `chat-counts` ch:131 = `w-chg-counts` we:205 (duplicate); `chat-counts-btn` ch:146 | **reward:** `--new-badge` bg, `--accent-ink`, radius 999, 0 5 (`--t-micro` 500) or 0 7. **medal:** 22 round, `--metal-1/2/3`, text `#15171d`, `--t-meta` 500. **diff counts:** mono `--w-mono` `--t-meta`, +N `--green`, −N `--red-text`, 0 `--ink-3`, gap 6; as a button min-h 22 0 7 hairline. | `kind: reward\|medal\|diff`, `value`, `added`, `removed`, `onClick` |
| **Meter** | `w-bar` w:91; `w-ctx`/`w-hp` w:184/357; `chat-ctx` ch:306; `w-row-tick` w:311; `w-rail-bar` we:635; `dex-stat-bar` px:145; `dex-tiercol i` px:154; skeleton `w-limit-wait` w:342 + loading shimmer w:337 | **usage:** h `--bar-h` 2, r 1, `--track`, fill `--bar`; warn `--bar-warn`, danger `--bar-danger`; width .4s. **hp:** h `--hp-h` 3, r 2, fill `--hp`, tones `hp-yellow` and `hp-red`, `hp-full` .35 opacity, .6s. **mini hp:** 56×3 `--r-xs`, no transition. **tick:** 12×3 r 2, colour only. **vertical:** 3×26, track `rgba(.1)`, fills from the bottom. **stat:** 2px, fill `--ink-3` or `--tier`. **loading:** shimmer 1.4s, pulse block 26×10. | `value`, `kind: usage\|hp`, `tone`, `orientation`, `length`, `thickness: 2\|3`, `loading` |

### 2.4 Containers

| spawn-ui | Merges (spawn) | Variants / measured | Props |
|---|---|---|---|
| **Card** | `w-card` w:39; `chat-card` ch:360; `rank-me` px:515; `sys-spec` system.css:10; frames `qa-today`/`qa-chat`. Content wells use the same shell: `chat-code` ch:62, `chat-diff` ch:123, `chat-mddoc` ch:558, `chat-shell-box` ch:515 | **surface:** `--card`, 1px `--line`, `--r-l`; pad 10/12 (w-card), 12/14 gap 10 (chat-card), 16 (sys). **flat:** no bg, `--r-m`, 10/12 (rank-me). **well:** `--term-bg` or `--card`, `--r-m` (code, diff, mddoc). **section:** in window mode w-card turns transparent with only a bottom hairline, pad 10/16 (we:395). **attention:** see Banner. | `look: surface\|flat\|well\|section`, `pad`, `radius: m\|l`, `attention` |
| **Banner** | `chat-banner` ch:237; `w-setup` px:279; `w-ask` px:429; `w-row-ask` px:440 (inside a row); `fb-bar` fb:75 (floating) | All use an amber 38% border: written as `rgba(255,181,74,.38)` in ch and as `color-mix(--amber 38%)` in px/fb (same value). chat-banner: `--card`, `--r-l`, 10/12, amber icon, text `--t-meta` + b `--t-ui`, actions with chat-btn 28. w-ask: 8/10, pulsing dot. row-ask: `--r-m`, no bg. fb-bar: fixed top, pad 6 6 6 14, shadow `0 10px 30px .5`. chat-card `.ask` adds a 2px amber bar inside the left edge (ch:362). | `tone: attention`, `icon`, `title`, `body`, `actions`, `floating`, `inline` |
| **Notice** (quiet line) | `w-note` w:228; `w-note-card` px:315; `chat-notice` ch:220; `chat-note` ch:244; `chat-cnote` ch:260; `chat-chint` ch:296; `chat-day`/`chat-older` ch:173; `chat-answer-more` ch:359; `rank-msg` px:533; `w-throw-hint` px:274; `fb-msg` fb:171 (+ dead `fb-note`, `fb-lead`) | **plain:** `--t-meta` or `--t-ui`, `--ink-3` or `--ink-2`. **warn:** `--amber` text (note-card, rank-msg, throw-hint, fb-msg.warn). **ok:** `--green` (fb-msg.ok). **dismissible box:** w-note (6/9, hairline, `--r-s`, `wNoteIn` .2s). **centered divider:** chat-day/older. | `tone: plain\|warn\|ok`, `size`, `align`, `boxed`, `onDismiss`, `action` (link button) |
| **EmptyState** | `chat-empty` ch:249; `w-term-empty` we:270; `w-empty` w:52; `resume-empty` we:306; `dex-empty` px:129 (Pokédex, Box, Leaderboard, Log); `chat-loading` ch:207; `chat-ch-empty` ch:439; `chat-menu-empty` ch:341; `w-chat-failed` we:258 | **hero:** chat-empty (picture 96 or glyph 64, title `--t-head` `--ink-2`, sub/hint `--t-meta`, gap 8, pad 24). **pane:** term-empty (centered, gap 8, two buttons). **inline:** w-empty, resume-empty (pad 20, centered), dex-empty (pad 20, spans the grid), menu-empty (6/8). **loading:** a centered word. **error:** chat-failed (button min-h 28). | `picture`, `title`, `hint`, `actions`, `size: hero\|pane\|inline`, `loading` |
| **Dialog** | `resume-backdrop`/`resume-modal`/`resume-head` we:284 (ResumePicker, PartyPickers `Dialog`, PatchNotes); `set-backdrop`/`set-modal` we:511 (Settings); `chat-full` ch:602 (FullView, inside the chat); `chat-lightbox` ch:322 (Lightbox); `fb-pop` fb:100 (popover) | Backdrops: `rgba(6,7,10,.55)` (resume), `.6` (settings), `.86` (lightbox), `rgba(0,0,0,.55)` (full view). Panels: `--card`, 1px `--line`, `--r-l`; shadows `0 16px 48px .5` (resume, settings), `0 12px 36px .5` (full), `0 18px 48px .55` (fb-pop, `rgba(.1)` border). Widths: min(520, 94vw), max-h 80vh; min(760, 100%)×min(560, 100%); `--read-w` 840; 340. Heads: resume 11/14 `--t-name` 600 with a bottom hairline; full 8 10 8 16. | `open`, `onClose`, `title`, `width`, `height`, `backdrop: .55\|.6\|.86`, `scope: window\|pane`, `head`, `foot`, `layout: single\|sidebar` |
| **Menu** | `w-dens-menu`/`item` we:221 (DensityMenu); `w-textsize-menu`/`item` we:447 (TextSizeControl); `chat-menu`/`chat-mi` ch:336 (MentionMenu, `.slash` SlashMenu); `chat-ctrl-menu`/`opt` ch:550 (ControlRow) | Widths: 250, 140, 300 (slash 460, max-h 268, sticky title), min 168. Panels: `--card`, pad 4, `rgba(.1)` border, `--r-l`, shadow `0 12px 32px .45`. **Exception:** ctrl-menu uses `--line` border, `--r-m` and `0 8px 24px .45`. Offset 6px (4px for ctrl). Opens down (dens, textsize) or up (chat, ctrl). Items: dens and textsize use a grid 16px + label, 6/8, `--t-ui`, hover/on `--sel-bg`, check `opacity`; chat-mi min-h 26 4/8, hover `rgba(.06)` literal; ctrl-opt 5/8 flex, hover `--hover`, 12px check. Title `6px 8px 4px` `--t-meta` `--ink-3` (identical in textsize and chat). Item subtext `small` `--t-meta`. | `items[] {label,desc,icon,checked,disabled}`, `title`, `placement: up\|down`, `align`, `width`, `selectedIndex`, `onSelect` |
| **Tooltip** | `w-lens-note` we:169 (timed note); `w-tab-note` we:693; drop labels `w-pane-drop span` we:690. 184 native `title=` tooltips across the TSX | Note: `--card`, 1px `--line-hover`, `--r-m`, 6/10, `--t-meta`, lh 1.5, max-w 300. Tab note: centered top, 7/12, `--t-ui`. | `content`, `open`, `placement`, `timeout` |
| **Tabs** | `set-nav` we:516 (vertical, Settings); `w-sess-tab(s)` we:669 (session tabs); `sys-nav` system.css:3 (stays); `w-pane-head.on` we:700. `w-view-switch` draws as SegmentedControl but is semantically tabs | **vertical:** min-h 32, 7/10, `--t-ui`, on `--sel-bg`, wraps to a row below 560px. **top:** `--r-s --r-s 0 0`, 0 4 0 8, on `--hover` + `inset 0 -2px 0 --ink-2`, picture 18 (on: 20), × 20 shown on hover. | `items`, `value`, `orientation`, `closable`, `picture`, `dot` |
| **TextInput** | `w-row-rename` w:302 = `w-sess-head-rename` we:150 (identical); `set-times input` we:553; `set-tool-form input` we:581; `rank-field input` px:523; `fb-text` fb:124 (textarea); `chat-card-field` ch:592; `w-input textarea` w:194 (dead) | **inline rename:** `--card`, 1px `--ink-3`, `--r-s`, 2/7, `--t-name` 500. **form:** `--card`, 1px `--line`, `--r-s`; pads 4/6 (times), 6/9 (tool), 6/10 w 180 (rank). **on-card:** bg `--bg`, h30 0 10 (card field), 9/11 min-h 78 `--t-name` (fb-text). **Focus border:** `--ink-3` (most), `--line-hover` (card field). | `value`, `onChange`, `multiline`, `size`, `surface: card\|bg`, `width`, `mono` (`.set-mono`), `autoFocus` |
| **SearchField** | `dex-fsearch` px:182; `box-search` px:327 (icon right); `w-swap-section input` px:565. **FindBar:** `chat-find` ch:479 and `term-search` tm:225 (near-duplicate) | **field:** `--card`, `--line`, `--r-s`, `--t-ui`; widths 150 (5/9), 170 (5 26 5 9, icon 13 at right 9), 120 (4/8). **FindBar:** absolute top 10 right 18, `--card-2`, `rgba(.1)` border, `--r-m`, pad 4 4 4 8, input 200 (chat h24), count min-w 44 `--t-meta`, buttons 24; chat adds a column with a note, `--line-hover` focus-within, and button text `--t-prose` (term: 13px). | `value`, `width`, `icon`, `count`, `onPrev/onNext`, `onClose`, `note`, `floating` |

### 2.5 spawn·sessions

| spawn-ui | Merges (spawn) | Variants / measured | Props |
|---|---|---|---|
| **SessionRow** | `Widget.tsx` row JSX; `QaPage` `QaRows`; `w-row*` w:147–w:330, we:77–94, we:643; `w-row-ask` px:440; hop px:446 | **detailed:** pad 8 8 8 10, margin 0 −8, `--r-m`, gap 4, grid 24px picture + gap 10, line2 min-h 16 `--t-meta`. **compact:** pad 5 8 5 10, picture 20, line min-h 20, gap `--row-gap-compact` 2, tick replaces the hp bar, × replaces the dot on hover. **States:** hover `--hover`; chosen `--row-sel-bg` + 2px `--accent` bar at left −8 (−4 in widget mode or QA) top/bottom 10 (compact 6); `mood-ended` .45; needs-you hop 1.2s; lifted (`--card-2`, shadow `0 10px 28px .45`); hover tools over a gradient. Name `--t-name` 500 `--ink-2` (chosen: `--ink`); branch mono `--t-meta`−0.5px, max 120, `⎇` prefix. | `name`, `project`, `branch`, `model`, `lv`, `tool`, `helpers[]`, `hp {pct,tone}`, `mood`, `picture`, `chosen`, `compact`, `asking` (slot), `onClose(confirm)`, `onRename`, `onSwap`, `draggable` |
| **SessionPicture** | `w-row-mon`/`glyph`/`shell` px:272, we:648, px:595; `w-sess-head-pic`/`shell`/`glyph` we:140; `w-rail-shell`/`glyph`/`newshell` we:620; `chat-pic`/`chat-glyph` ch:188; `resume-mon` px:275; `w-drag-card img` w:137 | Sizes: 18/20 (tabs), 20 (compact row, chat glyph), 22 (header, turn head, resume, drag card), 24 (`--row-mon`), 26 (rail), 64 glyph / 96 picture (chat empty). Kinds: **picture** (contain, smooth); **glyph** (1px `--line`, `--r-s`, `--ink-3`; 64 uses `--r-l`); **shell** (`>_`, mono 10px `--w-mono`, hairline box). Work mode shows the glyph in place of the picture. | `kind: picture\|glyph\|shell`, `src`, `size`, `hop` |
| **RailButton** (+ Rail) | `w-rail` we:590; `w-rail-btn` we:596; `w-rail-brand` we:602; `w-rail-session` we:616; `w-rail-sep` we:611; `w-rail-signin` we:640; `w-rail-account` we:639 | Rail 56w, gap 2, pad 0 0 10, `--side-bg`, right hairline. Button 38 `--r-m` `--ink-3` (icons 15/16/18). Session: picture 26, on `rgba(.05)` + 2px accent bar at left −9, dot 6 at right 4 bottom 4. Conn dot 7 (offline = `--danger`). Separator 1px full width, margin 4. Sign-in 46×28. | `icon`, `picture`, `mood`, `chosen`, `ended`, `dot`, `label` |
| **SessionHeader** | `SessionHeader.tsx`; `w-sess-bar` we:128; `w-sess-head-*` we:134–163; `w-chat-tools` we:193 | Bar h `--sess-bar-h` 40, pad 0 8 0 10, bottom hairline, `--bg`. Name `--t-name` 500; project `--t-meta` `--ink-3`; branch mono max 220; words sit at line-height 39px. Close min 24 `--t-big` (confirm pill 0 7 `--danger`). Container queries 700/420 hide labels and counts. Hosts LensSwitch (SegmentedControl boxed), ToolbarButtons, rename TextInput. | `picture`, `name`, `project`, `branch`, `tools` (slot), `lens`, `onRename`, `onClose`, `tabs[]` |
| **PaneHead** | `w-pane-head` we:698; `w-pane-more` we:709; `w-split-tools` we:707 | flex 1, pad 0 6 0 10, 1px `--line` left divider; `.on` `--hover`; "more" outline 22h. | `on`, `children` (SessionHeader), `more` |
| **DragCard** (+ DropZone) | `w-drag-card` w:136; `w-pane-drop` we:689; `.w-row.lifted` w:127; `box-cell.ins-before/after` px:578; `w-tab-drop` (dead) | Card: fixed, max 220, pad 5 10 5 6, `--r-m`, `--card-2`, 1px `--line-hover`, shadow `0 8px 24px .45`, picture 22, `--t-ui`. DropZone: 1.5px dashed accent 60%, bg accent 9% over `--bg` 55%, `--r-l`, inset 8, label 8/14 `--r-m` `--card`; `.full` `--red-text`; 120ms slide. Insert bar: 3px accent, ±8 (icon look ±7). | `picture`, `label`, `x`, `y`; DropZone: `left`, `width`, `hint`, `full` |
| **QueueStrip** | `QueueStrip.tsx`; `chat-queue*` ch:263, ch:526–534 | h30, inset 8px each side, pad 0 12, `--t-ui` `--ink-3`, `rgba(.025)` bg, hairline without a bottom, top `--r-l`; dot 5; list max-h 180; chevron flips. | `count`, `items[]`, `open`, `onToggle` |
| **UpdateButton** | `w-update` w:271 | 22×22 `--r-s` `--accent`; states `available`, `downloading` (.5), `ready` grow to a pill (0 7 0 6, gap 3, `--t-meta` 500, icon 12); `failed` uses inset 1px danger 45% + `--red-text`, no fill. | `state`, `progress`, `onClick` |
| **TextSizeControl** | `TextSizeControl.tsx`; `w-textsize` we:426 | h28 boxed 1px `--line` `--r-m`, margin 0 4 0 6; − / + 24×26 at 14px; current 0 7 `--t-meta` with side hairlines; **compact** = one 가 button min-w 26; menu 140 (see Menu). | `step`, `steps[]`, `onStep`, `compact` |
| **UsageBars** | `Limit` (`Widget.tsx`:177); `w-limits`/`w-limit` w:252–265, w:335–350; rail `w-rail-usage` we:633 | Grid `minmax(36px,max-content) 1fr 30px 74px`, gap 10/7, pad 9/12 (window 12/16). Label `--t-meta` `--ink-3`; pct `--num-ink` (warn `--amber`, danger `--red-text`); reset `--ink-3`. **loading:** shimmer. **idle:** hint row 11/12. **rail:** two vertical Meters 26 tall. | `limits[] {label,pct,reset,tone}`, `loading`, `idle`, `orientation` |
| **AppHeader** (+ TopBar) | `w-head`/`w-brand`/`w-conn` w:54–71; `w-term-tabs` we:107; `w-win-controls` we:418 | Header 42 (window `--head-h` 44), pad 6 8 6 12 (window: left 18, right 10, gap 4; Mac: left 78), drag region. Brand 17px/600/−2% with PokeBall 20. TopBar `--head-h`, pad 0 8 0 10, gap 2, bottom hairline, `--bg`. | `brand`, `connected`, `actions`, `windowControls`, `platform` |
| **ListHead** | `w-list-head`/`w-list-count` w:101 | gap 4, margin 2 0 6, `--t-meta` `--ink-3`; below a 250px container the count shortens. Holds SegmentedControl (list-mode) + IconButton 22 (mono `>_`). | `count`, `mode`, `onMode`, `actions` |
| **Launcher** | `w-launch` we:30 (+ `w-launch-main`/`alt` buttons) | Card pad 6 (window 6/8), gap 2; main = ghost Button min-h 34 with Plus 15; alt = IconButton 30 (14px), `.wide` 9/14. | `onNew`, `onFolder`, `onResume` |
| **Account** | `w-account` px:299; `w-account-card` px:306; `w-signin` px:292 | Avatar 24 round, 1px `--line`, `--card-2`, initial `--t-meta` 500 (rail 26). Card: name `--t-name`, email `--t-meta`, sync line, outline actions. | `user {name,email,photo}`, `sync`, `onSignIn/Out` |
| **ResizeHandle** | `w-side-resize` we:16; `w-pane-edge` we:704; `chat-ch-rz` ch:427 (also used by the agent panel) | Strip 7px (side, pane) or 22px (changes) over the edge; 1px centre line, transparent at rest (pane: `--line`), hover or drag `rgba(.3)`, focus `--ink-3`; `col-resize`. | `edge: left\|right`, `hit: 7\|22`, `lineAtRest`, `value`, `min`, `max`, `onResize` |
| **PatchNotes** | `PatchNotes.tsx`; `w-notes-*` we:465 | In a Dialog; `<details>` groups with a `›` that rotates .15s; body 4 16 8 `--t-name` lh 1.55; foot Button solid h36. | `releases[]`, `onClose` |

### 2.6 spawn·game

| spawn-ui | Merges (spawn) | Variants / measured | Props |
|---|---|---|---|
| **PokemonSprite** | img rules px:11, px:37, px:118, px:208, px:272, px:346, px:369, px:402, px:408, px:530, px:538, px:558, px:572; to:289; cg:19 | Sizes: 20 (helpers ≤20, overlap −4), 21 (`--strip-mon`), 22, 24, 30, 32, 34, 36, ≤40, 48, 50, 62, ≤130. Smooth `image-rendering: auto`, **except** the wild row (`pixelated`, cg:19). Silhouette `brightness(0) invert(.32)` written 3× (px:119, px:209, to:328). Faded in the log: .4 + grayscale .6. | `id`, `size`, `look: home\|icon`, `silhouette`, `faded`, `shiny`, `max` (no upscaling) |
| **MonCell** (DexCell + BoxCell) | `dex-cell` px:104; `box-cell` px:342; `w-swap-cell` px:571; `rank-partners button` px:527 | All on `--mon-bg` (hover `--mon-bg-hover`), `--r-m`. **dex:** square, grid min 88, sprite 62, corner labels `--t-micro` (no., shiny, count), `.unknown` `--unknown-bg`, `?` 14/48px `--q-ink`. **box:** 96 pad 16 sprite 50; icon look min 76 pad 14 sprite ≤48; working dot; dragging .4. **picker:** min 64, pad 8 4 6, transparent border → `--line-hover`, label `--t-micro`. **partner:** 44, sprite 36. **Picked:** inset 1px `--accent` (dex, box) vs `--ink-3` border + `--sel-bg` (partner). | `look`, `sprite`, `picked`, `seen`, `unknown`, `no`, `shiny`, `count`, `working`, `label`, `draggable` |
| **TierLabel** | `dex-tier` px:219; `w-toast-tier` px:8, px:374, px:419, to:296; `chat-wild-tier` cg:26; `dex-tiercol span` px:151; `.tdot` + `.tier-*` tk:48 | Dot 6 + word in `--tier` (the word is always present); `--t-meta` 500; gap 5 (dex, toast) or 4 (log, wild); margin-left 6 beside a name. Tiers: common `#a4a9b6`, rare `#6cb6ff`, sub `#c08bff`, legendary `#ffc94a`, mythical `#ff7ad9`. | `tier`, `dot`, `size` |
| **TypeTag** | `dex-type` px:221 + `.type-*` px:235 | Hairline Tag in the type's text colour (17 types). | `type` |
| **WildRow** | `WildRow.tsx`; `chat-wild*` cg:17 | min-h 34, pad 4 12 4 6, `--r-m`, hairline, `rgba(.015)` bg, opacity .72, sprite 24, ball 14, Tag, TierLabel; `.appear` .5s. | `mon`, `result: caught\|fled`, `ball`, `tier`, `appear` |
| **CatchToast** | `Toast.tsx` `ToastCard`; `w-toast*` to:247–338 | Grid 64 + text, gap 14, pad 14 18 14 14, `--r-toast` 14, `--toast-bg`. Art 64 `--r-l` with sprite 48. Eyebrow `--t-meta`, title fixed 15px 600, meta `--t-ui`, via `--t-meta` (warn amber). × 22 round. **Kinds:** catch (border by tier: rare 35%, sub 50%, legendary/mythical ring), flee (silhouette), shiny border, `+N` stack. Motion: in .3s, out .35s. Never takes the text step. | `kind`, `mon`, `tier`, `shiny`, `isNew`, `badge`, `ball`, `place`, `via`, `more`, `onClose` |
| **LeaderboardRow** | `rank-row/place/name/value` px:535 | Grid 36 30 1fr auto, gap 10, pad 6/10, `--r-s`, hover `--hover`. Top 3: pad 8/10 + medal Badge. `.me` `--sel-bg`. Name `--t-name` 500 + "나" Tag; value `--t-meta`, b `--t-name`. | `place`, `icon`, `name`, `value`, `unit`, `me`, `npc` |
| **DexStrip** | `DexRecent.tsx`; `w-dex*` px:17 | Grid label · count · recent, gap 10; recent sprites 21, margin 3, fold-away .22s; new dot 5. | `count`, `total`, `recent[]`, `isNew`, `onOpen` |
| **StatTile** | `PokedexView` `Stat`; `dex-stat*` px:133, `dex-tiers` px:149 | Columns split by hairlines, pad 0 20; value `--t-num`+8px 500 −2%; pct; 2px Meter. Tier columns: em `--t-num`+3px, Meter in `--tier`. | `label`, `value`, `of`, `pct`, `tone` |
| **DexDetailCard** | `dex-card*` px:200–232; `dex-owned*` px:254; `box-ball-dd` px:361; `box-close`, `box-act` | Art 160h `--r-l` `--mon-bg`; name 16px 600; icon 34; facts grid 84px/1fr with hairlines; owned rows with a release Button; flavor text in Pretendard `--t-ui` lh 1.7. | `mon`, `owned[]`, `actions`, `onClose` |
| **LogRow** | `TodayLog.tsx`; `today-*` px:388 | Row min-h 60, pad 12/0, gap 12; time 5.6em; icon 32; line `--t-name`; sub `--t-meta`; level-up variant (22px sprites, `--t-meta`); sticky day head (−6 top); summary bar. | `time`, `kind`, `mon`, `text`, `tier`, `ball`, `tags` |
| **StepCount** | `TurnFoot.tsx` `PawIcon`; `chat-steps` cg:9 | Inline-flex gap 4, paw glyph, foot colour. | `steps` |

### 2.7 spawn·chat

| spawn-ui | Merges (spawn) | Variants / measured | Props |
|---|---|---|---|
| **UserMessage** | `UserMessage.tsx`; `chat-user`/`bubble`/`time` ch:180–183, ch:315; `.pending.queued` ch:661 | Right-aligned, max 78%, gap 6; bubble `--card-2`, `--t-prose` lh 1.6, 8/12, `--r-l`, pre-wrap; time `--t-micro`; pictures and file pills above it. **Pending:** a `--t-micro` word. **Queued:** .55 opacity. | `text`, `time`, `pictures[]`, `files[]`, `state: sent\|pending\|queued` |
| **TurnHead / TurnFoot** | `ChatView` rows; `chat-turn-head` ch:186; `chat-foot` ch:204; `chat-text-acts` ch:198 | Head min-h 22, gap 6, `--t-meta` `--ink-3`, b `--ink-2` 500, picture 22 (margin 0 −1 0 −3). Foot min-h 24, gap 4/12, wraps, StepCount, copy at the right; text acts show on hover. | Head: `who {picture,name}`; Foot: `time`, `tools`, `files`, `steps`, `onCopy` |
| **ToolRow** (+ ToolGroup, AgentGroup) | `ToolRow.tsx`, `ToolGroup.tsx`, `AgentGroup.tsx`; `chat-tool*` ch:81–104; `chat-agent-body`/`chat-sub-*` ch:117 | Head min-h 30, ml −4, `--r-s`, `--t-ui` `--ink-2`, hover `--hover`; chevron 12 rotates 90°; icon 14; label; detail (mono `--t-ui`−1); error `--red-text`; meta at the right `--t-meta`. Body: margin 2 0 6 10, pad-left 14, 1px left hairline (fail: red .35); output max-h 320, mono `--t-code`−1. **States:** open, wait, fail. Agent "open" Button appears on hover. | `icon`, `label`, `detail`, `mono`, `meta`, `state`, `open`, `onToggle`, `children`, `toTerminal` |
| **DiffBlock** | `DiffBlock.tsx`; `chat-diff*`/`chat-dl` ch:123–151; in PermissionCard `chat-card-diff`/`lines` ch:377–388; in ChangesPanel `chat-ch-lines` ch:467 | Well `--term-bg` `--r-m`; head min-h 30, pad 2/10, kind, file button mono min-h 24, counts Badge; lines grid **36 16 1fr** (panel **32 14**, no-number **22**), `--add-bg`/`--del-bg`; card and panel wrap, inline scrolls sideways; "more" row. | `file`, `kind`, `lines[]`, `added`, `removed`, `wrap`, `numbers`, `maxLines`, `onOpenFile`, `onCounts` |
| **CodeBlock** | `CodeBlock.tsx` (+ `CopyButton`); `chat-code` ch:62 | Well `--term-bg`; head min-h 30, pad 3 4 3 12, language mono `--t-meta`; pre 10/12 `--t-code` lh 1.6. | `lang`, `code`, `onCopy` |
| **MdDoc** | `Markdown.tsx` `MdDoc`/`DocToggle`; `chat-mddoc` ch:558 | Well `--card`; head 30 with SegmentedControl (track); body 14 18 12; folded at max-h 420 with a mask; raw view mono. | `title`, `markdown`, `view: doc\|raw`, `folded` |
| **Prose** | `Markdown.tsx`; `chat-prose` ch:9–28, tables ch:54 | Pretendard `--t-prose` lh 1.7; headings `--t-head`/`--t-prose` 600; inline code `rgba(.06)` `--r-xs` 1/5 mono −1px; links (link Button style); blockquote 1px `--line-hover`; table th `--t-meta`. | `markdown`, `size` |
| **ThinkingRow** | `ThinkingRow.tsx`; `chat-think` ch:214 | Pad-left 12, left hairline, `--t-ui` lh 1.65 `--ink-3`; head `--t-meta` 500. | `time`, `text`, `missing` |
| **ShellRow** | `ShellRow.tsx`; `chat-shell*` ch:514–521 | Max 88%, box min 220, pad 8 12 9, `--r-l`, hairline, `rgba(0,0,0,.22)`; command mono `--t-code` with an `--ink-3` prompt; output above a top hairline, max-h 360. | `command`, `output`, `error`, `running` |
| **AnswerCard** (Permission / Question / Plan / Dialog) | `AnswerSurface.tsx` `CardShell`, `PermissionCard.tsx`, `QuestionCard.tsx`, `PlanCard.tsx`, `DialogCard.tsx`; `chat-card-*` ch:364–416, ch:536–599; read-only `chat-ask`/`chat-plan` ch:106–115 | Card surface + `.ask` amber. Head `--t-ui` 500 with amber dot and kind at the right. **permission:** command box max-h 160 `--term-bg` mono `--t-code`, facts (warn = `--ink` 500 + amber dot), rule, DiffBlock (wrap, max-h 220). **question:** options are chat-btn rows min-h 30, pad 5/12, label + description, pick marks (Radio/Checkbox), "other" row with a field h30. **plan:** max-h 320 scroll. **dialog:** body, table, pre, links with copy, words field. Actions min-h 28; buttons 28 0 12 `--t-ui` 500; solid = `--ink`. | `kind`, `title`, `kindLabel`, `body`, `options[]`, `multi`, `actions[]`, `state`, `hint` |
| **Composer** (shell) | `Composer.tsx`; `chat-composer`/`cbox`/`cbar`/`input`/`ib`/`send` ch:256–296; `chat-shell-badge` ch:510; `chat-sugg-key` ch:505 | Outer pad 0 32 14 (narrow 0 16 12), max `--read-w`. Box pad 8 8 8 12, `--card`, hairline, `--r-l`, gap 6, focus border `rgba(.16)`; shell mode `rgba(.22)` + mono. Input min-h 22, max-h 160, `--t-prose` lh 1.6. Bar gap 2; IconButton 28; send accent 30. Hint and note lines above or below. | `value`, `onChange`, `onSend`, `chips` (slot), `tools` (slot), `mode: prompt\|shell`, `suggestion`, `busy`, `readOnly`, `note` |
| **ControlRow** | `ControlRow.tsx`; `chat-ctrl*` ch:298–310, ch:546–556 | mt 6, gap 2, `--t-meta` `--ink-3`; items 3/6 (button: `--hover`); separator 1×12; mini hp Meter 56×3; Menu opens upward. | `model`, `effort`, `mode`, `context`, `onPick` |
| **FileChip** | `FileChips.tsx` (`FileChips`, `FileRef`, `SentFile`), `Markdown.tsx` `FileGlyph`; `fchip` ch:32; `chat-fchip` ch:494; `chat-fref` ch:498, ch:524; `chat-sent-file` ch:502 | **prose:** mono `--t-prose`−2, `rgba(.05)` (hover .09), `--r-xs`, 0 6, hit area +3px. **inline-sent:** mono `--t-code`−1, `rgba(.06)`, 0 6. **pill:** hairline 3/8 no bg (sent files, user files; hover `rgba(.04)`). **draft:** h26, hairline, `--r-s`, 0 2 0 8, `--t-meta`, with ×. File icon 12/13. | `path`, `look: prose\|inline\|pill\|draft`, `onOpen`, `onRemove` |
| **ImageChip** (+ Thumbnail) | `ImageChips.tsx`, `Pictures.tsx`, `UserMessage` `SentPictures`; `chat-ichip` ch:271; `chat-thumb` ch:275, ch:316; `chat-shot(s)` ch:654; `chat-img-chip` ch:182 | **chip:** h30, max 220, pad 0 4 0 3, hairline `--r-s`, thumb 34×22 on `#fff`, × 22. **thumbnail:** 160×100 cover top-left, hairline `--r-m` (thumb on `#fff`, shot on `--card-2`), zoom-in cursor; wait and none states. **text chip:** 1/8 hairline. | `src`, `name`, `look: chip\|thumb\|text`, `onOpen`, `onRemove`, `loading` |
| **LinkCard** | `LinkCard.tsx` (+ `Globe`); `chat-og` ch:41–51 | Max 480, pad 10 10 10 12, hairline `--r-l`, hover `rgba(.025)`; site `--t-meta` + globe; title `--t-ui` 500; description clamped to 2 lines; image 104×68 `--r-s`. | `url`, `title`, `desc`, `site`, `via`, `image` |
| **Notice** (chat) | `ChatView` `NoticeRow`; `chat-notice` ch:220; `chat-stopped`/`chat-cut` ch:196 | Covered by Containers/Notice: min-h 22, gap 6, `--t-ui` `--ink-3`, link Button inline. | see Notice |
| **LiveBubble** (pending) | `ChatView` `LiveRow`; `chat-live` ch:209 | Label `--t-micro` above prose in `--ink-2`. | `label`, `text` |
| **WorkingLine** | `ChatView` `WorkingLine`, `Elapsed`; `chat-status` ch:225, hop cg:37 | min-h 34, gap 8, `--t-ui` `--ink-3` (waiting `--ink-2`); picture hop 1.6s; stop Button min-h 26 `--ink` at the right. | `who`, `text`, `elapsed`, `waiting`, `onStop` |
| **JumpPill** | `ChatList`; `chat-jump` ch:230 | See Pill (floating), centered bottom 14. | `count`, `waiting`, `onClick` |
| **AgentStrip + SidePanel** | `AgentPanel.tsx` (`AgentStrip`, `AgentPanel`); `ChangesPanel.tsx`; `chat-agent-chip` ch:620; `chat-ag-panel` ch:633; `chat-changes`/`chat-ch-*` ch:422–473 | **Chip:** h28, max 340, pad 0 11 0 10, `--r-l`, hairline, `rgba(.025)`, `--t-meta`; mark 10 with dot 6; enter .28s, exit .32s after 1.25s. **SidePanel** (one shell for both panels): absolute right, `--side-bg`, left hairline, head h40 pad 0 8 0 14 + × 24, sub line; widths `--ch-w` 320 and `--ag-w` 380; agent panel slides in .22s. **Changes tree:** rows h26 `--r-s`, selected `--sel-bg`, sticky file head min-h 36. | Strip: `agents[]`, `onOpen`; Panel: `title`, `counts`, `sub`, `onClose`, `width`, `over`, `children` |
| **FullView** | `FullView.tsx`; `chat-full*` ch:601 | Dialog (pane scope); body 16/20, pre mono. | `title`, `content`, `onClose` |
| **Lightbox** | `Lightbox.tsx`; `chat-lightbox*` ch:322–334 | Dialog (window scope, z 8000), image max 92vw × 84vh `--r-m` on `#fff`, × 32, nav 40 round. | `pictures[]`, `index`, `onClose` |
| **Mention / Slash menu** | `MentionMenu.tsx`, `SlashMenu.tsx` | Menu (300 / 460, up). Slash rows: command, alias, kind Tag, description cut. | see Menu |
| **FindBar** | `FindBar.tsx`, `TerminalPanel` term search | See SearchField (FindBar). | |

---

## 3. Outside the groups, and what stays in spawn

### 3.1 Visual things that fit no group (proposed additions)

| Proposed | spawn | Why it needs a home |
|---|---|---|
| **Scrollbar** (Foundations) | 11 owners: `.widget ::-webkit-scrollbar` px:463 (8px, thumb `#2c303b` with a 2px transparent border); `w-party` w:245 (6); `resume-list` we:304 (6); `w-notes-body` we:475 (6); `dex-grid`/`dex-detail` px:101 (8); `box-grid` px:340 (8); `chat-scroll` ch:161 (10 track / 4 thumb `rgba(.1)`); xterm slider we:413 (8, `rgba(.08/.16)`); `w-rail-sessions` we:615 (0); `chat-agents-in` ch:619 (none); textarea px:468 | 30 rules, 4 widths, 3 thumb colours. One util with `size: 0\|6\|8\|10`. |
| **Highlight** (Foundations) | `::highlight(chat-find)` ch:489, `.find-now` ch:492; tokens `--find-bg`/`--find-now-bg` | Search hits; never yellow. |
| **Motion** tokens | 12 `@keyframes`: `wNoteIn`, `wLimitShimmer`, `wLimitPulse`, `wMonHop`, `chat-wild-in`, `chat-hop`, `chat-halo`, `chat-chip-in/out`, `chat-ag-in`, `toastIn/Out` | Five different easings for entrances (`cubic-bezier(.2,.8,.2,1)`, `(.2,.7,.2,1)`, `(.2,0,0,1)`, `ease-out`, `ease-in`). All honour `prefers-reduced-motion`. |
| **ListRow** (Containers) | `set-row/text/actions` we:533 (Settings); `resume-item/row/ask/undo` we:308 (ResumePicker) | Settings row (pad 12/0, hairline, title `--t-name` + small `--t-meta`, control at the right) and resume row (9/11, `--r-s`, hover hairline + `--hover`, trash on hover, confirm state). 41 rules. |
| **Toolbar / FilterBar** (Containers) | `dex-top`/`dex-filterbar` px:132/164; `box-toolbar` px:325; `rank-top` px:508 | The same bar three times: pad 14/20, 8/20 or 12/20, bottom hairline, wraps, filter label `--t-meta`. |
| **WindowGrip** | `w-grip` we:350 | 10×10 diagonal stripes, bottom-right of the widget window. Only one, so it could also stay in spawn. |

### 3.2 Stays in spawn (used once, like nothing else)

| Thing | spawn | Reason |
|---|---|---|
| App frame and modes | `.widget`, `w-bento`, `w-side`, `w-term`, `w-party`, `w-chat-pane`, `.mode-window/-fullscreen/-widget`, `.is-mac`, `.work-mode` (w:8–37, we:4–13, we:362–410, we:500–507) — 31 rules, 84 lines | Layout of this one Electron window: transparent widget, traffic-light offsets. |
| Terminal view | `.term-view`, xterm overrides (tm:222, we:265, we:413) | xterm-specific. |
| View layouts | `dex`, `dex-grid`, `box`, `rank`, `today`, `w-swap-box` grids — 28 rules, 40 lines | Page layouts that compose catalogue parts. |
| Chat layout | `.chat`, `chat-list`, `chat-scroll`, `chat-col` (reading column `--read-w` 840, pad 28 32 20), `chat-row` spacing — 17 rules | The page, not a component. Row paddings (10, user 8/16, head 6/8) are layout. |
| FeedbackPin overlay | `fb-layer`, `fb-hover`, `fb-pin`, `fb-shot`, `fb-spot` (`FeedbackPin.tsx`) — 12 rules, 20 lines | A one-off feedback tool (crosshair layer, pin shape `50% 50% 50% 0`). Its buttons, popover and amber bar map to Button, Dialog and Banner. |
| QA and System pages | `qa-*` px:470–503, `sys-*` system.css (`QaPage.tsx`, `qaChat.tsx`, `SystemPage.tsx`) — 44 rules | Internal pages. **`SystemPage` (`?system`) is already a small design-system page** (foundations, controls, chat) and is the natural predecessor of the spawn-ui docs. |
| Brand wordmark | `w-brand` w:66 | Logo, 17px/600. |
| Settings layout | `set-modal` two columns, `set-nav` 148w | One screen; built from Dialog (sidebar), Tabs (vertical), ListRow, Switch and Button. |
| Setup card content | `w-setup-*` px:279 | Install prerequisites (one place); its shell is Banner. |
| Mac and work-mode placeholders | `w-rail-blank`, `w-row-glyph` swaps | Platform and mode rules. |
| Dead CSS | see §1 | Delete in spawn rather than port. |

---

## 4. Differences a merge must keep (so adoption moves no pixel)

| Area | Keep these exact differences |
|---|---|
| IconButton sizes | 20 · 22 · 24×22 · 24 · 26 · 28 · 30×28 · 30×stretch · 32 · 38 · 40 · 56×44. The `w-icon` base is **24 wide × 22 tall** (not square); the header overrides it to 26×26 and window controls to 30×28. |
| IconButton looks | Radius `--r-xs` (20/22 in chips) · `--r-s` (most) · `--r-m` (rail 38) · 50% (toast ×, lightbox nav). Rest colour `--ink-3` vs `--ink-2` (w-icon, find buttons, resume-head ×). Hover `--hover` vs `--sel-bg` (bare w-icon) vs `rgba(.1)` (toast ×). Danger hover tint 12% (rows, header ×) vs 16% (window close) vs `--red-text` text only (trash). Glyph sizes for text icons: 13px (w-icon), `--t-big` (header ×), `--t-name` (tab ×), 14 (box ×, toast ×), 17 (fb ×), 20 (resume ×). |
| Button heights | min-h 22 (pane more) · 24 (chat-btn, ch-open, copy) · 26 (stop, toolbar) · 28 (banner, card, fb bar, chat-failed) · 34 (fb, launcher) · 36 (patch notes ok); padding-only buttons use 2/5, 2/7, 2/9, 3/10, 4/11, 4/12, 5/11, 5/12, 6/10, 6/12, 7/13, 7/0. |
| Button radius | `--r-xs` on `w-ask-open`/`w-ask-quick` only; `--r-l` on `w-notes-ok`; `--r-s` elsewhere. |
| Solid hover | `chat-btn.solid` → `#fff`; every other solid → `brightness(1.08)`. |
| Weight | chat-btn and the card buttons are 500, as are set-btn, fb-btn and box-act; dex-seg, view-switch and lens are 400. |
| SegmentedControl | Boxed with `--r-s` (list mode) vs `--r-m` (lens); bare (view, dex-seg, chips); track (mddoc). Selected `--sel-bg`, except mddoc on `--hover`. Text `--t-micro` (list) · `--t-meta` (dex-seg, chips, mddoc) · `--t-ui` (view, lens). Lens buttons have a fixed **h24**; the others take their height from padding. |
| Menus | Border `rgba(.1)` + `--r-l` + `0 12px 32px .45` (dens, textsize, chat) vs `--line` + `--r-m` + `0 8px 24px .45` (control row). Offset 6 vs 4. Item hover `--sel-bg` vs `rgba(.06)` literal (same value as `--sel-bg`) vs `--hover` (ctrl-opt). The check sits in a 16px grid column (dens, textsize) vs a 12px inline span (ctrl). |
| Dialogs | Backdrop .55 (resume) · .6 (settings) · .86 (lightbox) · black .55 (full view). Shadow `16/48 .5` vs `12/36 .5` vs `18/48 .55`. The settings backdrop has 16px padding (6 below 560px). |
| Focus ring | Offset 1 (default) · −2 (rows, menu items) · 2 (FeedbackPin) · box-shadow 1px `--ink-3` (answer card, tree row). |
| StatusDot | 5 / 6 / 7 px; ring 2px `--side-bg` on the rail, `--card` on the new dot. Compact rows enlarge the pill dot 6 → 7. |
| Meter | Height 2 (usage, stat) vs 3 (hp, tick, mini hp); radius 1 vs 2 vs `--r-xs`; track `--track` (.08) vs rail `rgba(.1)`; only `w-bar` (.4s) and `w-ctx` (.6s) animate width; `hp-full` at .35 opacity. |
| Tags | Radius `--r-xs` vs `--r-s` (row tool, menu kind); border `--line` vs `rgba(.18)` ("나") vs `--line-hover` (hidden char); padding 0 5 / 0 6 / 1 6 / 0 4 / 0 2. |
| TextInput | Focus border `--ink-3` vs `--line-hover` (card field) vs `rgba(.16)` (composer box); surface `--card` vs `--bg` (fb text, card field); rename fields sit on a 1px **`--ink-3`** border at rest. |
| SearchField | Widths 120 / 150 / 170 / 180 / 200. Box search keeps 26px right padding for its icon. Find buttons are 13px (terminal) vs `--t-prose` (chat). |
| Chosen marks | Row bar at left −8 (−4 in widget mode or QA) and rail bar at −9; inset 10 (compact 6). Selection bg: row `--row-sel-bg` .04, rail session `rgba(.05)`, segmented `--sel-bg` .06, tab `--hover` .045 + 2px underline. Cell picked = inset accent; partner picked = `--ink-3` border. |
| Sprites | Smooth everywhere, **pixelated in WildRow**. Box icon look never scales up (`max 48`). Silhouette filter is identical in 3 places. |
| Amber attention | `rgba(255,181,74,.38)` and `color-mix(--amber 38%)` are the same; keep one token. Chat card adds an inner 2px bar; the others do not. |
| Literals to tokenise without change | `#2c303b` (= `--q-ink`; switch track, scrollbars), `#3a3f4c` (thumb hover), `#c9cdd6` (switch knob), `#15171d` (medal ink), `#fff` (confirm text, picture bg), `rgba(255,255,255,.06)` (= `--sel-bg`), `.1`, `.12`, `.16`, `.22`, `.28`, backdrop `rgba(6,7,10,…)`. |
| Type offsets | Branch `--t-meta`−0.5px; code `--t-code`−1; prose code `--t-prose`−1; fchip `--t-prose`−2; hidden char `--t-code`−2. The toast window fixes `--t-*` at the 100% step (px:497). |
| Container queries | Session header 700/420, chat 900 (`chat-col`, banner, composer, answer), list head 250, lens and dens 760 media. Keep them as component props or internal queries, never page media. |
