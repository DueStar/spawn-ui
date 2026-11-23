import { Gear, Terminal } from '@phosphor-icons/react'
import { Button, Icon, IconButton, Meter, Pill, SegmentedControl, Switch, Tag } from '@spawn-ui/react'
import React, { useState } from 'react'
import Preview from './Preview'

/** A scene from spawn, from the components alone: a session row and a permission card */
export default function Playground() {
  const [view, setView] = useState<'chat' | 'terminal'>('chat')
  const [always, setAlways] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  return (
    <Preview surface="bg" code={`<Pill mood="needs-you">확인 필요</Pill>\n<Meter kind="hp" value={0.62} label="컨텍스트" />\n<Button variant="solid">허용</Button> …`}>
      <div style={{ display: 'grid', gap: 16, width: 520, maxWidth: '100%' }}>
        <div style={{ display: 'grid', gap: 6, padding: '10px 12px', borderRadius: 'var(--r-m)', background: 'var(--row-sel-bg)', boxShadow: 'inset 2px 0 0 var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{ flex: 1, minWidth: 0, color: 'var(--ink)', fontSize: 'var(--t-name)', fontWeight: 500 }}>로그인 리다이렉트 고치기</span>
            <Pill mood="needs-you">확인 필요</Pill>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--t-meta)', color: 'var(--ink-3)' }}>
            <span>HP</span><Meter kind="hp" value={0.62} label="컨텍스트 62%" /><span style={{ color: 'var(--ink-2)' }}>Opus 5.5</span><span>124K</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <SegmentedControl label="보기 방식" value={view} onChange={setView} options={[{ value: 'chat', label: '채팅' }, { value: 'terminal', label: '터미널' }]} />
          <IconButton label="설정" icon={Gear} />
        </div>
        <div style={{ display: 'grid', gap: 12, padding: 14, border: '1px solid var(--line)', borderRadius: 'var(--r-l)', background: 'var(--card)', boxShadow: 'inset 2px 0 0 var(--amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)', fontSize: 'var(--t-ui)' }}>
            <Icon icon={Terminal} size={14} /> <b style={{ fontWeight: 500 }}>명령 실행</b> <Tag>npm test</Tag>
          </div>
          {answer
            ? <span style={{ color: 'var(--ink-2)', fontSize: 'var(--t-ui)' }}>{answer}</span>
            : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Button variant="solid" onClick={() => setAnswer('허용했어요')}>허용</Button>
                <Button onClick={() => setAnswer('항상 허용했어요')}>항상 허용</Button>
                <Button onClick={() => setAnswer('거절했어요')}>거절</Button>
              </div>}
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--ink-2)', fontSize: 'var(--t-meta)' }}>
            <Switch label="이 세션에서는 묻지 않기" checked={always} onCheckedChange={setAlways} /> 이 세션에서는 묻지 않기
          </label>
          {answer && <Button variant="link" onClick={() => setAnswer(null)}>다시 보기</Button>}
        </div>
      </div>
    </Preview>
  )
}
