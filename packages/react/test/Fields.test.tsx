/** Fields (plan 2, Task 4): TextInput, SearchField, FindBar. Values: docs/inventory.md §2.4, §4 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FindBar, SearchField, TextInput } from '../src'
import { css, rule } from './css'

const composing = (el: HTMLElement) => fireEvent.keyDown(el, { key: 'Enter', isComposing: true, keyCode: 229 })

describe('TextInput', () => {
  const c = () => css('TextInput', 'text-input.css')
  it('named by its label; Enter submits the value, Esc cancels', () => {
    const sub = vi.fn(); const off = vi.fn()
    render(<TextInput label="세션 이름" defaultValue="첫 세션" onSubmit={sub} onCancel={off} />)
    const f = screen.getByRole('textbox', { name: '세션 이름' })
    fireEvent.keyDown(f, { key: 'Enter' }); expect(sub).toHaveBeenCalledWith('첫 세션')
    fireEvent.keyDown(f, { key: 'Escape' }); expect(off).toHaveBeenCalledTimes(1)
  })
  it('an Enter that ends a Korean composition submits nothing', () => {
    const sub = vi.fn()
    render(<TextInput label="n" onSubmit={sub} />)
    composing(screen.getByRole('textbox', { name: 'n' }))
    expect(sub).not.toHaveBeenCalled()
  })
  it('multiline: Enter alone is a new line; Ctrl+Enter submits', () => {
    const sub = vi.fn()
    render(<TextInput label="m" multiline onSubmit={sub} />)
    const f = screen.getByRole('textbox', { name: 'm' })
    expect(f.tagName).toBe('TEXTAREA')
    fireEvent.keyDown(f, { key: 'Enter' }); expect(sub).not.toHaveBeenCalled()
    fireEvent.keyDown(f, { key: 'Enter', ctrlKey: true }); expect(sub).toHaveBeenCalledTimes(1)
  })
  it('rename (w-row-rename): --card, an --ink-3 hairline at rest, 2px 7px, --t-name 500', () => {
    render(<TextInput label="r" look="rename" />)
    expect(screen.getByRole('textbox').className).toBe('sp-text-input sp-text-input--rename')
    expect(rule(c(), '.sp-text-input').background).toBe('var(--card)')
    expect(rule(c(), '.sp-text-input--rename')).toMatchObject({ 'border-color': 'var(--ink-3)', padding: '2px 7px', 'font-size': 'var(--t-name)', 'font-weight': 'var(--w-name)' })
  })
  it('form sizes: times 4px 6px, tool 6px 9px, rank 6px 10px at 180px', () => {
    expect(rule(c(), '.sp-text-input--times').padding).toBe('4px 6px')
    expect(rule(c(), '.sp-text-input--tool').padding).toBe('6px 9px')
    expect(rule(c(), '.sp-text-input--rank')).toMatchObject({ padding: '6px 10px', width: '180px' })
  })
  it('card (chat-card-field): --bg, height 30px, 0 10px; its focus border --line-hover (the others --ink-3)', () => {
    expect(rule(c(), '.sp-text-input--card')).toMatchObject({ background: 'var(--bg)', height: '30px', padding: '0 10px' })
    expect(rule(c(), '.sp-text-input--card:focus')['border-color']).toBe('var(--line-hover)')
    expect(rule(c(), '.sp-text-input:focus')['border-color']).toBe('var(--ink-3)')
  })
  it('note (fb-text): a textarea on --bg, 9px 11px, min-height 78px, --t-name', () => {
    expect(rule(c(), '.sp-text-input--note')).toMatchObject({ background: 'var(--bg)', padding: '9px 11px', 'min-height': '78px', 'font-size': 'var(--t-name)' })
  })
  it('focus shows by the border; the browser outline is made transparent, not removed (still drawn in forced colours)', () => {
    expect(rule(c(), '.sp-text-input').outline).toBe('1px solid transparent')
    expect(rule(c(), '.sp-text-input:focus').outline).toBeUndefined()
  })
  it('grows with the text (no fixed height except the card field, as spawn has it)', () => {
    for (const s of ['.sp-text-input', '.sp-text-input--rename', '.sp-text-input--times', '.sp-text-input--tool', '.sp-text-input--rank', '.sp-text-input--note']) expect(rule(c(), s).height, s).toBeUndefined()
  })
})

describe('SearchField', () => {
  const c = () => css('SearchField', 'search-field.css')
  it('a search box named by its label, reporting each change', () => {
    const ch = vi.fn()
    render(<SearchField label="도감 검색" value="" onChange={ch} />)
    const f = screen.getByRole('searchbox', { name: '도감 검색' })
    fireEvent.change(f, { target: { value: '피카' } })
    expect(ch).toHaveBeenCalledWith('피카')
  })
  it('widths 150 (5px 9px), 120 (4px 8px); 170 with the icon keeps 26px at the right for it', () => {
    render(<SearchField label="s" value="" onChange={() => {}} width={170} icon />)
    expect(document.querySelector('.sp-search')?.className).toBe('sp-search sp-search--170 sp-search--icon')
    expect(rule(c(), '.sp-search--150 .sp-search__input')).toMatchObject({ width: '150px', padding: '5px 9px' })
    expect(rule(c(), '.sp-search--120 .sp-search__input')).toMatchObject({ width: '120px', padding: '4px 8px' })
    expect(rule(c(), '.sp-search--170 .sp-search__input')).toMatchObject({ width: '170px', padding: '5px 26px 5px 9px' })
    expect(rule(c(), '.sp-search__icon')).toMatchObject({ position: 'absolute', right: '9px', color: 'var(--ink-3)' })
  })
})

describe('FindBar', () => {
  const c = () => css('FindBar', 'find-bar.css')
  const props = () => ({ label: '대화에서 찾기', value: '강', onChange: vi.fn(), onNext: vi.fn(), onPrev: vi.fn(), onClose: vi.fn(), count: { current: 2, total: 5 } })
  it('Enter next, Shift+Enter previous, Esc close; a composing Enter does nothing', () => {
    const p = props()
    render(<FindBar {...p} />)
    const f = screen.getByRole('searchbox', { name: '대화에서 찾기' })
    fireEvent.keyDown(f, { key: 'Enter' }); expect(p.onNext).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(f, { key: 'Enter', shiftKey: true }); expect(p.onPrev).toHaveBeenCalledTimes(1)
    composing(f); expect(p.onNext).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(f, { key: 'Escape' }); expect(p.onClose).toHaveBeenCalledTimes(1)
  })
  it('the count reads 2/5 in a polite live region; its buttons are named', () => {
    render(<FindBar {...props()} labels={{ next: '다음', prev: '이전', close: '닫기' }} />)
    const n = document.querySelector('.sp-find__count')!
    expect(n.textContent).toBe('2/5')
    expect(n.getAttribute('aria-live')).toBe('polite')
    for (const name of ['다음', '이전', '닫기']) expect(screen.getByRole('button', { name })).toBeTruthy()
  })
  it('the box (chat-find / term-search): top 10 right 18, --card-2, a 10 % white border, --r-m, 4px 4px 4px 8px', () => {
    expect(rule(c(), '.sp-find')).toMatchObject({ position: 'absolute', top: '10px', right: '18px', background: 'var(--card-2)', border: '1px solid rgba(255, 255, 255, 0.1)', 'border-radius': 'var(--r-m)', padding: '4px 4px 4px 8px' })
    expect(rule(c(), '.sp-find--chat:focus-within')['border-color']).toBe('var(--line-hover)')
  })
  it('its input is 200 wide (24 high in the chat); count 44 wide --t-meta; buttons 24×24', () => {
    expect(rule(c(), '.sp-find__input').width).toBe('200px')
    expect(rule(c(), '.sp-find--chat .sp-find__input').height).toBe('24px')
    expect(rule(c(), '.sp-find__count')).toMatchObject({ 'min-width': '44px', 'font-size': 'var(--t-meta)' })
    expect(rule(c(), '.sp-find .sp-icon-button')).toMatchObject({ width: '24px', height: '24px', color: 'var(--ink-2)' })
  })
  it('a note under it in the chat', () => {
    render(<FindBar {...props()} note="펼친 내용만 찾아요" />)
    expect(screen.getByText('펼친 내용만 찾아요').className).toBe('sp-find__note')
  })
})
