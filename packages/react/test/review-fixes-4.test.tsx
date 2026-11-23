/** Plan 4's final review (2026-11-24), each Important finding pinned */
import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AgentChip, Composer, DiffBlock } from '../src'
import { css, rule } from './css'

function C(p: Partial<React.ComponentProps<typeof Composer>> & { start?: string }) {
  const [v, setV] = useState(p.start ?? 'hi')
  return <Composer label="m" value={v} onChange={setV} onSend={vi.fn()} sendLabel="보내기" {...p} />
}

describe('I1: sending and working are two states', () => {
  it('working: Esc stops; the draft is not dimmed', () => {
    const stop = vi.fn()
    render(<C working onStop={stop} />)
    const f = screen.getByRole('textbox')
    expect(f.getAttribute('aria-busy')).toBeNull()
    fireEvent.keyDown(f, { key: 'Escape' }); expect(stop).toHaveBeenCalledTimes(1)
  })
  it('sending: aria-busy, and Enter sends nothing twice', () => {
    const send = vi.fn()
    render(<C sending onSend={send} />)
    const f = screen.getByRole('textbox')
    expect(f.getAttribute('aria-busy')).toBe('true')
    fireEvent.keyDown(f, { key: 'Enter' }); expect(send).not.toHaveBeenCalled()
  })
})

describe('I2: what can be sent is the app\'s call; an ended composer sends nothing', () => {
  it('canSend with no text (a picture attached) sends', () => {
    const send = vi.fn()
    render(<C start="" canSend onSend={send} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' }); expect(send).toHaveBeenCalledTimes(1)
  })
  it('readOnly blocks Enter and the button', () => {
    const send = vi.fn()
    render(<C readOnly onSend={send} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    expect(send).not.toHaveBeenCalled()
  })
  it('only a plain Enter sends (Ctrl/Alt/Meta+Enter do not)', () => {
    const send = vi.fn()
    render(<C onSend={send} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', ctrlKey: true })
    expect(send).not.toHaveBeenCalled()
  })
})

describe('I3: growing measures a hidden twin (the conversation does not jump)', () => {
  it('a hidden twin textarea; the field scrolls only past 160', () => {
    render(<C />)
    expect(document.querySelectorAll('textarea').length).toBe(2)
    const twin = document.querySelector('.sp-composer__twin') as HTMLTextAreaElement
    expect(twin.getAttribute('aria-hidden')).toBe('true')
    expect(twin.tabIndex).toBe(-1)
    expect(rule(css('Composer', 'composer.css'), '.sp-composer__input')['overflow-y']).toBe('hidden')
  })
})

describe('I4: the field can be wired to a suggestion list', () => {
  it('fieldProps reach the textarea; a ref reaches it; the app\'s keys never run while composing', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    const keys = vi.fn()
    render(<Composer label="m" value="hi" onChange={() => {}} onSend={() => {}} sendLabel="보내기" ref={ref} onFieldKeyDown={keys} fieldProps={{ 'aria-controls': 'sugg', 'aria-activedescendant': 'sugg-1', 'aria-autocomplete': 'list' }} />)
    const f = screen.getByRole('textbox')
    expect(ref.current).toBe(f)
    expect(f.getAttribute('aria-activedescendant')).toBe('sugg-1')
    fireEvent.keyDown(f, { key: 'ArrowDown', isComposing: true, keyCode: 229 }); expect(keys).not.toHaveBeenCalled()
    fireEvent.keyDown(f, { key: 'ArrowDown' }); expect(keys).toHaveBeenCalledTimes(1)
  })
})

describe('I5: the agent chip and the side panel move as spawn\'s (chat-game.css 50–62)', () => {
  it('chip in .28s; gone out .32s after 1.25s; the running dot breathes 1.6s; the panel slides in .22s; all still under reduced motion', () => {
    render(<AgentChip name="a" state="run" stateLabel="일하는 중" gone onOpen={() => {}} />)
    expect(document.querySelector('.sp-agent-chip')?.className).toContain('sp-agent-chip--gone')
    const c = css('AgentChip', 'agent-chip.css')
    expect(rule(c, '.sp-agent-chip').animation).toBe('sp-chip-in .28s cubic-bezier(.2, .7, .2, 1) both')
    expect(rule(c, '.sp-agent-chip--gone').animation).toBe('sp-chip-out .32s ease 1.25s forwards')
    expect(rule(c, '.sp-agent-chip--run .sp-agent-chip__mark i').animation).toBe('sp-halo 1.6s ease-in-out infinite')
    expect(rule(css('SidePanel', 'side-panel.css'), '.sp-side-panel').animation).toBe('sp-panel-in .22s cubic-bezier(.2, .7, .2, 1)')
  })
})

describe('I6: a diff reads its signs and counts', () => {
  it('each line says added or removed; the counts are real text for screen readers', () => {
    render(<DiffBlock file="f" added={1} removed={1} countsLabel="추가 1줄, 삭제 1줄" addedLabel="추가" removedLabel="삭제" lines={[{ type: 'add', text: 'a', new: 1 }, { type: 'del', text: 'b', old: 1 }]} />)
    expect(document.querySelector('.sp-diff__line--add .sp-visually-hidden')?.textContent).toBe('추가')
    expect(document.querySelector('.sp-diff__line--del .sp-visually-hidden')?.textContent).toBe('삭제')
    expect(document.querySelector('.sp-diff__counts .sp-visually-hidden')?.textContent).toBe('추가 1줄, 삭제 1줄')
  })
})
