/** Containers (plan 2): Card, Notice, EmptyState (Task 2); Banner, ListRow, Toolbar (Task 3). Values: docs/inventory.md §2.4 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Gear } from '@phosphor-icons/react'
import { Banner, Card, EmptyState, ListRow, Notice, Toolbar } from '../src'
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

describe('Banner', () => {
  const c = () => css('Banner', 'banner.css')
  const amber = 'color-mix(in srgb, var(--amber) 38%, transparent)'
  it('card (chat-banner, ch:237): --card, amber hairline, --r-l, 10px 12px; text --t-meta --ink-2, title --t-ui 500 --ink', () => {
    render(<Banner title="세션을 읽지 못했어요">다시 읽어 보세요</Banner>)
    const b = screen.getByRole('status')
    expect(b.className).toBe('sp-banner sp-banner--card')
    expect(rule(c(), '.sp-banner')).toMatchObject({ border: `1px solid ${amber}` })
    expect(rule(c(), '.sp-banner--card')).toMatchObject({ padding: '10px 12px', 'border-radius': 'var(--r-l)', background: 'var(--card)' })
    expect(rule(c(), '.sp-banner__text')).toMatchObject({ 'font-size': 'var(--t-meta)', color: 'var(--ink-2)' })
    expect(rule(c(), '.sp-banner__title')).toMatchObject({ 'font-size': 'var(--t-ui)', 'font-weight': '500', color: 'var(--ink)' })
  })
  it('compact (w-ask, px:429): 8px 10px; pulse: a 7px amber dot pulsing 1.4s', () => {
    render(<Banner layout="compact" pulse title="확인 필요">x</Banner>)
    expect(document.querySelector('.sp-banner__dot')).not.toBeNull()
    expect(rule(c(), '.sp-banner--compact').padding).toBe('8px 10px')
    expect(rule(c(), '.sp-banner__dot')).toMatchObject({ width: '7px', height: '7px', background: 'var(--amber)', animation: 'sp-banner-pulse 1.4s ease-in-out infinite' })
  })
  it('row (w-row-ask, px:440): --r-m, no fill, 8px 10px', () => {
    expect(rule(c(), '.sp-banner--row')).toMatchObject({ 'border-radius': 'var(--r-m)', background: 'none', padding: '8px 10px' })
  })
  it('floating (fb-bar): fixed at the top centre, 6px 6px 6px 14px, the bar\'s shadow', () => {
    expect(rule(c(), '.sp-banner--floating')).toMatchObject({ position: 'fixed', top: '12px', left: '50%', padding: '6px 6px 6px 14px', 'box-shadow': '0 10px 30px rgba(0, 0, 0, 0.5)' })
  })
  it('an icon is amber; actions sit after the words', () => {
    render(<Banner icon={Gear} actions={<button>다시 읽기</button>}>x</Banner>)
    expect(rule(c(), '.sp-banner__icon').color).toBe('var(--amber)')
    expect(screen.getByRole('button', { name: '다시 읽기' }).parentElement?.className).toBe('sp-banner__actions')
  })
  it('a long title wraps', () => {
    render(<Banner title={'가'.repeat(60)}>x</Banner>)
    expect(document.querySelector('.sp-banner .sp-truncate')).toBeNull()
  })
})

describe('ListRow', () => {
  const c = () => css('ListRow', 'list-row.css')
  it('setting (set-row, we:533): 12px 0, a bottom hairline; title --t-name, description --t-meta --ink-3; the control after the text', () => {
    render(<ListRow title="소리" description="알림 소리를 내요" control={<input type="checkbox" aria-label="c" />} />)
    const row = document.querySelector('.sp-list-row')!
    expect(row.className).toBe('sp-list-row sp-list-row--setting')
    expect(row.lastElementChild?.className).toBe('sp-list-row__control')
    expect(rule(c(), '.sp-list-row--setting')).toMatchObject({ padding: '12px 0', 'border-bottom': '1px solid var(--line)' })
    expect(rule(c(), '.sp-list-row__title')).toMatchObject({ 'font-size': 'var(--t-name)', color: 'var(--ink)' })
    expect(rule(c(), '.sp-list-row__desc')).toMatchObject({ 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
  })
  it('item with onClick (resume-item, we:308): a button, 9px 11px, --r-s, hover hairline + --hover, the inset ring', () => {
    const go = vi.fn()
    render(<ListRow look="item" title="지난 세션" onClick={go} />)
    const b = screen.getByRole('button', { name: /지난 세션/ })
    expect(b.className).toContain('sp-inset-ring')
    fireEvent.click(b); expect(go).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-list-row--item')).toMatchObject({ padding: '9px 11px', 'border-radius': 'var(--r-s)', border: '1px solid transparent' })
    expect(rule(c(), '.sp-list-row--item:hover')).toMatchObject({ 'border-color': 'var(--line-hover)', background: 'var(--hover)' })
  })
  it('item trailing: hidden until hover or focus inside', () => {
    render(<ListRow look="item" title="t" trailing={<button>지우기</button>} />)
    expect(rule(c(), '.sp-list-row__trailing').opacity).toBe('0')
    expect(rule(c(), '.sp-list-row--item:hover .sp-list-row__trailing').opacity).toBe('1')
    expect(rule(c(), '.sp-list-row--item:focus-within .sp-list-row__trailing').opacity).toBe('1')
  })
  it('the item title is one line with an ellipsis (resume-title)', () => {
    render(<ListRow look="item" title={'가'.repeat(80)} />)
    expect(document.querySelector('.sp-list-row__title')?.className).toContain('sp-truncate')
  })
})

describe('Toolbar', () => {
  const c = () => css('Toolbar', 'toolbar.css')
  it('a named group with a bottom hairline that wraps', () => {
    render(<Toolbar label="도감 필터"><Toolbar.Label>세대</Toolbar.Label></Toolbar>)
    const g = screen.getByRole('group', { name: '도감 필터' })
    expect(g.className).toBe('sp-toolbar sp-toolbar--box')
    expect(rule(c(), '.sp-toolbar')).toMatchObject({ 'border-bottom': '1px solid var(--line)', 'flex-wrap': 'wrap' })
    expect(rule(c(), '.sp-toolbar__label')).toMatchObject({ 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
  })
  it('pads as spawn has them: dex 14px 20px 12px, box 8px 20px, rank 12px 20px', () => {
    expect(rule(c(), '.sp-toolbar--dex').padding).toBe('14px 20px 12px')
    expect(rule(c(), '.sp-toolbar--box').padding).toBe('8px 20px')
    expect(rule(c(), '.sp-toolbar--rank').padding).toBe('12px 20px')
  })
})
