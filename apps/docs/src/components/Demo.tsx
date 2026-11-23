/**
 * Every live example on the component pages, by name: `<Demo client:load name="button-variants" />`.
 * Each has its code (shown under the preview) and its render (the real @spawn-ui/react components).
 */
import { ArrowsClockwise, Gear, Minus, Square, X } from '@phosphor-icons/react'
import {
  Badge, Button, Checkbox, Icon, IconButton, Meter, Pill, RadioGroup, SegmentedControl, StatusDot, Switch, Tag,
} from '@spawn-ui/react'
import { Warning } from '@phosphor-icons/react'
import { Banner, Card, Dialog, EmptyState, FindBar, ListRow, Menu, Notice, SearchField, Switch as Sw, TabPanel, Tabs, TextInput, Toolbar, Tooltip, Button as Btn } from '@spawn-ui/react'
import {
  Account, AppHeader, CatchToast, DexDetailCard, DexStrip, DragCard, DropZone, LeaderboardRow, Launcher, ListHead, LogDay, LogRow, MonCell, PaneHead,
  PatchNotes, PokemonSprite, QueueStrip, Rail, RailButton, ResizeHandle, SessionHeader, SessionPicture, SessionRow, StatTile, StepCount, TextSizeControl,
  TierLabel, TopBar, TypeTag, UpdateButton, UsageBars, WildRow, IconButton as IBtn, Button as B2,
} from '@spawn-ui/react'
import { Gear as GearIcon, Plus as PlusIcon } from '@phosphor-icons/react'
import React, { useState } from 'react'
import Preview from './Preview'

type Entry = { code: string; render: () => React.ReactNode; surface?: 'bg' | 'card' | 'side-bg' }
const row = (children: React.ReactNode) => <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>{children}</div>
const col = (children: React.ReactNode, w = 260) => <div style={{ display: 'grid', gap: 10, width: w, maxWidth: '100%' }}>{children}</div>

function SortDemo({ size }: { size?: 'sm' | 'md' }) {
  const [v, set] = useState<'mine' | 'recent' | 'dex' | 'tier'>('mine')
  return <SegmentedControl label="정렬" size={size} value={v} onChange={set} options={[{ value: 'mine', label: '내 순서' }, { value: 'recent', label: '최근' }, { value: 'dex', label: '번호' }, { value: 'tier', label: '등급' }]} />
}
function ViewDemo() {
  const [v, set] = useState<'chat' | 'terminal'>('chat')
  return <SegmentedControl label="보기 방식" value={v} onChange={set} options={[{ value: 'chat', label: '채팅' }, { value: 'terminal', label: '터미널' }]} />
}
function SwitchDemo({ start = false, label = '링크 미리보기', disabled = false }: { start?: boolean; label?: string; disabled?: boolean }) {
  const [on, set] = useState(start)
  return <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--ink-2)', fontSize: 'var(--t-ui)' }}><Switch label={label} checked={on} onCheckedChange={set} disabled={disabled} />{label}</label>
}
function CheckDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return col(<><Checkbox label="README도 고치기" checked={a} onCheckedChange={setA} /><Checkbox label="테스트도 돌리기" checked={b} onCheckedChange={setB} /><Checkbox label="배포는 하지 않기" checked disabled onCheckedChange={() => {}} /></>)
}
function RadioDemo() {
  const [v, set] = useState('half')
  return <RadioGroup label="놓을 자리" value={v} onValueChange={set} options={[{ value: 'gap', label: '칸 사이 틈' }, { value: 'half', label: '칸의 왼쪽/오른쪽 반' }, { value: 'all', label: '전체를 칸 수만큼 나눠 보여 주기', disabled: true }]} />
}
function PressedDemo() {
  const [on, set] = useState(false)
  return <IconButton label="자동 새로고침" icon={ArrowsClockwise} pressed={on} onClick={() => set(v => !v)} />
}

export const DEMOS: Record<string, Entry> = {
  // ---------------------------------------------------------------- Icon
  'icon-basic': {
    code: `<Icon icon={Gear} />\n<Icon icon={Gear} size={14} />\n<Icon icon={Gear} size={12} />\n<Icon icon={Gear} label="설정" />`,
    render: () => row(<><Icon icon={Gear} /><Icon icon={Gear} size={14} /><Icon icon={Gear} size={12} /><Icon icon={Gear} label="설정" /></>),
  },
  'icon-snap': {
    code: `<Icon icon={X} size={11} />  {/* 12 */}\n<Icon icon={X} size={13} />  {/* 14 */}\n<Icon icon={X} size={15} />  {/* 16 */}`,
    render: () => row(<><Icon icon={X} size={11} /><Icon icon={X} size={13} /><Icon icon={X} size={15} /></>),
  },
  // ---------------------------------------------------------------- Button
  'button-basic': { code: `<Button>터미널로 보기</Button>`, render: () => <Button>터미널로 보기</Button> },
  'button-variants': {
    code: `<Button variant="solid">허용</Button>\n<Button variant="outline">거절</Button>\n<Button variant="ghost">나중에</Button>\n<Button variant="link">터미널에서 답하기</Button>`,
    render: () => row(<><Button variant="solid">허용</Button><Button variant="outline">거절</Button><Button variant="ghost">나중에</Button><Button variant="link">터미널에서 답하기</Button></>),
    surface: 'card',
  },
  'button-sizes': {
    code: `<Button size="xs">복사</Button>   {/* 24px: the chat */}\n<Button size="sm">보내기</Button>  {/* 28px: a card */}\n<Button size="md">저장</Button>    {/* settings, dialogs */}`,
    render: () => row(<><Button size="xs">복사</Button><Button size="sm">보내기</Button><Button size="md">저장</Button></>),
  },
  'button-disabled': {
    code: `<Button variant="solid" disabled>허용</Button>\n<Button disabled>거절</Button>`,
    render: () => row(<><Button variant="solid" disabled>허용</Button><Button disabled>거절</Button></>),
    surface: 'card',
  },
  'button-card': {
    code: `<Button variant="solid">허용</Button>\n<Button>항상 허용</Button>\n<Button>거절</Button>`,
    render: () => <div style={{ display: 'grid', gap: 10, padding: 14, border: '1px solid var(--line)', borderRadius: 'var(--r-l)', background: 'var(--card)', width: 360, maxWidth: '100%' }}>
      <div style={{ color: 'var(--ink)', fontSize: 'var(--t-ui)' }}>명령 실행: <code>npm test</code></div>
      {row(<><Button variant="solid">허용</Button><Button>항상 허용</Button><Button>거절</Button></>)}
    </div>,
  },
  // ---------------------------------------------------------------- IconButton
  'iconbutton-basic': { code: `<IconButton label="설정" icon={Gear} />`, render: () => <IconButton label="설정" icon={Gear} /> },
  'iconbutton-sizes': {
    code: `<IconButton size="xs" label="탭 닫기" icon={X} />      {/* 20px */}\n<IconButton size="sm" label="이미지 빼기" icon={X} />  {/* 22px */}\n<IconButton size="md" label="최소화" icon={Minus} />   {/* 24×22 */}\n<IconButton size="lg" label="설정" icon={Gear} />      {/* 38px: the rail */}`,
    render: () => row(<><IconButton size="xs" label="탭 닫기" icon={X} /><IconButton size="sm" label="이미지 빼기" icon={X} /><IconButton size="md" label="최소화" icon={Minus} /><IconButton size="lg" label="설정" icon={Gear} /></>),
  },
  'iconbutton-pressed': { code: `const [on, set] = useState(false)\n<IconButton label="자동 새로고침" icon={ArrowsClockwise} pressed={on} onClick={() => set(v => !v)} />`, render: () => <PressedDemo /> },
  'iconbutton-window': {
    code: `<IconButton label="최소화" icon={Minus} />\n<IconButton label="최대화" icon={Square} />\n<IconButton label="닫기" icon={X} />`,
    render: () => row(<><IconButton label="최소화" icon={Minus} /><IconButton label="최대화" icon={Square} /><IconButton label="닫기" icon={X} /></>),
    surface: 'side-bg',
  },
  // ---------------------------------------------------------------- SegmentedControl
  'segmented-basic': { code: `const [v, set] = useState('mine')\n<SegmentedControl label="정렬" value={v} onChange={set}\n  options={[{ value: 'mine', label: '내 순서' }, { value: 'recent', label: '최근' }, { value: 'dex', label: '번호' }, { value: 'tier', label: '등급' }]} />`, render: () => <SortDemo /> },
  'segmented-sizes': { code: `<SegmentedControl size="sm" … />\n<SegmentedControl size="md" … />`, render: () => col(<><SortDemo size="sm" /><SortDemo size="md" /></>, 320) },
  'segmented-view': { code: `<SegmentedControl label="보기 방식" value={v} onChange={set}\n  options={[{ value: 'chat', label: '채팅' }, { value: 'terminal', label: '터미널' }]} />`, render: () => <ViewDemo />, surface: 'side-bg' },
  // ---------------------------------------------------------------- Switch
  'switch-basic': { code: `const [on, set] = useState(false)\n<Switch label="링크 미리보기" checked={on} onCheckedChange={set} />`, render: () => <SwitchDemo /> },
  'switch-states': {
    code: `<Switch label="꺼짐" checked={false} … />\n<Switch label="켜짐" checked … />\n<Switch label="바꿀 수 없음" checked disabled … />`,
    render: () => col(<><SwitchDemo label="꺼짐" /><SwitchDemo label="켜짐" start /><SwitchDemo label="바꿀 수 없음" start disabled /></>),
    surface: 'card',
  },
  // ---------------------------------------------------------------- Checkbox, RadioGroup
  'checkbox-basic': { code: `<Checkbox label="README도 고치기" checked={a} onCheckedChange={setA} />\n<Checkbox label="테스트도 돌리기" checked={b} onCheckedChange={setB} />\n<Checkbox label="배포는 하지 않기" checked disabled … />`, render: () => <CheckDemo />, surface: 'card' },
  'radio-basic': { code: `<RadioGroup label="놓을 자리" value={v} onValueChange={set}\n  options={[{ value: 'gap', label: '칸 사이 틈' }, { value: 'half', label: '칸의 왼쪽/오른쪽 반' }, { value: 'all', label: '…', disabled: true }]} />`, render: () => <RadioDemo />, surface: 'card' },
  // ---------------------------------------------------------------- Status
  'dot-tones': {
    code: `<StatusDot tone="green" label="일하는 중" />\n<StatusDot tone="amber" label="확인 필요" />\n<StatusDot tone="danger" label="오류" />\n<StatusDot label="쉬는 중" />`,
    render: () => row(<><StatusDot tone="green" label="일하는 중" /><StatusDot tone="amber" label="확인 필요" /><StatusDot tone="danger" label="오류" /><StatusDot label="쉬는 중" /></>),
  },
  'dot-tiers': {
    code: `<StatusDot tier="common" />  <StatusDot tier="rare" />  <StatusDot tier="sub" />\n<StatusDot tier="legendary" />  <StatusDot tier="mythical" />`,
    render: () => row(<><StatusDot tier="common" /><StatusDot tier="rare" /><StatusDot tier="sub" /><StatusDot tier="legendary" /><StatusDot tier="mythical" /></>),
  },
  'tag-basic': { code: `<Tag>새로 등록</Tag>\n<Tag>색이 다른</Tag>\n<Tag>실행 중</Tag>`, render: () => row(<><Tag>새로 등록</Tag><Tag>색이 다른</Tag><Tag>실행 중</Tag></>) },
  'tag-tier': {
    code: `<Tag tier="rare">희귀</Tag>\n<Tag tier="sub">준전설</Tag>\n<Tag tier="legendary">전설</Tag>\n<Tag tier="mythical">환상</Tag>`,
    render: () => row(<><Tag tier="rare">희귀</Tag><Tag tier="sub">준전설</Tag><Tag tier="legendary">전설</Tag><Tag tier="mythical">환상</Tag></>),
  },
  'pill-moods': {
    code: `<Pill mood="working">일하는 중</Pill>\n<Pill mood="needs-you">확인 필요</Pill>\n<Pill mood="error">오류</Pill>\n<Pill mood="idle">쉬는 중</Pill>`,
    render: () => row(<><Pill mood="working">일하는 중</Pill><Pill mood="needs-you">확인 필요</Pill><Pill mood="error">오류</Pill><Pill mood="idle">쉬는 중</Pill></>),
  },
  'pill-button': { code: `<Pill mood="needs-you" onClick={openSession}>확인 필요</Pill>`, render: () => <Pill mood="needs-you" onClick={() => {}}>확인 필요</Pill> },
  'badge-basic': { code: `<Badge tone="new">NEW</Badge>\n<Badge tone="count">3</Badge>`, render: () => row(<><Badge tone="new">NEW</Badge><Badge tone="count">3</Badge></>) },
  'meter-hp': {
    code: `<Meter kind="hp" value={0.62} label="컨텍스트" />  {/* green */}\n<Meter kind="hp" value={0.4} label="컨텍스트" />   {/* amber, 50 % and under */}\n<Meter kind="hp" value={0.15} label="컨텍스트" />  {/* red, 20 % and under */}`,
    render: () => col(<><Meter kind="hp" value={0.62} label="컨텍스트 62%" /><Meter kind="hp" value={0.4} label="컨텍스트 40%" /><Meter kind="hp" value={0.15} label="컨텍스트 15%" /></>),
    surface: 'side-bg',
  },
  'meter-usage': {
    code: `<Meter kind="usage" value={0.46} label="5시간" />  {/* grey */}\n<Meter kind="usage" value={0.82} label="주간" />   {/* amber from 80 % */}\n<Meter kind="usage" value={0.93} label="주간" />   {/* red from 90 % */}`,
    render: () => col(<><Meter kind="usage" value={0.46} label="5시간 46%" /><Meter kind="usage" value={0.82} label="주간 82%" /><Meter kind="usage" value={0.93} label="주간 93%" /></>),
    surface: 'side-bg',
  },
  'meter-row': {
    code: `<div className="row">\n  <span>HP</span>\n  <Meter kind="hp" value={0.62} label="컨텍스트" />\n  <span>Opus 5.5</span><span>124K</span>\n</div>`,
    render: () => <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 280, fontSize: 'var(--t-meta)', color: 'var(--ink-3)' }}><span>HP</span><Meter kind="hp" value={0.62} label="컨텍스트 62%" /><span style={{ color: 'var(--ink-2)' }}>Opus 5.5</span><span>124K</span></div>,
    surface: 'side-bg',
  },
}

// ---------------------------------------------------------------- Containers (plan 2)
function DialogDemo({ kind }: { kind: 'picker' | 'settings' | 'full' | 'popover' }) {
  const [open, setOpen] = useState(false)
  const words = { picker: '세션 이어하기', settings: '설정', full: '전체 보기', popover: '피드백' }[kind]
  return <>
    <Btn onClick={() => setOpen(true)}>{words} 열기</Btn>
    <Dialog open={open} kind={kind} title={words} onClose={() => setOpen(false)} closeLabel="닫기"
      sidebar={kind === 'settings' ? <><Btn variant="ghost">일반</Btn><Btn variant="ghost">세션</Btn></> : undefined}>
      <div style={{ padding: kind === 'popover' ? 0 : 14, color: 'var(--ink-2)', fontSize: 'var(--t-ui)' }}>Esc나 바깥을 누르면 닫혀요.</div>
    </Dialog>
  </>
}
function MenuDemo({ look }: { look: 'popover' | 'control' }) {
  const [v, setV] = useState('100')
  const items = look === 'popover'
    ? [{ value: '90', label: '작게', checked: v === '90' }, { value: '100', label: '보통', checked: v === '100' }, { value: '110', label: '크게', checked: v === '110' }]
    : [{ value: 'default', label: '기본', checked: v === 'default' }, { value: 'plan', label: '계획 모드', checked: v === 'plan' }, { value: 'auto', label: '자동 승인', checked: v === 'auto', disabled: true }]
  return <Menu trigger={<Btn>{look === 'popover' ? '글자 크기' : '권한 모드'}</Btn>} label={look === 'popover' ? '글자 크기' : '권한 모드'} title={look === 'popover' ? '글자 크기' : undefined} look={look} items={items} onSelect={setV} placement={look === 'control' ? 'up' : 'down'} />
}
function TabsDemo({ orientation }: { orientation: 'top' | 'vertical' }) {
  const [v, setV] = useState('a')
  const [items, setItems] = useState([{ value: 'a', label: '로그인 리다이렉트' }, { value: 'b', label: 'README 번역' }, { value: 'c', label: '결제 테스트' }])
  return <div style={{ width: 460, maxWidth: '100%' }}>
    <Tabs label="세션" value={v} onValueChange={setV} items={orientation === 'vertical' ? [{ value: 'a', label: '일반' }, { value: 'b', label: '세션' }, { value: 'c', label: '고급' }] : items} orientation={orientation}
      onClose={orientation === 'top' ? x => setItems(cur => cur.filter(i => i.value !== x)) : undefined} closeLabel={it => `${it.label} 닫기`}>
      {['a', 'b', 'c'].map(k => <TabPanel key={k} value={k}><div style={{ padding: 12, color: 'var(--ink-3)', fontSize: 'var(--t-meta)' }}>{k} 내용</div></TabPanel>)}
    </Tabs>
  </div>
}
function FieldDemo() {
  const [v, setV] = useState('')
  return col(<><TextInput label="세션 이름" look="rename" defaultValue="로그인 리다이렉트 고치기" /><TextInput label="명령" size="tool" mono placeholder="npm test" /><TextInput label="답" look="card" placeholder="직접 입력" /><TextInput label="피드백" look="note" placeholder="무엇이 불편했나요?" value={v} onChange={e => setV(e.target.value)} /></>, 320)
}
function SearchDemo() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  return row(<><SearchField label="도감 검색" value={a} onChange={setA} placeholder="이름 · 번호" /><SearchField label="박스 검색" value={b} onChange={setB} width={170} icon /></>)
}
function FindDemo() {
  const [v, setV] = useState('강')
  const [i, setI] = useState(1)
  return <div style={{ position: 'relative', width: 420, height: 90, maxWidth: '100%' }}>
    <FindBar label="대화에서 찾기" value={v} onChange={setV} count={v ? { current: i, total: 5 } : undefined} onNext={() => setI(x => (x % 5) + 1)} onPrev={() => setI(x => ((x + 3) % 5) + 1)} onClose={() => setV('')} note="펼친 내용만 찾아요" labels={{ next: '다음', prev: '이전', close: '닫기' }} />
  </div>
}
function NoticeDemo() {
  const [shown, setShown] = useState(true)
  return col(<><Notice>세션 기록을 읽는 중이에요</Notice><Notice tone="warn">랭킹에 이름이 겹쳐요</Notice><Notice tone="ok">보냈어요</Notice><Notice divider>오늘</Notice>{shown && <Notice boxed size="ui" ink={2} onDismiss={() => setShown(false)} dismissLabel="닫기">새 버전이 나왔어요</Notice>}</>, 320)
}
function ListRowDemo() {
  const [on, setOn] = useState(true)
  return col(<><ListRow title="소리" description="세션이 기다릴 때 알려요" control={<Sw label="소리" checked={on} onCheckedChange={setOn} />} /><ListRow look="item" title="로그인 리다이렉트 고치기" description="shop-web · 2시간 전" onClick={() => {}} trailing={<Btn size="xs" variant="ghost">지우기</Btn>} /></>, 380)
}
function TooltipDemo() {
  return row(<><Tooltip content="채팅으로 보기 (Ctrl+Shift+V)" delay={200}><Btn>채팅</Btn></Tooltip><Tooltip content="지금 보는 칸과 바꿔요" look="tab" delay={200}><Btn>칸 바꾸기</Btn></Tooltip></>)
}
Object.assign(DEMOS, {
  'card-looks': { code: `<Card>위젯 카드</Card>\n<Card pad="chat" attention>확인이 필요해요</Card>\n<Card look="flat">내 순위</Card>\n<Card look="well" well="term">npm test</Card>`, render: () => col(<><Card>위젯 카드</Card><Card pad="chat" attention>확인이 필요해요</Card><Card look="flat">내 순위</Card><Card look="well" well="term"><div style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 'var(--t-code)', color: 'var(--ink-2)' }}>npm test</div></Card></>, 320) },
  'notice-tones': { code: `<Notice>세션 기록을 읽는 중이에요</Notice>\n<Notice tone="warn">…</Notice>\n<Notice tone="ok">보냈어요</Notice>\n<Notice divider>오늘</Notice>\n<Notice boxed onDismiss={…}>새 버전이 나왔어요</Notice>`, render: () => <NoticeDemo /> },
  'empty-sizes': { code: `<EmptyState size="hero" title="새 대화" hint="무엇이든 물어보세요" />\n<EmptyState size="inline" title="아직 잡은 포켓몬이 없어요" />\n<EmptyState size="pane" loading title="불러오는 중" />`, render: () => col(<><EmptyState size="hero" title="새 대화" hint="무엇이든 물어보세요" /><EmptyState size="inline" title="아직 잡은 포켓몬이 없어요" /><EmptyState size="pane" loading title="불러오는 중" /></>, 360) },
  'banner-layouts': { code: `<Banner icon={Warning} title="세션을 채팅으로 읽지 못하고 있어요" actions={<Button>다시 읽기</Button>}>…</Banner>\n<Banner layout="compact" pulse title="확인 필요">npm test를 실행해도 될까요?</Banner>\n<Banner layout="row">…</Banner>`, render: () => col(<><Banner icon={Warning} title="세션을 채팅으로 읽지 못하고 있어요" actions={<Btn>다시 읽기</Btn>}>방금 끝난 답이 세션 기록에서 보이지 않아요</Banner><Banner layout="compact" pulse title="확인 필요">npm test를 실행해도 될까요?</Banner><Banner layout="row">Bash · npm test</Banner></>, 420) },
  'listrow-looks': { code: `<ListRow title="소리" description="…" control={<Switch … />} />\n<ListRow look="item" title="로그인 리다이렉트 고치기" onClick={…} trailing={<Button>지우기</Button>} />`, render: () => <ListRowDemo /> },
  'toolbar-basic': { code: `<Toolbar label="박스 도구">\n  <Toolbar.Label>정렬</Toolbar.Label>\n  …\n</Toolbar>`, render: () => <div style={{ width: 480, maxWidth: '100%' }}><Toolbar label="박스 도구"><Toolbar.Label>정렬</Toolbar.Label><Btn size="xs">최근</Btn><Btn size="xs">번호</Btn><span style={{ marginLeft: 'auto' }}><SearchField label="박스 검색" value="" onChange={() => {}} width={120} /></span></Toolbar></div> },
  'textinput-looks': { code: `<TextInput label="세션 이름" look="rename" … />\n<TextInput label="명령" size="tool" mono />\n<TextInput label="답" look="card" />\n<TextInput label="피드백" look="note" />`, render: () => <FieldDemo /> },
  'searchfield-widths': { code: `<SearchField label="도감 검색" value={v} onChange={setV} />\n<SearchField label="박스 검색" width={170} icon … />`, render: () => <SearchDemo /> },
  'findbar-basic': { code: `<FindBar label="대화에서 찾기" value={v} onChange={setV} count={{ current: 1, total: 5 }}\n  onNext={…} onPrev={…} onClose={…} note="펼친 내용만 찾아요" />`, render: () => <FindDemo /> },
  'dialog-picker': { code: `<Dialog open={open} title="세션 이어하기" onClose={() => setOpen(false)}>…</Dialog>`, render: () => <DialogDemo kind="picker" /> },
  'dialog-kinds': { code: `<Dialog kind="settings" sidebar={…} … />\n<Dialog kind="full" … />\n<Dialog kind="popover" … />`, render: () => row(<><DialogDemo kind="settings" /><DialogDemo kind="full" /><DialogDemo kind="popover" /></>) },
  'menu-popover': { code: `<Menu trigger={<Button>글자 크기</Button>} label="글자 크기" title="글자 크기"\n  items={[{ value: '90', label: '작게', checked: false }, …]} onSelect={setV} />`, render: () => <MenuDemo look="popover" /> },
  'menu-control': { code: `<Menu look="control" placement="up" … />`, render: () => <MenuDemo look="control" /> },
  'tooltip-basic': { code: `<Tooltip content="채팅으로 보기"><Button>채팅</Button></Tooltip>`, render: () => <TooltipDemo /> },
  'tabs-top': { code: `<Tabs label="세션" value={v} onValueChange={setV} items={…} onClose={…}>\n  <TabPanel value="a">…</TabPanel>\n</Tabs>`, render: () => <TabsDemo orientation="top" /> },
  'tabs-vertical': { code: `<Tabs orientation="vertical" … />`, render: () => <TabsDemo orientation="vertical" /> },
  'scroll-sizes': { code: `<div className="sp-scroll--8">…</div>  {/* 6, 8, 10, 0 */}`, render: () => row(<>{[6, 8, 10, 0].map(n => <div key={n} className={`sp-scroll--${n}`} style={{ width: 120, height: 90, overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--r-m)', padding: 8, color: 'var(--ink-3)', fontSize: 'var(--t-meta)' }}>{`${n}px`}<br />{'줄 '.repeat(60)}</div>)}</>) },
} satisfies Record<string, Entry>)

// ---------------------------------------------------------------- spawn · sessions and game (plan 3)
// spawn-ui ships no Pokémon art: the demos draw a neutral placeholder (a ball) where a sprite goes
const MON = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#2c303b" stroke="#7d8291" stroke-width="2"/><path d="M3 16h26" stroke="#7d8291" stroke-width="2"/><circle cx="16" cy="16" r="4" fill="#16181d" stroke="#7d8291" stroke-width="2"/></svg>')
const pic = (size: 18 | 20 | 22 | 24 | 26 | 64 | 96) => <SessionPicture kind="picture" src={MON} size={size} />
function RowsDemo({ compact }: { compact?: boolean }) {
  const [chosen, setChosen] = useState('a')
  const rows = [
    { id: 'a', name: '로그인 리다이렉트 고치기', mood: 'needs-you' as const, moodLabel: '확인 필요', project: 'shop-web', branch: 'fix/login-redirect', lv: 17, hp: 0.62, model: 'Opus 5.5', tokens: '124K' },
    { id: 'b', name: 'README 영어 번역', mood: 'working' as const, moodLabel: '일하는 중', project: 'docs', branch: 'main', lv: 12, hp: 0.88, model: 'Sonnet 5.5', tokens: '176K' },
    { id: 'c', name: '타입 정리', mood: 'idle' as const, moodLabel: '쉬는 중', project: 'core', branch: 'main', lv: 21, hp: 1, hpFull: true, model: 'Opus 5.5', tokens: '200K' },
  ]
  return <div style={{ width: 300, padding: '4px 12px', background: 'var(--side-bg)' }}><div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 'var(--row-gap-compact)' : 'var(--row-gap)' }}>
    {rows.map(r => <SessionRow key={r.id} {...r} compact={compact} picture={pic(compact ? 20 : 24)} chosen={chosen === r.id} onOpen={() => setChosen(r.id)} onRename={() => {}} onClose={() => {}} closeLabel="세션 닫기" closeConfirmLabel="닫기?" renameLabel="이름 바꾸기" />)}
  </div></div>
}
function ListHeadDemo() {
  const [m, setM] = useState<'compact' | 'detail'>('detail')
  return <div style={{ width: 280 }}><ListHead mode={m} onMode={setM} labels={{ compact: '간략', detail: '상세', group: '목록 보기' }} actions={<IBtn size="sm" label="새 세션" icon={PlusIcon} />} /></div>
}
function ResizeDemo() {
  const [w, setW] = useState(300)
  return <div style={{ position: 'relative', width: w, height: 80, background: 'var(--side-bg)', border: '1px solid var(--line)', borderRadius: 'var(--r-m)', color: 'var(--ink-3)', fontSize: 'var(--t-meta)', padding: 8 }}>{w}px<ResizeHandle label="패널 폭" edge="right" value={w} min={240} max={420} onResize={setW} onReset={() => setW(300)} /></div>
}
function QueueDemo() {
  const [open, setOpen] = useState(false)
  return <div style={{ width: 420 }}><QueueStrip label="대기 중 2" first="README도 고쳐 줘" items={['README도 고쳐 줘', '테스트도 돌려 줘']} open={open} onToggle={() => setOpen(v => !v)} /></div>
}
function TextSizeDemo({ compact }: { compact?: boolean }) {
  const [s, setS] = useState(100)
  return <TextSizeControl compact={compact} step={s} onStep={setS} steps={[{ value: 80, label: '아주 작게' }, { value: 90, label: '작게' }, { value: 100, label: '보통' }, { value: 110, label: '크게' }, { value: 120, label: '아주 크게' }]} labels={{ smaller: '글자 작게', larger: '글자 크게', menu: '글자 크기' }} />
}
function NotesDemo() {
  const [open, setOpen] = useState(false)
  return <><B2 onClick={() => setOpen(true)}>새로워진 점 보기</B2><PatchNotes open={open} onClose={() => setOpen(false)} title="새로워진 점" okLabel="확인" releases={[{ version: '1.10.14', items: ['두 칸이 열려 있으면 세 번째는 셋으로 나눠 놓을 자리를 보여 줘요.', '안 열린 세션을 누르면 옆에 새 칸으로 열려요.'] }, { version: '1.10.13', items: ['다시 켜도 칸과 보던 세션이 그대로예요.'] }]} /></>
}
function MonGridDemo() {
  const [p, setP] = useState(1)
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 88px)', gap: 8 }}>
    {[1, 2, 3].map(i => <MonCell key={i} look="dex" label={`포켓몬 ${i}`} no={`#000${i}`} sprite={<PokemonSprite src={MON} size={62} />} picked={p === i} count={i === 2 ? 3 : undefined} onClick={() => setP(i)} />)}
    <MonCell look="dex" label="아직 못 만난 포켓몬" unknown no="#0004" />
  </div>
}
Object.assign(DEMOS, {
  'sessionrow-detail': { code: `<SessionRow name="로그인 리다이렉트 고치기" mood="needs-you" moodLabel="확인 필요"\n  picture={<SessionPicture kind="picture" src={…} size={24} />} project="shop-web" branch="fix/login-redirect"\n  lv={17} hp={0.62} model="Opus 5.5" tokens="124K" chosen onOpen={…} onClose={…} />`, render: () => <RowsDemo />, surface: 'side-bg' },
  'sessionrow-compact': { code: `<SessionRow compact … />`, render: () => <RowsDemo compact />, surface: 'side-bg' },
  'sessionpicture-kinds': { code: `<SessionPicture kind="picture" src={…} size={24} />\n<SessionPicture kind="glyph" size={24} />\n<SessionPicture kind="shell" size={24} />\n<SessionPicture kind="picture" src={…} size={24} hop />`, render: () => row(<>{pic(24)}<SessionPicture kind="glyph" size={24} /><SessionPicture kind="shell" size={24} /><SessionPicture kind="picture" src={MON} size={24} hop /><SessionPicture kind="glyph" size={64} /></>) },
  'pokemonsprite-looks': { code: `<PokemonSprite src={…} size={48} />\n<PokemonSprite src={…} size={48} silhouette />\n<PokemonSprite src={…} size={48} faded />\n<PokemonSprite src={…} size={24} pixelated />`, render: () => row(<><PokemonSprite src={MON} size={48} /><PokemonSprite src={MON} size={48} silhouette /><PokemonSprite src={MON} size={48} faded /><PokemonSprite src={MON} size={24} pixelated /></>) },
  'tierlabel-all': { code: `<TierLabel tier="common">일반</TierLabel> … <TierLabel tier="mythical">환상</TierLabel>`, render: () => row(<>{(['common', 'rare', 'sub', 'legendary', 'mythical'] as const).map(t => <TierLabel key={t} tier={t}>{({ common: '일반', rare: '희귀', sub: '준전설', legendary: '전설', mythical: '환상' })[t]}</TierLabel>)}</>) },
  'typetag-all': { code: `<TypeTag type="fire">불꽃</TypeTag> …`, render: () => row(<>{([['normal', '노말'], ['fire', '불꽃'], ['water', '물'], ['grass', '풀'], ['electric', '전기'], ['psychic', '에스퍼'], ['ice', '얼음'], ['dragon', '드래곤'], ['dark', '악'], ['fairy', '페어리'], ['fighting', '격투'], ['poison', '독'], ['ground', '땅'], ['flying', '비행'], ['bug', '벌레'], ['rock', '바위'], ['ghost', '고스트'], ['steel', '강철']] as const).map(([t, w]) => <TypeTag key={t} type={t}>{w}</TypeTag>)}</>) },
  'rail-basic': { code: `<Rail label="세션">\n  <RailButton label="설정" icon={Gear} onClick={…} />\n  <Rail.Separator />\n  <RailButton label="로그인 고치기" moodLabel="확인 필요" mood="needs-you" picture={…} chosen onClick={…} />\n</Rail>`, render: () => <div style={{ height: 240 }}><Rail label="세션"><RailButton label="설정" icon={GearIcon} onClick={() => {}} /><Rail.Separator /><RailButton label="로그인 고치기" moodLabel="확인 필요" mood="needs-you" picture={pic(26)} chosen onClick={() => {}} /><RailButton label="README 번역" moodLabel="일하는 중" mood="working" picture={pic(26)} onClick={() => {}} /><RailButton label="끝난 세션" moodLabel="끝남" mood="ended" picture={pic(26)} onClick={() => {}} /></Rail></div>, surface: 'side-bg' },
  'listhead-basic': { code: `<ListHead mode={m} onMode={setM} labels={{ compact: '간략', detail: '상세', group: '목록 보기' }} actions={…} />`, render: () => <ListHeadDemo />, surface: 'side-bg' },
  'launcher-basic': { code: `<Launcher newLabel="새로운 세션 시작하기" onNew={…} folderLabel="폴더에서 열기" onFolder={…} resumeLabel="이어하기" onResume={…} />`, render: () => <div style={{ width: 300 }}><Launcher newLabel="새로운 세션 시작하기" onNew={() => {}} folderLabel="폴더에서 열기" onFolder={() => {}} resumeLabel="이어하기" onResume={() => {}} /></div>, surface: 'side-bg' },
  'account-states': { code: `<Account signInLabel="로그인" onSignIn={…} />\n<Account user={{ name: 'Duestar' }} signInLabel="로그인" onSignIn={…} onOpen={…} />`, render: () => row(<><Account signInLabel="로그인" onSignIn={() => {}} /><Account user={{ name: 'Duestar' }} signInLabel="로그인" onSignIn={() => {}} onOpen={() => {}} /></>) },
  'sessionheader-basic': { code: `<SessionHeader picture={…} name="로그인 리다이렉트 고치기" project="shop-web" branch="fix/login-redirect" onClose={…} />`, render: () => <div style={{ width: 560 }}><SessionHeader picture={pic(22)} name="로그인 리다이렉트 고치기" project="shop-web" branch="fix/login-redirect" onClose={() => {}} closeLabel="세션 닫기" closeConfirmLabel="닫기?" /></div> },
  'panehead-basic': { code: `<PaneHead on><SessionHeader … /></PaneHead>\n<PaneHead><SessionHeader … /></PaneHead>`, render: () => <div style={{ display: 'flex', width: 560, height: 40, borderBottom: '1px solid var(--line)' }}><PaneHead on><SessionHeader picture={pic(22)} name="로그인 고치기" /></PaneHead><PaneHead><SessionHeader picture={pic(22)} name="README 번역" /></PaneHead></div> },
  'appheader-basic': { code: `<AppHeader brand={<b>spawn</b>} actions={…} />\n<TopBar>…</TopBar>`, render: () => <div style={{ width: 560, display: 'grid', gap: 8 }}><AppHeader brand={<b style={{ fontWeight: 600 }}>spawn</b>} actions={<IBtn size="head" label="설정" icon={GearIcon} />} /><TopBar><B2 size="xs" variant="ghost">세션</B2><B2 size="xs" variant="ghost">도감</B2></TopBar></div> },
  'resizehandle-basic': { code: `<ResizeHandle label="패널 폭" edge="right" value={w} min={240} max={420} onResize={setW} onReset={…} />`, render: () => <ResizeDemo /> },
  'dragcard-basic': { code: `<DragCard picture={…} label="로그인 고치기" x={x} y={y} />`, render: () => <div style={{ position: 'relative', height: 60 }}><div style={{ position: 'absolute', left: 0, top: 0, transform: 'none' }}><DragCard picture={<PokemonSprite src={MON} size={22} />} label="로그인 고치기" x={0} y={0} /></div></div> },
  'dropzone-basic': { code: `<DropZone left={1 / 3} width={1 / 3} hint="놓으면 가운데에 열려요" />`, render: () => <div style={{ position: 'relative', width: 480, height: 140, border: '1px solid var(--line)', borderRadius: 'var(--r-m)' }}><DropZone left={1 / 3} width={1 / 3} hint="놓으면 가운데에 열려요" /></div> },
  'queue-basic': { code: `<QueueStrip label="대기 중 2" first="README도 고쳐 줘" items={…} open={open} onToggle={…} />`, render: () => <QueueDemo /> },
  'update-states': { code: `<UpdateButton state="available" label="업데이트" … />\n<UpdateButton state="downloading" progress={0.42} label="받는 중" … />\n<UpdateButton state="ready" label="재시작" … />\n<UpdateButton state="failed" label="업데이트 실패" … />`, render: () => row(<><UpdateButton state="available" label="업데이트" onClick={() => {}} /><UpdateButton state="downloading" progress={0.42} label="받는 중" onClick={() => {}} /><UpdateButton state="ready" label="재시작" onClick={() => {}} /><UpdateButton state="failed" label="업데이트 실패" onClick={() => {}} /></>) },
  'textsize-basic': { code: `<TextSizeControl step={s} onStep={setS} steps={…} labels={…} />\n<TextSizeControl compact … />`, render: () => row(<><TextSizeDemo /><TextSizeDemo compact /></>) },
  'usage-basic': { code: `<UsageBars limits={[{ label: '5시간', pct: 0.46, reset: '16:20' }, …]} />`, render: () => <div style={{ width: 300 }}><UsageBars limits={[{ label: '5시간', pct: 0.46, reset: '16:20' }, { label: '주간', pct: 0.82, reset: '11/17' }, { label: '월', pct: 0.93, reset: '12/1' }]} /></div>, surface: 'side-bg' },
  'moncell-dex': { code: `<MonCell look="dex" label="…" no="#0001" sprite={…} picked onClick={…} />\n<MonCell look="dex" label="아직 못 만난 포켓몬" unknown />`, render: () => <MonGridDemo /> },
  'moncell-looks': { code: `<MonCell look="box" … />  <MonCell look="box-icon" … />  <MonCell look="picker" caption="…" … />  <MonCell look="partner" picked … />`, render: () => row(<><MonCell look="box" label="박스" sprite={<PokemonSprite src={MON} size={50} />} working /><MonCell look="box-icon" label="아이콘" sprite={<PokemonSprite src={MON} size={48} max />} /><MonCell look="picker" label="고르기" sprite={<PokemonSprite src={MON} size={40} max />} caption="꼬부기" /><MonCell look="partner" label="파트너" sprite={<PokemonSprite src={MON} size={36} />} picked /></>) },
  'dexstrip-basic': { code: `<DexStrip label="도감" count={185} total={1025} recent={…} isNew newLabel="새로 잡음" onOpen={…} />`, render: () => <div style={{ width: 300 }}><DexStrip label="도감" count={185} total={1025} recent={[1, 2, 3, 4].map(i => ({ key: String(i), sprite: <PokemonSprite src={MON} size={21} /> }))} isNew newLabel="새로 잡음" onOpen={() => {}} /></div>, surface: 'side-bg' },
  'stattile-basic': { code: `<StatTile label="잡은 종류" value={185} of={1025} pct={0.18} />\n<StatTile tier="legendary" label="전설" value={3} of={74} pct={0.04} />`, render: () => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 160px)' }}><StatTile label="잡은 종류" value={185} of={1025} pct={0.18} /><StatTile label="이로치" value={4} /><StatTile tier="legendary" label="전설" value={3} of={74} pct={0.04} /></div> },
  'wildrow-basic': { code: `<WildRow sprite={…} name="피카츄" result="caught" resultLabel="잡았어요" tier="rare" tierLabel="희귀" />`, render: () => col(<><WildRow sprite={MON} name="피카츄" result="caught" resultLabel="잡았어요" tier="rare" tierLabel="희귀" /><WildRow sprite={MON} name="이상해씨" result="fled" resultLabel="도망쳤어요" /></>, 420) },
  'catchtoast-kinds': { code: `<CatchToast kind="catch" sprite={…} eyebrow="잡았어요" title="뮤" tier="mythical" tierLabel="환상" onClose={…} />\n<CatchToast kind="flee" … />`, render: () => col(<><CatchToast kind="catch" sprite={MON} eyebrow="잡았어요" title="뮤" titleNote="Lv.48" tier="mythical" tierLabel="환상" meta="퀵볼 · 로그인 고치기" onClose={() => {}} closeLabel="닫기" /><CatchToast kind="flee" sprite={MON} eyebrow="도망쳤어요" title="이상해씨" onClose={() => {}} closeLabel="닫기" /></>, 380) },
  'leaderboard-basic': { code: `<LeaderboardRow place={1} name="…" value="412" unit="종" />\n<LeaderboardRow place={12} name="Duestar" value="185" unit="종" me meLabel="나" />`, render: () => col(<>{[1, 2, 3].map(i => <LeaderboardRow key={i} place={i} icon={<PokemonSprite src={MON} size={30} />} name={`트레이너 ${i}`} value={String(420 - i * 7)} unit="종" />)}<LeaderboardRow place={12} icon={<PokemonSprite src={MON} size={30} />} name="Duestar" value="185" unit="종" me meLabel="나" /></>, 420) },
  'logrow-basic': { code: `<LogDay label="오늘" />\n<LogRow time="오후 2:12" icon={…} text={<><b>피카츄</b>를 잡았어요</>} sub="희귀 · 몬스터볼" />`, render: () => <div style={{ width: 420 }}><LogDay label="오늘" /><LogRow time="오후 2:12" icon={<PokemonSprite src={MON} size={32} />} text={<><b>피카츄</b>를 잡았어요</>} sub="희귀 · 몬스터볼" /><LogRow kind="flee" time="오후 1:40" icon={<PokemonSprite src={MON} size={32} faded />} text={<><b>이상해씨</b>가 도망쳤어요</>} /></div> },
  'steps-basic': { code: `<StepCount steps={8} label="8걸음" />`, render: () => <span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-meta)' }}><StepCount steps={8} label="8걸음" /></span> },
  'dexcard-basic': { code: `<DexDetailCard art={…} name="피카츄" no="#0025" facts={[{ label: '키', value: '0.4m' }, …]} flavor="…" />`, render: () => <div style={{ width: 300 }}><DexDetailCard art={<PokemonSprite src={MON} size={120} />} name="피카츄" no="#0025" nameExtra={<TierLabel tier="rare">희귀</TierLabel>} tags={<TypeTag type="electric">전기</TypeTag>} flavor="볼에 전기 주머니가 있어요." facts={[{ label: '키', value: '0.4m' }, { label: '몸무게', value: '6.0kg' }]} /></div> },
  'patchnotes-basic': { code: `<PatchNotes open={open} onClose={…} title="새로워진 점" okLabel="확인" releases={[…]} />`, render: () => <NotesDemo /> },
} satisfies Record<string, Entry>)

/** One named example, live, with its code */
export default function Demo({ name }: { name: string }) {
  const d = DEMOS[name]
  if (!d) return <p style={{ color: 'var(--red-text)' }}>no demo “{name}”</p>
  return <Preview code={d.code} surface={d.surface}>{d.render()}</Preview>
}
