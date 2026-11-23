/** Plan 4, Task 3: ToolRow, ShellRow. Values: chat.css 81–104, 514–521 */
import { fireEvent, render, screen } from '@testing-library/react'
import { Terminal } from '@phosphor-icons/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ShellRow, ToolRow } from '../src'
import { css, rule } from './css'

describe('ToolRow', () => {
  const c = () => css('ToolRow', 'tool-row.css')
  it('its head is a button saying whether it is open; the chevron turns 90°', () => {
    const t = vi.fn()
    const { rerender } = render(<ToolRow icon={Terminal} label="Bash" detail="npm test" mono meta="1.2초" onToggle={t}>out</ToolRow>)
    const b = screen.getByRole('button', { name: /Bash/ })
    expect(b.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(b); expect(t).toHaveBeenCalledTimes(1)
    rerender(<ToolRow icon={Terminal} label="Bash" detail="npm test" mono open onToggle={t}>out</ToolRow>)
    expect(screen.getByText('out')).toBeTruthy()
    expect(rule(c(), '.sp-tool--open > .sp-tool__head .sp-tool__chev').transform).toBe('rotate(90deg)')
  })
  it('head: min 30, margin-left -4, --r-s, --t-ui --ink-2, hover --hover; mono detail --t-ui - 1px; meta at the right', () => {
    expect(rule(c(), '.sp-tool__head')).toMatchObject({ 'min-height': '30px', 'margin-left': '-4px', 'border-radius': 'var(--r-s)', 'font-size': 'var(--t-ui)', color: 'var(--ink-2)' })
    expect(rule(c(), '.sp-tool__head:hover').background).toBe('var(--hover)')
    expect(rule(c(), '.sp-tool__detail--mono')['font-size']).toBe('calc(var(--t-ui) - 1px)')
    expect(rule(c(), '.sp-tool__meta')).toMatchObject({ 'margin-left': 'auto', 'font-size': 'var(--t-meta)' })
  })
  it('body: 2px 0 6px 10px in, a left hairline (red .35 when it failed); output max 320', () => {
    expect(rule(c(), '.sp-tool__body')).toMatchObject({ margin: '2px 0 6px 10px', padding: '4px 0 4px 14px', 'border-left': '1px solid var(--line)' })
    expect(rule(c(), '.sp-tool--fail > .sp-tool__body')['border-left-color']).toBe('rgba(255, 100, 100, 0.35)')
    expect(rule(c(), '.sp-tool--fail .sp-tool__label').color).toBe('var(--red-text)')
    expect(rule(c(), '.sp-tool__out')).toMatchObject({ 'max-height': '320px', 'font-size': 'calc(var(--t-code) - 1px)' })
  })
  it('a long detail stays on one line with its title', () => {
    render(<ToolRow label="Read" detail={'a/'.repeat(80)} />)
    expect(screen.getByText('a/'.repeat(80)).getAttribute('title')).toBe('a/'.repeat(80))
  })
})

describe('ShellRow', () => {
  it('max 88 %; a box min 220, 8px 12px 9px, --r-l, a dark tint; the command mono --t-code after its $; output under a hairline, max 360', () => {
    render(<ShellRow command="git status" output="clean" />)
    expect(screen.getByText('git status')).toBeTruthy()
    const c = css('ShellRow', 'shell-row.css')
    expect(rule(c, '.sp-shell')['max-width']).toBe('88%')
    expect(rule(c, '.sp-shell__box')).toMatchObject({ 'min-width': '220px', padding: '8px 12px 9px', 'border-radius': 'var(--r-l)', background: 'rgba(0, 0, 0, 0.22)' })
    expect(rule(c, '.sp-shell__cmd')['font-size']).toBe('var(--t-code)')
    expect(rule(c, '.sp-shell__out')).toMatchObject({ 'border-top': '1px solid var(--line)', 'max-height': '360px' })
  })
  it('an error in --red-text; running says so', () => {
    render(<ShellRow command="x" error="not found" running runningLabel="실행 중" />)
    expect(screen.getByText('not found').className).toContain('sp-shell__err')
    expect(screen.getByText('실행 중')).toBeTruthy()
  })
})
