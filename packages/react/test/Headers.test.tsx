/** Plan 3, Task 5: SessionHeader, PaneHead, AppHeader, TopBar, ResizeHandle. Values: widget-expanded.css 16–28, 107–168, 240–258, 488–499, 698–712; widget.css 54–68 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AppHeader, PaneHead, ResizeHandle, SessionHeader, SessionPicture, TopBar } from '../src'
import { css, rule } from './css'

describe('SessionHeader', () => {
  const c = () => css('SessionHeader', 'session-header.css')
  it('the bar: --sess-bar-h, 0 8px 0 10px, a bottom hairline, --bg; words on one baseline mid-bar', () => {
    render(<SessionHeader picture={<SessionPicture kind="picture" src="x" size={22} />} name="로그인 고치기" project="shop-web" branch="fix/login" />)
    expect(screen.getByText('로그인 고치기').className).toBe('sp-session-header__name')
    expect(rule(c(), '.sp-session-header')).toMatchObject({ height: 'var(--sess-bar-h)', padding: '0 8px 0 10px', 'border-bottom': '1px solid var(--line)', background: 'var(--bg)' })
    expect(rule(c(), '.sp-session-header__name')).toMatchObject({ 'font-size': 'var(--t-name)', 'font-weight': 'var(--w-name)', color: 'var(--ink)', 'line-height': 'calc(var(--sess-bar-h) - 1px)' })
    expect(rule(c(), '.sp-session-header__project')).toMatchObject({ 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
    expect(rule(c(), '.sp-session-header__branch')['max-width']).toBe('220px')
  })
  it('narrow (420px container): the project gives way before the controls', () => {
    expect(c()).toMatch(/@container sp-sess-head \(max-width: 420px\) \{[\s\S]*?\.sp-session-header__project \{[^}]*text-overflow: ellipsis/)
  })
  it('the × asks once, then closes (sess-head-close: min 24, --t-big; confirm on --danger)', () => {
    const off = vi.fn()
    render(<SessionHeader picture={null} name="n" onClose={off} closeLabel="세션 닫기" closeConfirmLabel="닫기?" />)
    const x = screen.getByRole('button', { name: '세션 닫기' })
    fireEvent.click(x); expect(off).not.toHaveBeenCalled(); expect(x.textContent).toBe('닫기?')
    fireEvent.click(x); expect(off).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-session-header__close')).toMatchObject({ 'min-width': '24px', height: '24px', 'font-size': 'var(--t-big)' })
    expect(rule(c(), '.sp-session-header__close--confirm')).toMatchObject({ background: 'var(--danger)', color: '#fff' })
  })
  it('a double-click on the name renames', () => {
    const r = vi.fn()
    render(<SessionHeader picture={null} name="n" onRename={r} />)
    fireEvent.doubleClick(screen.getByText('n')); expect(r).toHaveBeenCalledTimes(1)
  })
})

describe('PaneHead', () => {
  it('flex 1, 0 6px 0 10px, a left hairline (none on the first); on: --hover', () => {
    render(<PaneHead on>x</PaneHead>)
    expect(document.querySelector('.sp-pane-head')?.className).toBe('sp-pane-head sp-pane-head--on')
    const c = css('PaneHead', 'pane-head.css')
    expect(rule(c, '.sp-pane-head')).toMatchObject({ padding: '0 6px 0 10px', 'border-left': '1px solid var(--line)' })
    expect(rule(c, '.sp-pane-head:first-child')['border-left']).toBe('0')
    expect(rule(c, '.sp-pane-head--on').background).toBe('var(--hover)')
  })
})

describe('AppHeader and TopBar', () => {
  it('AppHeader: 42 tall, 6px 8px 6px 12px, a drag region whose buttons are not; Mac leaves 78 for the lights', () => {
    render(<AppHeader brand={<b>spawn</b>} actions={<button>설정</button>} platform="mac" />)
    expect(document.querySelector('.sp-app-header')?.className).toBe('sp-app-header sp-app-header--mac')
    const c = css('AppHeader', 'app-header.css')
    expect(rule(c, '.sp-app-header')).toMatchObject({ height: '42px', padding: '6px 8px 6px 12px', '-webkit-app-region': 'drag' })
    expect(rule(c, '.sp-app-header--mac')['padding-left']).toBe('78px')
    expect(rule(c, '.sp-app-header button')['-webkit-app-region']).toBe('no-drag')
  })
  it('TopBar: --head-h, 0 8px 0 10px, gap 2, a bottom hairline, --bg', () => {
    render(<TopBar>x</TopBar>)
    expect(rule(css('AppHeader', 'app-header.css'), '.sp-top-bar')).toMatchObject({ height: 'var(--head-h)', padding: '0 8px 0 10px', gap: '2px', 'border-bottom': '1px solid var(--line)', background: 'var(--bg)' })
  })
})

describe('ResizeHandle', () => {
  const setup = (over = {}) => {
    const p = { label: '왼쪽 패널 폭', edge: 'right' as const, value: 300, min: 240, max: 420, step: 10, onResize: vi.fn(), onReset: vi.fn(), ...over }
    render(<ResizeHandle {...p} />)
    return { p, h: screen.getByRole('separator', { name: '왼쪽 패널 폭' }) }
  }
  it('a vertical separator with its value and bounds, reachable by Tab', () => {
    const { h } = setup()
    expect(h.getAttribute('aria-orientation')).toBe('vertical')
    expect(h.getAttribute('aria-valuenow')).toBe('300')
    expect(h.getAttribute('aria-valuemin')).toBe('240')
    expect(h.getAttribute('aria-valuemax')).toBe('420')
    expect(h.tabIndex).toBe(0)
  })
  it('← and → step, clamped at the bounds; Home and a double-click reset', () => {
    const { p, h } = setup({ value: 415 })
    fireEvent.keyDown(h, { key: 'ArrowRight' }); expect(p.onResize).toHaveBeenLastCalledWith(420)
    fireEvent.keyDown(h, { key: 'ArrowLeft' }); expect(p.onResize).toHaveBeenLastCalledWith(405)
    fireEvent.keyDown(h, { key: 'Home' }); expect(p.onReset).toHaveBeenCalledTimes(1)
    fireEvent.doubleClick(h); expect(p.onReset).toHaveBeenCalledTimes(2)
  })
  it('the strip is 7px with a 1px line in the middle: clear at rest (pane: --line), 30 % white on hover, --ink-3 on keyboard focus', () => {
    const c = css('ResizeHandle', 'resize-handle.css')
    expect(rule(c, '.sp-resize')).toMatchObject({ width: '7px', cursor: 'col-resize' })
    expect(rule(c, '.sp-resize::after')).toMatchObject({ left: '3px', width: '1px', background: 'transparent' })
    expect(rule(c, '.sp-resize--line::after').background).toBe('var(--line)')
    expect(rule(c, '.sp-resize:hover::after').background).toBe('rgba(255, 255, 255, 0.3)')
    expect(rule(c, '.sp-resize:focus-visible::after').background).toBe('var(--ink-3)')
    expect(rule(c, '.sp-resize--22').width).toBe('22px')
  })
})
