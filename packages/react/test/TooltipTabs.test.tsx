/** Tooltip and Tabs (plan 2, Task 7). Values: docs/inventory.md §2.4 Tooltip, Tabs */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TabPanel, Tabs, Tooltip, type TabItem } from '../src'
import { css, rule } from './css'

describe('Tooltip', () => {
  const c = () => css('Tooltip', 'tooltip.css')
  it('shows its words when the trigger gets the keyboard focus, and Esc hides them', async () => {
    const user = userEvent.setup()
    render(<Tooltip content="채팅으로 보기" delay={0}><button>보기</button></Tooltip>)
    await user.tab()
    expect(await screen.findByText('채팅으로 보기')).toBeTruthy()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('채팅으로 보기')).toBeNull())
  })
  it('a controlled note closes itself after its timeout', async () => {
    vi.useFakeTimers()
    const change = vi.fn()
    render(<Tooltip content="n" open timeout={50} onOpenChange={change}><button>b</button></Tooltip>)
    await act(async () => { vi.advanceTimersByTime(60) })
    expect(change).toHaveBeenCalledWith(false)
    vi.useRealTimers()
  })
  it('note (w-lens-note): --card, a --line-hover hairline, --r-m, 6px 10px, --t-meta, line-height 1.5, max 300 wide', () => {
    expect(rule(c(), '.sp-tooltip')).toMatchObject({ background: 'var(--card)', border: '1px solid var(--line-hover)', 'border-radius': 'var(--r-m)', padding: '6px 10px', 'font-size': 'var(--t-meta)', 'line-height': '1.5', 'max-width': '300px' })
  })
  it('tab look (w-tab-note): 7px 12px, --t-ui', () => {
    expect(rule(c(), '.sp-tooltip--tab')).toMatchObject({ padding: '7px 12px', 'font-size': 'var(--t-ui)' })
  })
})

const ITEMS: TabItem[] = [
  { value: 'a', label: '일반' },
  { value: 'b', label: '세션' },
  { value: 'c', label: '고급' },
]
function Harness({ onClose, items = ITEMS, orientation = 'top' as const }: { onClose?(v: string): void; items?: TabItem[]; orientation?: 'top' | 'vertical' }) {
  const [v, setV] = useState('a')
  return (
    <Tabs label="설정 탭" value={v} onValueChange={setV} items={items} orientation={orientation} onClose={onClose} closeLabel={it => `${it.label} 닫기`}>
      <TabPanel value="a">A</TabPanel><TabPanel value="b">B</TabPanel><TabPanel value="c">C</TabPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  const c = () => css('Tabs', 'tabs.css')
  it('a named tab list; the chosen tab is selected; arrows move between tabs', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    expect(screen.getByRole('tablist', { name: '설정 탭' })).toBeTruthy()
    const a = screen.getByRole('tab', { name: '일반' })
    expect(a.getAttribute('aria-selected')).toBe('true')
    a.focus()
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '세션' }))
  })
  it('choosing a tab shows its panel', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('tab', { name: '고급' }))
    expect(screen.getByRole('tab', { name: '고급' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').textContent).toBe('C')
  })
  it('closable: a named × per tab, beside the tab (never inside it), called with its value', async () => {
    const off = vi.fn()
    render(<Harness onClose={off} />)
    const x = screen.getByRole('button', { name: '세션 닫기' })
    expect(x.closest('[role="tab"]')).toBeNull()
    fireEvent.click(x)
    expect(off).toHaveBeenCalledWith('b')
  })
  it('top (w-sess-tab, we:669): rounded on top only, 0 4px 0 8px; on: --hover with a 2px --ink-2 underline; the × shows on hover or focus', () => {
    expect(rule(c(), '.sp-tabs--top .sp-tabs__tab')).toMatchObject({ 'border-radius': 'var(--r-s) var(--r-s) 0 0', padding: '0 4px 0 8px', color: 'var(--ink-3)' })
    expect(rule(c(), '.sp-tabs--top .sp-tabs__item[data-on]')).toMatchObject({ background: 'var(--hover)', 'box-shadow': 'inset 0 -2px 0 var(--ink-2)' })
    expect(rule(c(), '.sp-tabs__close').opacity).toBe('0')
    expect(rule(c(), '.sp-tabs__item:hover .sp-tabs__close').opacity).toBe('1')
    expect(rule(c(), '.sp-tabs__item:focus-within .sp-tabs__close').opacity).toBe('1')
  })
  it('vertical (set-nav, we:516): min-height 32, 7px 10px, --t-ui; on: --sel-bg; a row below 560px', () => {
    render(<Harness orientation="vertical" />)
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('vertical')
    expect(rule(c(), '.sp-tabs--vertical .sp-tabs__tab')).toMatchObject({ 'min-height': '32px', padding: '7px 10px', 'font-size': 'var(--t-ui)' })
    expect(rule(c(), '.sp-tabs--vertical .sp-tabs__item[data-on] .sp-tabs__tab')).toMatchObject({ background: 'var(--sel-bg)', color: 'var(--ink)' })
    expect(c()).toMatch(/@media \(max-width: 560px\) \{[\s\S]*?\.sp-tabs--vertical \.sp-tabs__list \{[^}]*flex-direction: row/)
  })
  it('a long Korean label stays on one line with an ellipsis and its title', () => {
    const long = '가'.repeat(80)
    render(<Harness items={[{ value: 'a', label: long }]} />)
    const l = screen.getByText(long)
    expect(l.className).toContain('sp-truncate')
    expect(l.getAttribute('title')).toBe(long)
  })
})
