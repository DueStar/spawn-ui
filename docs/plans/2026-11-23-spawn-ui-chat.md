# spawn-ui Chat (plan 4 of 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** spawn's chat view as components (v0.4.0): messages, turns, tools, diffs, code, the answer cards, the composer and its control row, chips, link cards, the agent strip and side panel, the lightbox — presentational, with spawn's values, so the chat can later be built from them.

**Architecture:** As plans 1–3. Content comes in rendered (`children` / `ReactNode`): spawn-ui does not parse Markdown or diffs; `Prose` styles the elements the app's renderer produces, `DiffBlock` takes lines already split. Cards are composed from plan 1–2 parts (Card attention, Button, RadioGroup/Checkbox, TextInput look card, DiffBlock).

**Tech Stack:** as plans 1–3.

**Spec:** `docs/specs/2026-11-23-spawn-ui-design-system-design.md` (spawn: chat v0.4). Values: `docs/inventory.md` §2.7 and §4, citing spawn's `chat.css` (ch), `chat-game.css` (cg) at `e39e553`; spawn's current `main` (1.10.14) wins where it changed (the queued bubble, the remote notice). Read each cited rule before writing CSS.

## Global Constraints

- Everything in plans 1–3 holds; guards enforce the CSS rules.
- **Yellow** only on the send button (`.chat-send`): allow-list `composer.css` with its source. Answer cards' attention is amber, never yellow.
- **Mono font sizes** spawn writes as `calc(var(--t-*) - Npx)` stay calc (the guard accepts calc of a token).
- **Pretendard** for prose and the composer as spawn writes the stack; Monaspace for code — literal stacks, as spawn (the chat-virtual rule forbids var() fonts).
- **Nothing moves** in the chat except what spawn moves (agent chip in/out, panel slide, working hop): all off under reduced motion.
- Every interactive part keyboard-reachable and named; IME-safe Enter in the composer (shared `isComposing`).

## Review Focus

1. Composer: Enter sends, Shift+Enter new line, an Enter ending a Korean composition never sends; Esc stops when busy; the send button is the only yellow.
2. Answer cards: keyboard picks an option (arrows in a RadioGroup, Space for Checkbox), Enter submits; the card says what it asks in words, not by its amber edge alone.
3. Long content: a long command, path or file name wraps or truncates with title; diff lines wrap in card/panel, scroll sideways inline.
4. Text size 130 %: prose, bubbles, tools and the composer grow; code wells keep `--t-code`.
5. Reduced motion: agent chip enter/exit, panel slide, working hop stop.

---

### Task 1: Prose, CodeBlock, MdDoc
Files: `src/Prose/*`, `src/CodeBlock/*`, `src/MdDoc/*`, `test/Prose.test.tsx`.
- `Prose({ children; size?: 'prose' | 'ui' })` — `.sp-prose` styling the app's rendered Markdown: Pretendard `--t-prose` lh 1.7; h1–h3 `--t-head`/`--t-prose` 600; inline `code` `rgba(255,255,255,.06)` `--r-xs` `1px 5px` mono `calc(var(--t-prose) - 1px)`; `a` as the link Button; blockquote 1px `--line-hover`; tables th `--t-meta` (ch:9–28, 54).
- `CodeBlock({ lang?: string; code: string; onCopy?(): void; copyLabel?: string })` — Card well term; head min-h 30 `3px 4px 3px 12px` lang mono `--t-meta`; `pre` `10px 12px` `--t-code` lh 1.6 (ch:62); copy IconButton named.
- `MdDoc({ title; view: 'doc' | 'raw'; onView; folded?: boolean; onUnfold?; labels; children })` — well `--card`, head 30 with SegmentedControl, body `14px 18px 12px`, folded max-h 420 with a mask (ch:558).
- Tests: values via `rule()`; copy named and called; MdDoc view switch; folded mask class. Commit `feat(react): prose, code block, md doc`.

### Task 2: The turn — UserMessage, TurnHead, TurnFoot, ThinkingRow, LiveBubble, WorkingLine, JumpPill
Files: one folder each (TurnHead+TurnFoot in `Turn/`), `test/Turn.test.tsx`.
- UserMessage (ch:180–183, 315, 661): right, max 78 %, gap 6; bubble `--card-2` `--t-prose` lh 1.6 `8px 12px` `--r-l` pre-wrap; time `--t-micro`; `attachments` slot above; `state: 'sent' | 'pending' | 'queued'` (pending: a `--t-micro` word; queued .55 + its word).
- TurnHead (ch:186): min-h 22, gap 6, `--t-meta` `--ink-3`, name `--ink-2` 500, picture 22 with margin `0 -1px 0 -3px`. TurnFoot (ch:204): min-h 24, gap `4px 12px`, wraps; `items` slot (time, tools, StepCount), copy at the right shown on hover/focus.
- ThinkingRow (ch:214): pad-left 12, left hairline, `--t-ui` lh 1.65 `--ink-3`; head `--t-meta` 500. LiveBubble (ch:209): label `--t-micro` over `--ink-2` text. WorkingLine (ch:225, cg:37): min-h 34, gap 8, `--t-ui` `--ink-3` (waiting `--ink-2`), picture hop 1.6s, stop Button at the right, `role="status"`. JumpPill (ch:230): floating, centred bottom 14, a named button.
- Tests: values; queued says it in words; WorkingLine status and stop named; hop off under reduced motion. Commit `feat(react): user message, turn head and foot, thinking, live, working, jump`.

### Task 3: ToolRow (+ group), ShellRow
Files: `src/ToolRow/*`, `src/ShellRow/*`, `test/Tools.test.tsx`.
- `ToolRow({ icon?; label; detail?; mono?; meta?; state?: 'done' | 'wait' | 'fail'; open?; onToggle?; children?; action? })` (ch:81–104, 117): head a button `aria-expanded` min-h 30, ml −4, `--r-s`, `--t-ui` `--ink-2`, hover `--hover`; chevron 12 rotates 90°; detail mono `calc(var(--t-ui) - 1px)`; fail `--red-text`; meta right `--t-meta`; body margin `2px 0 6px 10px`, pad-left 14, 1px left hairline (fail red .35); output max-h 320 mono `calc(var(--t-code) - 1px)`; `action` slot shown on hover/focus-within.
- `ShellRow({ command; output?; error?; running? })` (ch:514–521): max 88 %, min 220, `8px 12px 9px`, `--r-l`, hairline, `rgba(0,0,0,.22)`; prompt `$` `--ink-3`; output above a top hairline, max-h 360.
- Tests: aria-expanded flips; chevron rotation; fail colours; long detail truncates with title. Commit `feat(react): tool row, shell row`.

### Task 4: DiffBlock
Files: `src/DiffBlock/*`, `test/DiffBlock.test.tsx`.
- `DiffBlock({ file; kind?: string; lines: { type: 'add' | 'del' | 'ctx' | 'hunk'; text: string; old?: number; new?: number }[]; added?; removed?; look?: 'inline' | 'card' | 'panel'; numbers?: boolean; maxLines?: number; moreLabel?; onMore?; onOpenFile? })` (ch:123–151, 377–388, 467): well `--term-bg` `--r-m`; head min-h 30 `2px 10px`, file a mono button min-h 24, counts `+n −n` in words (`--green` / `--red-text`); lines grid `36px 16px 1fr` (panel `32px 14px`, no numbers `22px`), `--add-bg` / `--del-bg`; card and panel wrap, inline scrolls sideways; a more row.
- Tests: grids per look; wrap vs scroll; counts in words; more row named. Commit `feat(react): diff block`.

### Task 5: AnswerCard — permission, question, plan, dialog
Files: `src/AnswerCard/*`, `test/AnswerCard.test.tsx`.
- `AnswerCard({ kind: 'permission' | 'question' | 'plan' | 'dialog'; title; kindLabel; children; actions?; hint?; answered?: ReactNode })` on Card chat + attention (ch:364–416, 536–599): head `--t-ui` 500 with amber dot, kind at the right; `role="group"` named by the title; actions row min-h 28, buttons `Button size="sm"`.
- `PermissionBody({ command?: string; facts?: { text; warn? }[]; rule?: ReactNode; diff?: ReactNode })` — command box max-h 160 `--term-bg` mono `--t-code`, facts (warn `--ink` 500 + amber dot), the rule line.
- `QuestionBody({ options: { value; label; description?; preview?: ReactNode }[]; multi?; value; onChange; other?: { label; value; onChange } })` — option rows min-h 30 `5px 12px` with RadioGroup / Checkbox marks; the other row with a TextInput look card.
- `PlanBody({ children })` — max-h 320, scrolls (`sp-scroll--8`).
- Tests: group named; question arrows move between radio options, Space toggles checkboxes; answered state replaces actions with its words; values via `rule()`. Commit `feat(react): answer cards`.

### Task 6: Composer, ControlRow, FileChip, ImageChip, SuggestionList
Files: one folder each, `test/Composer.test.tsx`.
- `Composer({ value; onChange; onSend; label; placeholder?; busy?; onStop?; mode?: 'prompt' | 'shell'; chips?; tools?; note?; hint?; readOnly?; sendLabel; stopLabel? })` (ch:256–296, 505–510): outer `0 32px 14px` (narrow container `0 16px 12px`), max `--read-w`; box `8px 8px 8px 12px` `--card` hairline `--r-l` gap 6, focus-within border `rgba(255,255,255,.16)` (shell `.22` + mono); textarea min-h 22 max-h 160 `--t-prose` lh 1.6 auto-grow; bar gap 2, IconButton 28; send 30 `--accent` (the one yellow); Enter sends, Shift+Enter newline, never while composing; Esc → onStop when busy.
- `ControlRow({ items: ReactNode[] })` + `ControlItem({ label; value; onClick?; menu? })` (ch:298–310, 546–556): mt 6, gap 2, `--t-meta` `--ink-3`, items `3px 6px` (button hover `--hover`), separator 1×12; mini HP Meter 56×3.
- `FileChip({ path; look: 'prose' | 'inline' | 'pill' | 'draft'; onOpen?; onRemove?; removeLabel? })` (ch:32, 494–502, 524): the four looks' values; name truncates with the full path in title.
- `ImageChip({ src; name; look: 'chip' | 'thumb' | 'text'; onOpen?; onRemove?; removeLabel?; loading? })` (ch:182, 271–275, 316, 654).
- `SuggestionList({ title?; items: { value; label; desc?; kind?: ReactNode }[]; active: number; onPick; width?: 300 | 460 })` — the mention/slash lists driven by the field (not a trigger): `role="listbox"`, `aria-activedescendant` by the composer, rows min-h 26 `4px 8px`, active `rgba(255,255,255,.06)` (= `--sel-bg`).
- Tests: keys (Enter, Shift+Enter, composing Enter, Esc when busy); send is the only accent (allow-list composer.css); chip looks; listbox roles. Commit `feat(react): composer, control row, chips, suggestions`.

### Task 7: LinkCard, AgentStrip, SidePanel, Lightbox
Files: one folder each, `test/ChatExtras.test.tsx`.
- `LinkCard({ url; title; desc?; site?; image?; onOpen })` (ch:41–51): max 480, `10px 10px 10px 12px`, hairline `--r-l`, hover `rgba(255,255,255,.025)`; desc clamped to 2 lines; image 104×68 `--r-s`; a link named `링크 미리보기: {title}` style (label prop).
- `AgentStrip({ agents: { id; label; state; mark? }[]; onOpen(id) })` + chips (ch:620): h28, max 340, `0 11px 0 10px`, `--r-l`, hairline, `rgba(255,255,255,.025)`, `--t-meta`; enter .28s / exit .32s (off under reduced motion).
- `SidePanel({ title; sub?; counts?; width: 320 | 380; onClose; closeLabel; children; over?: boolean })` (ch:422–473, 633): absolute right, `--side-bg`, left hairline, head h40 `0 8px 0 14px` + × 24; slide .22s; `role="complementary"` named.
- `Lightbox({ pictures: { src; alt; caption? }[]; index; onIndex; onClose; labels })` — Dialog kind lightbox; image max 92vw × 84vh `--r-m` on `#fff`; nav 40 round; ←/→ move.
- Tests: values; LinkCard named; panel named and closes; lightbox arrows. Commit `feat(react): link card, agent strip, side panel, lightbox`.

### Task 8: Docs — spawn · 채팅 (minimal pages); Task 9: release 0.4.0
- Group `spawn · 채팅` / `spawn · chat`, a page per export (line, demo, props, accessibility, merged classes), build test; screenshot the composer, an answer card and the diff at 100 / 130 %. Commit `docs: spawn chat`.
- Changeset minor → 0.4.0; build, typecheck, test; new deferred items into `docs/ISSUES.md`. Commit `chore: release notes 0.4.0`.
