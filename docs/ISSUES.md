# 모아 둔 문제 (나중에 하나씩)

리뷰에서 미뤄 둔 것과, 사장님이 정해야 할 것. 고치면 줄을 지우고 커밋에 적어요. 각 줄의 출처는 `docs/plans/*.ledger.md`.

## 정해 주실 것

- [ ] **비활성 글자가 잘 안 읽혀요.** spawn 그대로 0.45/0.5로 흐리게 두었더니 명암이 약 1.9:1이에요(기준 3:1). 더 읽히게 바꾸면 spawn 화면도 달라져요. (plan 1)
- [ ] **찾기 바의 화살표 모양.** spawn은 글자 ↑↓, spawn-ui는 Phosphor 아이콘. 적용할 때 어느 쪽으로 맞출지. (plan 2, Task 4)
- [ ] **검색칸 돋보기 크기.** spawn 13px, spawn-ui는 아이콘 규칙(12/14/16) 때문에 12px. (plan 2 review)

## 접근성

- [ ] 세션 탭의 × 버튼들이 `role="tablist"` 안에서 Tab 이동에 끼어들어요(안 보이는 탭 것까지). `tabIndex={-1}` + Delete 키로, 또는 목록 밖으로. (plan 2 review)
- [ ] 메뉴 제목이 `role="menu"` 안의 그냥 `div`라 화면 읽기에서 빠져요. `Menu.Group` + `GroupLabel`로. (plan 2 review)
- [ ] 툴팁 내용을 화면 읽기가 읽지 않아요(Base UI 1.9가 `aria-describedby`를 안 붙여요). 문서에 "트리거에 이름이 따로 있어야 한다"고 적거나 직접 연결. (plan 2 review)

- [ ] SessionRow는 spawn처럼 `role="button"` 줄 안에 ✎·× 버튼이 들어 있어요(버튼 안의 버튼, axe `nested-interactive`). 줄을 목록 항목 + 안쪽 열기 버튼으로 바꾸면 spawn 구조와 하네스가 바뀌어요. (plan 3, Task 3)

## 동작

- [ ] 툴팁의 자동 닫힘 타이머가, 바깥이 `onOpenChange`를 매번 새로 넘기면 처음부터 다시 세요. ref로 바꾸기. (plan 2 review)
- [ ] `PortalProvider`에 `null`을 넘기면 첫 열림이 body로 가요. 문서에 state 콜백 방식(`ref={setEl}`)을 적거나 경고. (plan 2 review)

## spawn과 픽셀 차이

- [ ] ListRow item: 뒤쪽 버튼이 오른쪽 11px·간격 8. spawn의 휴지통은 absolute 오른쪽 8, 줄의 오른쪽 여백 40 → 휴지통 3px, 제목 폭 5px 차이. 쓸 수 없는 줄에도 hover가 보여요(spawn은 `:hover:not(:disabled)`). (plan 2 review)
- [ ] SegmentedControl md(5px 10px)는 아직 spawn에 같은 것이 없어요. 적용할 때 맞출 것. (plan 1, Task 6)

## 문서 사이트

- [ ] Starlight 기본 모양이 spawn과 너무 달라요(사장님: "너무 구려"). 컴포넌트를 다 만든 뒤 spawn(paseo 느낌) 모양과 인터랙션으로 다시 만들기.
