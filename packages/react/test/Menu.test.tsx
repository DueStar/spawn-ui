/** Menu (plan 2, Task 6). Values: docs/inventory.md §2.4 Menu, §4 Menus */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Menu, type MenuItem } from '../src'
import { css, rule } from './css'

const ITEMS: MenuItem[] = [
  { value: 'calm', label: '차분하게', desc: '도구 줄을 접어요', checked: true },
  { value: 'off', label: '쓸 수 없음', disabled: true },
  { value: 'all', label: '모두 보기', checked: false },
]
const open = async (onSelect = vi.fn()) => {
  const user = userEvent.setup()
  render(<Menu trigger={<button>보기</button>} label="보기 방식" items={ITEMS} onSelect={onSelect} title="보기 방식 고르기" />)
  const trigger = screen.getByRole('button', { name: '보기' })
  trigger.focus()
  await user.keyboard('{Enter}')
  await screen.findByRole('menu')
  return { user, trigger, onSelect }
}

describe('Menu', () => {
  const c = () => css('Menu', 'menu.css')
  it('Enter on the trigger opens it; arrows move; Enter selects once and closes', async () => {
    const { user, onSelect } = await open()
    // (a disabled item can be reached, as ARIA's menu pattern allows, but Enter on it does nothing)
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement?.textContent).toContain('쓸 수 없음')
    await user.keyboard('{Enter}')
    expect(onSelect).not.toHaveBeenCalled()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))
    expect(onSelect).toHaveBeenCalledWith('all')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })
  it('Esc closes and the focus goes back to the trigger', async () => {
    const { user, trigger } = await open()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })
  it('a disabled item is never chosen', async () => {
    const { user, onSelect } = await open()
    await user.click(screen.getByRole('menuitemradio', { name: /쓸 수 없음/ }))
    expect(onSelect).not.toHaveBeenCalledWith('off')
  })
  it('items with a check are radio items carrying aria-checked', async () => {
    await open()
    expect(screen.getByRole('menuitemradio', { name: /차분하게/ }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('menuitemradio', { name: /모두 보기/ }).getAttribute('aria-checked')).toBe('false')
  })
  it('its title and an item\'s description show', async () => {
    await open()
    expect(screen.getByText('보기 방식 고르기').closest('.sp-menu__title')).not.toBeNull()
    expect(screen.getByText('도구 줄을 접어요').className).toBe('sp-menu__desc')
  })
  it('popover look (dens, textsize, chat): --card, pad 4, a 10 % white border, --r-l, shadow 12/32 .45', () => {
    expect(rule(c(), '.sp-menu')).toMatchObject({ background: 'var(--card)', padding: '4px', border: '1px solid rgba(255, 255, 255, 0.1)', 'border-radius': 'var(--r-l)', 'box-shadow': '0 12px 32px rgba(0, 0, 0, 0.45)' })
    expect(rule(c(), '.sp-menu__item')).toMatchObject({ display: 'grid', 'grid-template-columns': '16px minmax(0, 1fr)', padding: '6px 8px', 'font-size': 'var(--t-ui)', color: 'var(--ink-2)' })
    expect(rule(c(), '.sp-menu__item[data-highlighted]').background).toBe('var(--sel-bg)')
    expect(rule(c(), '.sp-menu__title')).toMatchObject({ padding: '6px 8px 4px', 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
  })
  it('control look (ctrl-menu): a --line border, --r-m, shadow 8/24 .45; items 5px 8px, hover --hover, a 12px check', () => {
    expect(rule(c(), '.sp-menu--control')).toMatchObject({ border: '1px solid var(--line)', 'border-radius': 'var(--r-m)', 'box-shadow': '0 8px 24px rgba(0, 0, 0, 0.45)' })
    expect(rule(c(), '.sp-menu--control .sp-menu__item')).toMatchObject({ padding: '5px 8px', 'grid-template-columns': '12px minmax(0, 1fr)' })
    expect(rule(c(), '.sp-menu--control .sp-menu__item[data-highlighted]').background).toBe('var(--hover)')
  })
  it('an item grows with its text (no fixed height); its focus ring sits inside', () => {
    expect(rule(c(), '.sp-menu__item').height).toBeUndefined()
    expect(rule(c(), '.sp-menu__item:focus-visible')['outline-offset']).toBe('-2px')
  })
  it('a long label stays on one line with an ellipsis and its title', async () => {
    const user = userEvent.setup()
    const long = '가'.repeat(80)
    render(<Menu trigger={<button>m</button>} label="m" items={[{ value: 'x', label: long }]} onSelect={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'm' }))
    const l = (await screen.findByText(long))
    expect(l.className).toContain('sp-truncate')
    expect(l.getAttribute('title')).toBe(long)
  })
})
