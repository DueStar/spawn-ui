/** Plan 3's final review (2026-11-23), each Important finding pinned */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ResizeHandle, SessionHeader, SessionRow } from '../src'
import { css, rule } from './css'

const row = (p = {}) => ({ name: '로그인 고치기', mood: 'working' as const, moodLabel: '일하는 중', picture: null, onOpen: () => {}, ...p })
const c = () => css('SessionRow', 'session-row.css')

describe('I1: the model column is fixed (every HP bar the same length)', () => {
  it('5.5em, ellipsis, right, --ink-3; the number pulled 3px closer', () => {
    expect(rule(c(), '.sp-session-row__model')).toMatchObject({ width: '5.5em', overflow: 'hidden', 'text-overflow': 'ellipsis', 'text-align': 'right', color: 'var(--ink-3)' })
    expect(rule(c(), '.sp-session-row__model + .sp-session-row__num')['margin-left']).toBe('-3px')
  })
})

describe('I2: the AI tool is a chip (w-row-tool)', () => {
  it('--t-micro, 1px 6px, --r-s, a --line hairline', () => {
    expect(rule(c(), '.sp-session-row__tool')).toMatchObject({ 'font-size': 'var(--t-micro)', padding: '1px 6px', 'border-radius': 'var(--r-s)', border: '1px solid var(--line)' })
  })
})

describe('I3: the compact × keeps its 22px target', () => {
  it('0 4px, min 22 × 22, margin -2px -4px; asking 0 6px', () => {
    expect(rule(c(), '.sp-session-row--compact .sp-session-row__close')).toMatchObject({ padding: '0 4px', 'min-width': '22px', height: '22px', margin: '-2px -4px' })
    expect(rule(c(), '.sp-session-row--compact .sp-session-row__close--confirm').padding).toBe('0 6px')
  })
})

describe('I4: the ask is spoken', () => {
  it('row: while asking, the ×\'s name and title are the ask', () => {
    render(<SessionRow {...row({ onClose: vi.fn(), closeLabel: '세션 닫기', closeConfirmLabel: '닫기?', closeConfirmHint: '한 번 더 누르면 세션을 닫아요' })} />)
    const x = screen.getByRole('button', { name: '세션 닫기' })
    fireEvent.click(x)
    expect(x.getAttribute('aria-label')).toBe('닫기?')
    expect(x.getAttribute('title')).toBe('한 번 더 누르면 세션을 닫아요')
  })
  it('header: the same', () => {
    render(<SessionHeader picture={null} name="n" onClose={() => {}} closeLabel="세션 닫기" closeConfirmLabel="닫기?" />)
    const x = screen.getByRole('button', { name: '세션 닫기' })
    fireEvent.click(x)
    expect(x.getAttribute('aria-label')).toBe('닫기?')
  })
})

describe('I5: a row says its HP in words', () => {
  it('the row\'s name carries hpTitle (compact rows show the tick only)', () => {
    render(<SessionRow {...row({ compact: true, hp: 0.3, hpTitle: '남은 컨텍스트 30%' })} />)
    expect(screen.getByRole('button', { name: '로그인 고치기, 일하는 중, 남은 컨텍스트 30%' })).toBeTruthy()
  })
})

describe('I6: ResizeHandle drags cleanly and says when', () => {
  const setup = () => {
    const p = { label: 'w', edge: 'right' as const, value: 300, min: 240, max: 420, onResize: vi.fn(), onDragging: vi.fn(), onResizeEnd: vi.fn() }
    render(<ResizeHandle {...p} />)
    return { p, h: screen.getByRole('separator') }
  }
  it('a right-click does not start a drag', () => {
    const { p, h } = setup()
    fireEvent.pointerDown(h, { button: 2, clientX: 0, pointerId: 1 })
    fireEvent.pointerMove(h, { clientX: 40, pointerId: 1 })
    expect(p.onResize).not.toHaveBeenCalled()
    expect(p.onDragging).not.toHaveBeenCalled()
  })
  it('a drag says it starts and ends, and reports the last width once', () => {
    const { p, h } = setup()
    fireEvent.pointerDown(h, { button: 0, clientX: 0, pointerId: 1 })
    expect(p.onDragging).toHaveBeenLastCalledWith(true)
    fireEvent.pointerMove(h, { clientX: 40, pointerId: 1 })
    expect(p.onResize).toHaveBeenLastCalledWith(340)
    fireEvent.pointerUp(h, { pointerId: 1 })
    expect(p.onDragging).toHaveBeenLastCalledWith(false)
    expect(p.onResizeEnd).toHaveBeenCalledWith(340)
  })
  it('a lost capture ends the drag (no stuck resizing)', () => {
    const { p, h } = setup()
    fireEvent.pointerDown(h, { button: 0, clientX: 0, pointerId: 1 })
    fireEvent(h, new Event('lostpointercapture', { bubbles: true }))
    fireEvent.pointerMove(h, { clientX: 40, pointerId: 1 })
    expect(p.onResize).not.toHaveBeenCalled()
    expect(p.onDragging).toHaveBeenLastCalledWith(false)
  })
})

describe('I7: the toast keeps the 100 % type wherever it is shown', () => {
  it('its own --t-* at the 보통 values (spawn tokens.css :root)', () => {
    expect(rule(css('CatchToast', 'catch-toast.css'), '.sp-toast')).toMatchObject({ '--t-micro': '10px', '--t-meta': '11px', '--t-ui': '12px', '--t-name': '12px' })
  })
})
