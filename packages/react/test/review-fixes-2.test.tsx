/**
 * Plan 2's final review (2026-11-23), each finding pinned: popups stack over dialogs, Esc in a field stays in the
 * field, a dialog's first focus can be chosen, the dialog kinds and the menu, tabs, banner and toolbar variants keep
 * spawn's pixels, and the one focus ring is checked in every file.
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import postcss, { type Rule } from 'postcss'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React, { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Banner, Dialog, Menu, TextInput } from '../src'
import { css, rule } from './css'

describe('C1: menus and tooltips open above every dialog', () => {
  it('the z-index sits on a positioner class (Base UI positions that element, not the popup), above the highest dialog (9020)', () => {
    const m = rule(css('Menu', 'menu.css'), '.sp-menu-positioner')
    const t = rule(css('Tooltip', 'tooltip.css'), '.sp-tooltip-positioner')
    expect(Number(m['z-index'])).toBeGreaterThan(9020)
    expect(Number(t['z-index'])).toBeGreaterThan(9020)
    expect(css('Menu', 'Menu.tsx')).toMatch(/Base\.Positioner[^>]*className="sp-menu-positioner"/)
    expect(css('Tooltip', 'Tooltip.tsx')).toMatch(/Base\.Positioner[^>]*className="sp-tooltip-positioner"/)
  })
})

describe('I2: Esc in a field leaves the field, not the dialog around it', () => {
  it('a TextInput with onCancel inside an open Dialog: Esc cancels the field only', async () => {
    const user = userEvent.setup()
    const close = vi.fn(); const cancel = vi.fn()
    render(<Dialog open title="t" onClose={close}><TextInput label="이름" onCancel={cancel} /></Dialog>)
    const f = await screen.findByRole('textbox', { name: '이름' })
    f.focus()
    await user.keyboard('{Escape}')
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(close).not.toHaveBeenCalled()
  })
  it('FindBar stops Esc the same way', () => {
    expect(css('FindBar', 'FindBar.tsx')).toMatch(/Escape'\) \{ e\.preventDefault\(\); e\.stopPropagation\(\)/)
  })
})

describe('I3: a dialog can say where the focus starts', () => {
  it('initialFocus puts the first focus on that element, not on the ×', async () => {
    function D() {
      const ref = useRef<HTMLButtonElement>(null)
      return <Dialog open title="세션 이어하기" onClose={() => {}} initialFocus={ref}><button>첫째</button><button ref={ref}>둘째</button></Dialog>
    }
    render(<D />)
    await waitFor(() => expect(document.activeElement?.textContent).toBe('둘째'))
  })
})

describe('I4: the dialog kinds keep spawn\'s pixels', () => {
  const c = () => css('Dialog', 'dialog.css')
  it('scope pane (chat-full): positioned absolute inside its pane, not over the window', () => {
    render(<Dialog open kind="full" scope="pane" title="t" onClose={() => {}}>x</Dialog>)
    expect(document.querySelector('.sp-dialog')?.className).toContain('sp-dialog--pane')
    expect(rule(c(), '.sp-dialog--pane .sp-dialog__backdrop').position).toBe('absolute')
    expect(rule(c(), '.sp-dialog--pane .sp-dialog__viewport').position).toBe('absolute')
  })
  it('the lightbox keeps its × (chat-lightbox-x): 32×32 at 14/14, a hairline, --card', async () => {
    render(<Dialog open kind="lightbox" title="사진" closeLabel="닫기" onClose={() => {}}>x</Dialog>)
    expect(await screen.findByRole('button', { name: '닫기' })).toBeTruthy()
    expect(rule(c(), '.sp-dialog--lightbox .sp-dialog__corner')).toMatchObject({ top: '14px', right: '14px', width: '32px', height: '32px', border: '1px solid var(--line)', background: 'var(--card)' })
  })
  it('settings has no head: its × at 12/12 (set-close); the title is said but not drawn', async () => {
    render(<Dialog open kind="settings" title="설정" closeLabel="닫기" onClose={() => {}}>x</Dialog>)
    expect(await screen.findByRole('dialog', { name: '설정' })).toBeTruthy()
    expect(document.querySelector('.sp-dialog__head')).toBeNull()
    expect(rule(c(), '.sp-dialog--settings .sp-dialog__corner')).toMatchObject({ top: '12px', right: '12px' })
  })
  it('the picker\'s and settings\' backdrops keep the widget window\'s round corners (--r-l)', () => {
    expect(rule(c(), '.sp-dialog--picker .sp-dialog__backdrop')['border-radius']).toBe('var(--r-l)')
    expect(rule(c(), '.sp-dialog--settings .sp-dialog__backdrop')['border-radius']).toBe('var(--r-l)')
  })
  it('vertical Tabs make the settings column (set-nav): 148 wide, 16px 8px, a hairline at the right', () => {
    // (outside the narrow-window rule, which turns it into a row)
    expect(css('Tabs', 'tabs.css')).toMatch(/\n\.sp-tabs--vertical \.sp-tabs__list \{[^}]*width: 148px;[^}]*padding: 16px 8px;[^}]*border-right: 1px solid var\(--line\)/)
  })
})

describe('I5: menu items keep their source\'s gap and line height', () => {
  const c = () => css('Menu', 'menu.css')
  it('items: gap 8, no line height of their own (textsize, ctrl); described items (dens): gap 10, 1.35', async () => {
    expect(rule(c(), '.sp-menu__item').gap).toBe('8px')
    expect(rule(c(), '.sp-menu__item')['line-height']).toBeUndefined()
    expect(rule(c(), '.sp-menu--described .sp-menu__item')).toMatchObject({ gap: '10px', 'line-height': '1.35' })
    const user = userEvent.setup()
    render(<Menu trigger={<button>m</button>} label="m" items={[{ value: 'a', label: 'A', desc: 'd' }]} onSelect={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'm' }))
    expect((await screen.findByRole('menu')).className).toContain('sp-menu--described')
  })
})

describe('I6: a session tab pads the whole tab (w-sess-tab)', () => {
  it('0 4px 0 8px and a 6px gap on the item; the tab button itself has no padding', () => {
    const c = css('Tabs', 'tabs.css')
    expect(rule(c, '.sp-tabs--top .sp-tabs__item')).toMatchObject({ padding: '0 4px 0 8px', gap: '6px' })
    expect(rule(c, '.sp-tabs--top .sp-tabs__tab').padding).toBe('0')
  })
})

describe('I7: compact and row banners, and the dex toolbar, are columns as in spawn', () => {
  it('banner compact (w-ask): a column, gap 6; row (w-row-ask): a column, gap 8; their text --t-ui --ink-2', () => {
    const c = css('Banner', 'banner.css')
    expect(rule(c, '.sp-banner--compact')).toMatchObject({ 'flex-direction': 'column', 'align-items': 'stretch', gap: '6px' })
    expect(rule(c, '.sp-banner--row')).toMatchObject({ 'flex-direction': 'column', 'align-items': 'stretch', gap: '8px' })
    expect(rule(c, '.sp-banner--compact .sp-banner__text')).toMatchObject({ 'font-size': 'var(--t-ui)', color: 'var(--ink-2)' })
    render(<Banner layout="compact" title="확인 필요">x</Banner>)
  })
  it('toolbar dex (dex-top): a column, gap 14', () => {
    expect(rule(css('Toolbar', 'toolbar.css'), '.sp-toolbar--dex')).toMatchObject({ 'flex-direction': 'column', 'align-items': 'stretch', gap: '14px' })
  })
})

describe('I8: every :focus-visible outline in the package is the one ring', () => {
  it('2px solid var(--ink-2) wherever it is written (the offset may differ)', () => {
    const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')
    const walk = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })
    const bad: string[] = []
    for (const f of walk(SRC).filter(f => f.endsWith('.css'))) {
      postcss.parse(readFileSync(f, 'utf8')).walkRules((r: Rule) => {
        if (!r.selector.includes(':focus-visible')) return
        r.walkDecls('outline', d => { if (d.value !== '2px solid var(--ink-2)') bad.push(`${f}: ${r.selector} ${d.value}`) })
      })
    }
    expect(bad).toEqual([])
    expect(readFileSync(join(SRC, '..', 'test', 'guards.test.ts'), 'utf8')).toMatch(/every :focus-visible outline/)
  })
})
