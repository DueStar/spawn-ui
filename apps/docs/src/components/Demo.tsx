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

/** One named example, live, with its code */
export default function Demo({ name }: { name: string }) {
  const d = DEMOS[name]
  if (!d) return <p style={{ color: 'var(--red-text)' }}>no demo “{name}”</p>
  return <Preview code={d.code} surface={d.surface}>{d.render()}</Preview>
}
