# SDD ledger — plan: docs/plans/2026-11-23-spawn-ui-chat.md
Pre-flight: Task1 CodeBlock and Task4 DiffBlock → Task5 cards consume (slots); Task2 TurnHead uses SessionPicture (plan 3); Task6 Composer uses IconButton, isComposing (plan 2); Task7 Lightbox uses Dialog lightbox (plan 2). Names match.
Task 1: Ruling: MdDoc's tabs reuse SegmentedControl sm restyled to spawn's track (.chat-mddoc-tabs: rgba(.04) track, 1px 8px, on --hover) instead of a new control.
Task 1: complete (commits 73656a1..a6d5f21, tests: react 236/236; red seen: 3)
Task 2: Ruling: WorkingLine's stop is Button xs in --ink (spawn .chat-stop min-h 26 — xs is 24; refined on adoption, in ISSUES). Ruling: queued and pending say their state in words in the time's place.
Task 2: complete (commits a6d5f21..09e0360, tests: react 244/244; red seen: 8)
Task 3: Ruling: ToolGroup / AgentGroup are compositions of ToolRow (a ToolRow whose children are ToolRows) — no separate component. Ruling: ShellRow sits at the right (margin-left auto), where spawn places it among your messages.
Task 3: complete (commits 09e0360..127f25f, tests: react 250/250; red seen: 6)
Task 4: Ruling: the counts' button look (.chat-counts-btn, opens the changes panel) is left to the app (wrap the counts in a Button) — cost: one more prop later. Ruling: hunk lines are type 'gap'.
Task 4: complete (commits 127f25f..c5daeeb, tests: react 254/254; red seen: 4)
Task 5: Ruling: question options are rows with a radio / checkbox mark (role radiogroup / checkbox, arrows and Space) instead of spawn's plain chat-btn rows — the keyboard model the plan's Review Focus asks for; the row keeps spawn's 30 min-height and 5px 12px — cost: a mark at each row's left that spawn's rows did not draw (listed in ISSUES for the owner). Ruling: a DialogCard is AnswerCard kind dialog with its own children (table, pre, links).
Task 5: complete (commits c5daeeb..ab986b1, tests: react 261/261; red seen: 7)
Task 6: Ruling: the mention / slash lists are SuggestionList (a listbox the field drives with aria-activedescendant, the field keeps focus) — not Menu, whose focus moves into it. Ruling: an empty draft's send is aria-disabled (still focusable, named) instead of disabled. Ruling: the composer narrows by an ancestor container (the chat), as spawn's @container. Ruling: accent allow-list += composer.css (.chat-send).
Task 6: complete (commits e81557b..eb1bfeb, tests: react 271/271; red seen: 10)
Task 6: Ruling: test/css.ts rule() now skips rules under max-width/min-width (media or container), as it skipped reduced motion — the composer's narrow rule overrode its normal padding in the helper; committed eb1bfeb with that one test red, fixed in the next commit (suite 271/271).
Task 7: Ruling: AgentStrip is the app's row of AgentChips (a flex row); the chip's enter/exit motion (inventory .28s/.32s) was not found in spawn's chat.css at 1.10.14 — no motion added. Ruling: the SidePanel's slide-in is the app's (its mount) — none here. Ruling: the lightbox's arrows sit on the window's sides (fixed), as spawn's.
Task 7: complete (commits 8e54166..ddd6c83, tests: react 275/275; red seen: 4)
Task 8: complete (commits ddd6c83..657c271, tests: build + docs 7/7, 177 pages; red seen: 2; screenshots composer 100 %, answer card 130 %, diff 100 % looked at)
Task 9: complete (commits 657c271..2949441, tests: build, typecheck, react 275/275, tokens 7/7, docs 7/7)
Final review: opus reviewer — Critical 0, Important 6, Minor ~10. Re-graded as given.
Final: fixed I1 Composer sending (aria-busy, no second send) vs working (Esc stops) — review-fixes-4 RED→GREEN, suite 284/284
Final: fixed I2 canSend prop; readOnly sends nothing; only a plain Enter / Esc acts — RED→GREEN
Final: fixed I3 the height measured on a hidden twin; overflow hidden until 160 — RED→GREEN
Final: fixed I4 fieldProps on the textarea, forwardRef, IME check before the app's keys — RED→GREEN
Final: fixed I5 agent chip in/out/halo and the panel slide from chat-game.css 50–62 (the Task 7 ruling looked in the wrong file) — RED→GREEN
Final: fixed I6 diff lines say added/removed; counts as visually hidden text — RED→GREEN
Final: minor (deferred): 8 lines added to docs/ISSUES.md (composition tracker, answered options, lightbox focus, link title, titles, pixel drifts, accent per selector, css helper option)
