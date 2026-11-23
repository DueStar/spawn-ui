/** Plan 3, Task 3: SessionRow. Values: spawn widget.css .w-row* (142–330), widget-expanded.css .w-row-close (82) */
import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SessionPicture, SessionRow, type SessionRowProps } from '../src'
import { css, rule } from './css'

const base = (p: Partial<SessionRowProps> = {}): SessionRowProps => ({
  name: '로그인 리다이렉트 고치기', mood: 'needs-you', moodLabel: '확인 필요', picture: <SessionPicture kind="picture" src="x" size={24} />,
  project: 'shop-web', branch: 'fix/login-redirect', lv: 17, hp: 0.62, model: 'Opus 5.5', tokens: '124K', onOpen: vi.fn(), ...p,
})
const c = () => css('SessionRow', 'session-row.css')

describe('SessionRow — detailed', () => {
  it('a button named by its name and status; the chosen one is current', () => {
    render(<SessionRow {...base({ chosen: true })} />)
    const row = screen.getByRole('button', { name: '로그인 리다이렉트 고치기, 확인 필요' })
    expect(row.getAttribute('aria-current')).toBe('true')
    expect(row.className).toContain('sp-session-row--chosen')
  })
  it('Enter and Space open it; F2 renames; a click opens it', () => {
    const p = base({ onRename: vi.fn() })
    render(<SessionRow {...p} />)
    const row = screen.getByRole('button', { name: /확인 필요/ })
    fireEvent.keyDown(row, { key: 'Enter' }); fireEvent.keyDown(row, { key: ' ' }); fireEvent.click(row)
    expect(p.onOpen).toHaveBeenCalledTimes(3)
    fireEvent.keyDown(row, { key: 'F2' }); expect(p.onRename).toHaveBeenCalledTimes(1)
  })
  it('lines: Lv, project, branch (⎇, mono, max 120); HP bar with its model and tokens', () => {
    render(<SessionRow {...base()} />)
    expect(screen.getByText('Lv.17')).toBeTruthy()
    expect(screen.getByText('fix/login-redirect').className).toBe('sp-session-row__branch')
    expect(screen.getByRole('meter').getAttribute('aria-valuenow')).toBe('62')
    expect(screen.getByText('Opus 5.5')).toBeTruthy()
    expect(rule(c(), '.sp-session-row__branch')).toMatchObject({ 'max-width': '120px', 'font-size': 'calc(var(--t-meta) - 0.5px)' })
    expect(rule(c(), '.sp-session-row__branch::before').content).toBe("'⎇ '")
  })
  it('detailed box (w-row): 8px 8px 8px 10px, margin 0 -8px, --r-m, a 4px column; picture 24 + gap 10', () => {
    expect(rule(c(), '.sp-session-row')).toMatchObject({ padding: '8px 8px 8px 10px', margin: '0 -8px', 'border-radius': 'var(--r-m)', gap: '4px' })
    expect(rule(c(), '.sp-session-row__head')).toMatchObject({ 'grid-template-columns': '24px minmax(0, 1fr)', 'column-gap': '10px' })
    expect(rule(c(), '.sp-session-row__line2')).toMatchObject({ 'min-height': '16px', 'font-size': 'var(--t-meta)' })
  })
  it('states: hover --hover; chosen --row-sel-bg and the 2px yellow bar at -8 (widget -4), 10 from top and bottom', () => {
    expect(rule(c(), '.sp-session-row:hover').background).toBe('var(--hover)')
    expect(rule(c(), '.sp-session-row--chosen').background).toBe('var(--row-sel-bg)')
    expect(rule(c(), '.sp-session-row--chosen::before')).toMatchObject({ left: '-8px', top: '10px', bottom: '10px', width: '2px', background: 'var(--accent)' })
    expect(rule(c(), '.sp-session-row--widget.sp-session-row--chosen::before').left).toBe('-4px')
    expect(rule(c(), '.sp-session-row--lifted')).toMatchObject({ background: 'var(--card-2)', 'box-shadow': '0 10px 28px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--line)' })
  })
  it('name: --t-name 500 --ink-2 (chosen --ink); a long name stays on one line with its title', () => {
    render(<SessionRow {...base({ name: '가'.repeat(80) })} />)
    const n = screen.getByText('가'.repeat(80))
    expect(n.getAttribute('title')).toBe('가'.repeat(80))
    expect(rule(c(), '.sp-session-row__name')).toMatchObject({ 'font-size': 'var(--t-name)', 'font-weight': 'var(--w-name)', color: 'var(--ink-2)', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' })
    expect(rule(c(), '.sp-session-row--chosen .sp-session-row__name').color).toBe('var(--ink)')
  })
  it('the mood is said in words, not by the dot alone', () => {
    render(<SessionRow {...base()} />)
    expect(screen.getByText('확인 필요')).toBeTruthy()
  })
  it('the picture hops while it waits on you, not otherwise', () => {
    const { rerender } = render(<SessionRow {...base()} />)
    expect(document.querySelector('.sp-session-row')?.className).toContain('sp-session-row--needs-you')
    expect(rule(c(), '.sp-session-row--needs-you .sp-session-row__picture > *')['animation']).toBe('sp-mon-hop 1.2s cubic-bezier(.3, .7, .4, 1) infinite')
    rerender(<SessionRow {...base({ mood: 'working', moodLabel: '일하는 중' })} />)
    expect(document.querySelector('.sp-session-row')?.className).not.toContain('needs-you')
  })
})

describe('SessionRow — closing asks once', () => {
  it('the first press asks (its words), the second closes; the × is reachable and shown on focus', () => {
    vi.useFakeTimers()
    const p = base({ onClose: vi.fn(), closeLabel: '세션 닫기', closeConfirmLabel: '닫기?' })
    render(<SessionRow {...p} />)
    const x = screen.getByRole('button', { name: '세션 닫기' })
    expect(x.tabIndex).toBe(0)
    fireEvent.click(x)
    expect(p.onClose).not.toHaveBeenCalled()
    expect(p.onOpen).not.toHaveBeenCalled()
    expect(x.textContent).toBe('닫기?')
    fireEvent.click(x)
    expect(p.onClose).toHaveBeenCalledTimes(1)
    act(() => { vi.advanceTimersByTime(4000) })
    vi.useRealTimers()
    expect(rule(c(), '.sp-session-row__tools:focus-within').opacity).toBe('1')
    expect(rule(c(), '.sp-session-row__close--confirm')).toMatchObject({ color: '#fff', background: 'var(--danger)' })
  })
  it('the ask goes away by itself after 3 s', () => {
    vi.useFakeTimers()
    const p = base({ onClose: vi.fn(), closeLabel: '세션 닫기', closeConfirmLabel: '닫기?' })
    render(<SessionRow {...p} />)
    const x = screen.getByRole('button', { name: '세션 닫기' })
    fireEvent.click(x)
    act(() => { vi.advanceTimersByTime(3100) })
    fireEvent.click(x)
    expect(p.onClose).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})

describe('SessionRow — compact', () => {
  it('one line: picture 20, the HP tick (colour only), the dot; 5px 8px 5px 10px; bar 6 from top and bottom', () => {
    render(<SessionRow {...base({ compact: true })} />)
    expect(document.querySelector('.sp-session-row__tick')).not.toBeNull()
    expect(screen.queryByRole('meter')).toBeNull()
    expect(rule(c(), '.sp-session-row--compact')).toMatchObject({ padding: '5px 8px 5px 10px', gap: '0' })
    expect(rule(c(), '.sp-session-row--compact.sp-session-row--chosen::before')).toMatchObject({ top: '6px', bottom: '6px' })
    expect(rule(c(), '.sp-session-row__tick')).toMatchObject({ width: '12px', height: '3px', background: 'var(--hp)' })
  })
  it('an ended compact row is dimmed to .45; a full context fades its tick to .35', () => {
    render(<SessionRow {...base({ compact: true, mood: 'ended', moodLabel: '끝남', hpFull: true })} />)
    expect(rule(c(), '.sp-session-row--compact.sp-session-row--ended').opacity).toBe('0.45')
    expect(document.querySelector('.sp-session-row__tick')?.className).toContain('sp-session-row__tick--full')
    expect(rule(c(), '.sp-session-row__tick--full').opacity).toBe('0.35')
  })
  it('the mood words stay for screen readers when the dot is all that shows', () => {
    render(<SessionRow {...base({ compact: true })} />)
    expect(screen.getByRole('button', { name: /확인 필요/ })).toBeTruthy()
  })
})
