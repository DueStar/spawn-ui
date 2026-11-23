/**
 * Every live example on the component pages, by name: `<Demo client:load name="button-variants" />`.
 * Each has its code (shown under the preview) and its render (the real @spawn-ui/react components).
 */
import { ArrowsClockwise, Gear, Minus, Square, X } from '@phosphor-icons/react'
import {
  Badge, Button, Checkbox, Icon, IconButton, Meter, Pill, RadioGroup, SegmentedControl, StatusDot, Switch, Tag,
} from '@spawn-ui/react'
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

/** One named example, live, with its code */
export default function Demo({ name }: { name: string }) {
  const d = DEMOS[name]
  if (!d) return <p style={{ color: 'var(--red-text)' }}>no demo “{name}”</p>
  return <Preview code={d.code} surface={d.surface}>{d.render()}</Preview>
}
