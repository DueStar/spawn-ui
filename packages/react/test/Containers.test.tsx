/** Containers (plan 2): Card, Notice, EmptyState (Task 2); Banner, ListRow, Toolbar (Task 3). Values: docs/inventory.md §2.4 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Card, EmptyState, Notice } from '../src'
import { css, rule } from './css'

describe('Card', () => {
  const c = () => css('Card', 'card.css')
  it("surface (the default): --card, a --line hairline, --r-l, the widget's 10px 12px (w:39)", () => {
    render(<Card data-testid="c">x</Card>)
    expect(screen.getByTestId('c').className).toBe('sp-card sp-card--surface sp-card--pad-widget')
    expect(rule(c(), '.sp-card--surface')).toMatchObject({ background: 'var(--card)', border: '1px solid var(--line)', 'border-radius': 'var(--r-l)' })
    expect(rule(c(), '.sp-card--pad-widget').padding).toBe('10px 12px')
  })
  it('pads: chat 12px 14px in a 10px-gap column (ch:360), system 16px (sys-spec)', () => {
    expect(rule(c(), '.sp-card--pad-chat')).toMatchObject({ padding: '12px 14px', display: 'flex', 'flex-direction': 'column', gap: '10px' })
    expect(rule(c(), '.sp-card--pad-system').padding).toBe('16px')
  })
  it('flat (rank-me): no fill, --r-m, a hairline', () => {
    expect(rule(c(), '.sp-card--flat')).toMatchObject({ background: 'none', border: '1px solid var(--line)', 'border-radius': 'var(--r-m)' })
  })
  it('well (code, diff): --r-m, --term-bg or --card, clipped', () => {
    render(<Card look="well" well="term" data-testid="w">x</Card>)
    expect(screen.getByTestId('w').className).toContain('sp-card--well-term')
    expect(rule(c(), '.sp-card--well')).toMatchObject({ 'border-radius': 'var(--r-m)', overflow: 'hidden' })
    expect(rule(c(), '.sp-card--well-term').background).toBe('var(--term-bg)')
  })
  it('section (the side panel in window mode, we:395): no fill, only a bottom hairline, 10px 16px', () => {
    expect(rule(c(), '.sp-card--section')).toMatchObject({ background: 'transparent', border: '0', 'border-bottom': '1px solid var(--line)', 'border-radius': '0', padding: '10px 16px' })
  })
  it('attention (chat-card.ask, ch:362): amber 38 % border and a 2px amber bar inside the left edge', () => {
    render(<Card attention data-testid="a">x</Card>)
    expect(screen.getByTestId('a').className).toContain('sp-card--attention')
    expect(rule(c(), '.sp-card--attention')['border-color']).toBe('color-mix(in srgb, var(--amber) 38%, transparent)')
    expect(rule(c(), '.sp-card--attention::before')).toMatchObject({ left: '-1px', top: '10px', bottom: '10px', width: '2px', background: 'var(--amber)' })
  })
  it('passes a ref and its props', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref} id="k" className="mine">x</Card>)
    expect(ref.current?.id).toBe('k')
    expect(ref.current?.className).toContain('mine')
  })
})

describe('Notice', () => {
  const c = () => css('Notice', 'notice.css')
  it('plain: --t-meta in --ink-3 (chat-note); ui size and ink 2 when asked', () => {
    render(<><Notice data-testid="a">a</Notice><Notice size="ui" ink={2} data-testid="b">b</Notice></>)
    expect(screen.getByTestId('a').className).toBe('sp-notice sp-notice--meta sp-notice--ink-3')
    expect(screen.getByTestId('b').className).toBe('sp-notice sp-notice--ui sp-notice--ink-2')
    expect(rule(c(), '.sp-notice--meta')['font-size']).toBe('var(--t-meta)')
    expect(rule(c(), '.sp-notice--ink-3').color).toBe('var(--ink-3)')
  })
  it('warn amber, ok green (they win over the ink)', () => {
    render(<Notice tone="warn" data-testid="w">w</Notice>)
    expect(screen.getByTestId('w').className).toContain('sp-notice--warn')
    expect(rule(c(), '.sp-notice.sp-notice--warn').color).toBe('var(--amber)')
    expect(rule(c(), '.sp-notice.sp-notice--ok').color).toBe('var(--green)')
  })
  it('boxed (w-note, w:228): 6px 9px, a hairline, --r-s, enters in .2s', () => {
    expect(rule(c(), '.sp-notice--boxed')).toMatchObject({ padding: '6px 9px', border: '1px solid var(--line)', 'border-radius': 'var(--r-s)', animation: 'sp-note-in 0.2s ease-out both' })
  })
  it('divider (chat-day): centered, 2px 0 6px', () => {
    render(<Notice divider data-testid="d">오늘</Notice>)
    expect(screen.getByTestId('d').className).toContain('sp-notice--divider')
    expect(rule(c(), '.sp-notice--divider')).toMatchObject({ 'text-align': 'center', padding: '2px 0 6px' })
  })
  it('an action is a link button; dismissing is a named button called once', () => {
    const act = vi.fn(); const off = vi.fn()
    render(<Notice action={{ label: '다시 보기', onClick: act }} onDismiss={off} dismissLabel="알림 닫기">새 버전이 있어요</Notice>)
    const b = screen.getByRole('button', { name: '다시 보기' })
    expect(b.className).toContain('sp-button--link')
    fireEvent.click(b); expect(act).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: '알림 닫기' })); expect(off).toHaveBeenCalledTimes(1)
  })
  it('long Korean words wrap (no truncation)', () => {
    render(<Notice data-testid="l">{'가'.repeat(60)}</Notice>)
    expect(screen.getByTestId('l').querySelector('.sp-truncate')).toBeNull()
    expect(rule(c(), '.sp-notice')['white-space']).toBeUndefined()
  })
})

describe('EmptyState', () => {
  const c = () => css('EmptyState', 'empty-state.css')
  it('hero (chat-empty): a centered column, gap 8, pad 24; title --t-head --ink-2, hint --t-meta --ink-3', () => {
    render(<EmptyState size="hero" title="새 대화" hint="무엇이든 물어보세요" />)
    expect(screen.getByText('새 대화').className).toBe('sp-empty__title')
    expect(rule(c(), '.sp-empty--hero')).toMatchObject({ display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center', gap: '8px', padding: '24px', 'text-align': 'center' })
    expect(rule(c(), '.sp-empty--hero .sp-empty__title')).toMatchObject({ 'font-size': 'var(--t-head)', color: 'var(--ink-2)' })
    expect(rule(c(), '.sp-empty__hint')).toMatchObject({ 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
  })
  it('pane (w-term-empty): full height, centered, gap 8, --ink-3, title 500', () => {
    expect(rule(c(), '.sp-empty--pane')).toMatchObject({ height: '100%', gap: '8px', color: 'var(--ink-3)' })
    expect(rule(c(), '.sp-empty--pane .sp-empty__title')['font-weight']).toBe('500')
  })
  it('inline (dex-empty): pad 20, spans its grid, --t-ui --ink-3', () => {
    expect(rule(c(), '.sp-empty--inline')).toMatchObject({ padding: '20px', 'grid-column': '1 / -1', 'font-size': 'var(--t-ui)', color: 'var(--ink-3)' })
  })
  it('loading is a polite status', () => {
    render(<EmptyState size="pane" loading title="불러오는 중" />)
    const s = screen.getByRole('status')
    expect(s.getAttribute('aria-live')).toBe('polite')
    expect(s.textContent).toContain('불러오는 중')
  })
  it('a long Korean title wraps', () => {
    render(<EmptyState size="hero" title={'가'.repeat(60)} />)
    expect(document.querySelector('.sp-empty .sp-truncate')).toBeNull()
  })
})
