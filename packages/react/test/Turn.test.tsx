/** Plan 4, Task 2: UserMessage, TurnHead, TurnFoot, ThinkingRow, LiveBubble, WorkingLine, JumpPill. Values: chat.css 180–233, 318, 661; chat-game.css 37–39 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { JumpPill, LiveBubble, ThinkingRow, TurnFoot, TurnHead, UserMessage, WorkingLine } from '../src'
import { css, rule } from './css'

describe('UserMessage', () => {
  const c = () => css('UserMessage', 'user-message.css')
  it('right, max 78 %; the bubble --card-2 --t-prose lh 1.6, 8px 12px, --r-l, pre-wrap; time --t-micro', () => {
    render(<UserMessage text="로그인 고쳐 줘" time="오후 2:10" />)
    expect(screen.getByText('로그인 고쳐 줘').className).toBe('sp-user__bubble')
    expect(rule(c(), '.sp-user')).toMatchObject({ 'align-items': 'flex-end', 'max-width': '78%', gap: '6px', 'margin-left': 'auto' })
    expect(rule(c(), '.sp-user__bubble')).toMatchObject({ background: 'var(--card-2)', 'font-size': 'var(--t-prose)', 'line-height': '1.6', padding: '8px 12px', 'border-radius': 'var(--r-l)', 'white-space': 'pre-wrap' })
    expect(rule(c(), '.sp-user__time')['font-size']).toBe('var(--t-micro)')
  })
  it('queued: the bubble faded to .55 and the state in words', () => {
    render(<UserMessage text="t" state="queued" stateLabel="대기 중" />)
    expect(screen.getByText('대기 중')).toBeTruthy()
    expect(rule(c(), '.sp-user--queued .sp-user__bubble').opacity).toBe('0.55')
  })
})

describe('TurnHead and TurnFoot', () => {
  it('head: min 22, gap 6, --t-meta --ink-3, the name --ink-2 500', () => {
    render(<TurnHead picture={<i />} name="모래두지" time="오후 2:10" />)
    expect(screen.getByText('모래두지').tagName).toBe('B')
    const c = css('Turn', 'turn.css')
    expect(rule(c, '.sp-turn-head')).toMatchObject({ 'min-height': '22px', gap: '6px', 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
    expect(rule(c, '.sp-turn-head b')).toMatchObject({ 'font-weight': '500', color: 'var(--ink-2)' })
    expect(rule(c, '.sp-turn-head__pic')).toMatchObject({ width: '22px', height: '22px', margin: '0 -1px 0 -3px' })
  })
  it('foot: min 24, gaps 4 / 12, wraps; its action at the right', () => {
    render(<TurnFoot items={['13초', '도구 0회']} action={<button>복사</button>} />)
    const c = css('Turn', 'turn.css')
    expect(rule(c, '.sp-turn-foot')).toMatchObject({ 'min-height': '24px', gap: '4px 12px', 'flex-wrap': 'wrap', 'font-size': 'var(--t-meta)' })
    expect(rule(c, '.sp-turn-foot__action')['margin-left']).toBe('auto')
  })
})

describe('ThinkingRow and LiveBubble', () => {
  it('thinking: a left hairline, 12 in; the head --t-meta 500; the text --t-ui lh 1.65 --ink-3', () => {
    render(<ThinkingRow head="생각 · 4초">고민 중</ThinkingRow>)
    const c = css('ThinkingRow', 'thinking.css')
    expect(rule(c, '.sp-think')).toMatchObject({ 'padding-left': '12px', 'border-left': '1px solid var(--line)', 'font-size': 'var(--t-ui)', 'line-height': '1.65', color: 'var(--ink-3)' })
    expect(rule(c, '.sp-think__head')).toMatchObject({ 'font-size': 'var(--t-meta)', 'font-weight': '500' })
  })
  it('live: its label --t-micro above --ink-2 text', () => {
    render(<LiveBubble label="받는 중">부분 답</LiveBubble>)
    const c = css('ThinkingRow', 'thinking.css')
    expect(rule(c, '.sp-live__label')['font-size']).toBe('var(--t-micro)')
    expect(rule(c, '.sp-live__text').color).toBe('var(--ink-2)')
  })
})

describe('WorkingLine and JumpPill', () => {
  it('working: a status, min 34, the picture hops 1.6s, stop named', () => {
    const s = vi.fn()
    render(<WorkingLine picture={<i />} text="일하는 중 · 12초" onStop={s} stopLabel="멈추기" />)
    expect(screen.getByRole('status').textContent).toContain('일하는 중')
    fireEvent.click(screen.getByRole('button', { name: '멈추기' })); expect(s).toHaveBeenCalledTimes(1)
    const c = css('WorkingLine', 'working.css')
    expect(rule(c, '.sp-working')).toMatchObject({ 'min-height': '34px', gap: '8px', 'font-size': 'var(--t-ui)' })
    expect(rule(c, '.sp-working__pic > *').animation).toBe('sp-chat-hop 1.6s ease-in-out infinite')
    expect(rule(c, '.sp-working--waiting .sp-working__text').color).toBe('var(--ink-2)')
  })
  it('jump: a named button floating at the bottom centre (h28, --card-2, the drop shadow)', () => {
    const go = vi.fn()
    render(<JumpPill label="새 메시지 3개" onClick={go} />)
    fireEvent.click(screen.getByRole('button', { name: '새 메시지 3개' })); expect(go).toHaveBeenCalledTimes(1)
    const c = css('WorkingLine', 'working.css')
    expect(rule(c, '.sp-jump')).toMatchObject({ height: '28px', background: 'var(--card-2)', 'box-shadow': '0 6px 18px rgba(0, 0, 0, 0.45)', border: '1px solid rgba(255, 255, 255, 0.12)' })
  })
})
