/** Plan 3, Task 4: Rail, RailButton, ListHead, Launcher, Account (+ SegmentedControl xs, the list mode). Values: widget-expanded.css 30–75, 590–642; widget.css 100–118; pokedex.css 292–312 */
import { fireEvent, render, screen } from '@testing-library/react'
import { Gear, Plus } from '@phosphor-icons/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Account, IconButton, Launcher, ListHead, Rail, RailButton, SegmentedControl, SessionPicture } from '../src'
import { css, rule } from './css'

describe('Rail and RailButton', () => {
  const c = () => css('Rail', 'rail.css')
  it('the rail: 56 wide, a 2px column, padding 0 0 10px, --side-bg, a hairline at the right; named', () => {
    render(<Rail label="세션"><RailButton label="설정" icon={Gear} onClick={() => {}} /><Rail.Separator /></Rail>)
    expect(screen.getByRole('navigation', { name: '세션' })).toBeTruthy()
    expect(rule(c(), '.sp-rail')).toMatchObject({ width: '56px', gap: '2px', padding: '0 0 10px', background: 'var(--side-bg)', 'border-right': '1px solid var(--line)' })
    expect(rule(c(), '.sp-rail__sep')).toMatchObject({ height: '1px', margin: '4px 0', background: 'var(--line)' })
  })
  it('a button: 38, --r-m, --ink-3; hover --hover --ink', () => {
    expect(rule(c(), '.sp-rail-btn')).toMatchObject({ width: '38px', height: '38px', 'border-radius': 'var(--r-m)', color: 'var(--ink-3)' })
    expect(rule(c(), '.sp-rail-btn:hover')).toMatchObject({ background: 'var(--hover)', color: 'var(--ink)' })
  })
  it('a session: its picture, a mood dot (6, at 4/4, ringed in --side-bg), the mood in its name; chosen: a 5 % fill and the yellow bar at -9', () => {
    const go = vi.fn()
    render(<RailButton label="로그인 고치기" moodLabel="확인 필요" mood="needs-you" picture={<SessionPicture kind="picture" src="x" size={26} />} chosen onClick={go} />)
    const b = screen.getByRole('button', { name: '로그인 고치기 · 확인 필요' })
    expect(b.getAttribute('aria-current')).toBe('true')
    fireEvent.click(b); expect(go).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-rail-btn__dot')).toMatchObject({ right: '4px', bottom: '4px', width: '6px', height: '6px', 'box-shadow': '0 0 0 2px var(--side-bg)' })
    expect(rule(c(), '.sp-rail-btn--needs-you .sp-rail-btn__dot').background).toBe('var(--amber)')
    expect(rule(c(), '.sp-rail-btn--chosen').background).toBe('rgba(255, 255, 255, 0.05)')
    expect(rule(c(), '.sp-rail-btn--chosen::before')).toMatchObject({ left: '-9px', width: '2px', background: 'var(--accent)' })
    expect(rule(c(), '.sp-rail-btn--ended').opacity).toBe('0.45')
  })
})

describe('ListHead (spawn 1.10.14: no count; the mode first, the buttons at the right)', () => {
  it('the mode group comes first, then the actions, pushed right', () => {
    const set = vi.fn()
    render(<ListHead mode="detail" onMode={set} labels={{ compact: '간략', detail: '상세', group: '목록 보기' }} actions={<IconButton size="sm" label="새 세션" icon={Plus} />} />)
    const head = document.querySelector('.sp-list-head')!
    expect(head.firstElementChild?.getAttribute('role')).toBe('group')
    expect(screen.getByRole('group', { name: '목록 보기' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '간략' }))
    expect(set).toHaveBeenCalledWith('compact')
    const c = css('ListHead', 'list-head.css')
    expect(rule(c, '.sp-list-head')).toMatchObject({ gap: '4px', margin: '2px 0 6px', 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
    expect(rule(c, '.sp-list-head__actions')['margin-left']).toBe('auto')
    expect(head.textContent).not.toMatch(/\d/)
  })
  it('the list mode is SegmentedControl xs (w-list-mode): boxed in a hairline, --t-micro, 1px 7px, a 22px hit area', () => {
    render(<SegmentedControl size="xs" label="m" value="a" onChange={() => {}} options={[{ value: 'a', label: 'a' }]} />)
    const c = css('SegmentedControl', 'segmented.css')
    expect(rule(c, '.sp-segmented--xs')).toMatchObject({ border: '1px solid var(--line)', 'border-radius': 'var(--r-s)', padding: '1px', gap: '0' })
    expect(rule(c, '.sp-segmented--xs .sp-segmented__item')).toMatchObject({ padding: '1px 7px', 'font-size': 'var(--t-micro)', 'line-height': '1.4', 'border-radius': 'calc(var(--r-s) - 1px)' })
    expect(rule(c, '.sp-segmented--xs .sp-segmented__item::after')).toMatchObject({ height: '22px' })
  })
})

describe('Launcher', () => {
  it('the main button (ghost, min 34, 7px 8px, --t-ui --ink-2) and the 30-wide alternatives, each named', () => {
    const n = vi.fn(); const f = vi.fn()
    render(<Launcher newLabel="새로운 세션 시작하기" onNew={n} folderLabel="폴더에서 열기" onFolder={f} />)
    fireEvent.click(screen.getByRole('button', { name: '새로운 세션 시작하기' })); expect(n).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: '폴더에서 열기' })); expect(f).toHaveBeenCalledTimes(1)
    const c = css('Launcher', 'launcher.css')
    expect(rule(c, '.sp-launcher')).toMatchObject({ gap: '2px', padding: '6px', 'border-radius': 'var(--r-l)' })
    expect(rule(c, '.sp-launcher__main')).toMatchObject({ 'min-height': '34px', padding: '7px 8px', 'font-size': 'var(--t-ui)', color: 'var(--ink-2)' })
    expect(rule(c, '.sp-launcher__alt').width).toBe('30px')
  })
  it('a long label ends in an ellipsis on one line', () => {
    render(<Launcher newLabel={'가'.repeat(80)} onNew={() => {}} />)
    expect(screen.getByText('가'.repeat(80)).className).toContain('sp-truncate')
  })
})

describe('Account', () => {
  const c = () => css('Account', 'account.css')
  it('signed out: the sign-in button (--t-meta, 3px 10px)', () => {
    const go = vi.fn()
    render(<Account signInLabel="로그인" onSignIn={go} />)
    fireEvent.click(screen.getByRole('button', { name: '로그인' })); expect(go).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-account__signin')).toMatchObject({ 'font-size': 'var(--t-meta)', padding: '3px 10px' })
  })
  it('signed in: a 24px round avatar with the initial when there is no photo; named by the person', () => {
    render(<Account user={{ name: 'Duestar' }} signInLabel="로그인" onSignIn={() => {}} onOpen={() => {}} />)
    const a = screen.getByRole('button', { name: 'Duestar' })
    expect(a.textContent).toBe('D')
    expect(rule(c(), '.sp-account__avatar')).toMatchObject({ width: '24px', height: '24px', 'border-radius': '50%', border: '1px solid var(--line)', background: 'var(--card-2)' })
  })
  it('a photo is decorative (alt "")', () => {
    render(<Account user={{ name: 'D', photo: '/me.png' }} signInLabel="로그인" onSignIn={() => {}} onOpen={() => {}} />)
    expect(document.querySelector('.sp-account__avatar img')?.getAttribute('alt')).toBe('')
  })
})
