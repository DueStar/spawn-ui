/** Plan 4, Task 6: Composer, ControlRow, FileChip, ImageChip, SuggestionList. Values: chat.css 256–310, 336–341, 494–510, 546–556 */
import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Composer, ControlItem, ControlRow, FileChip, ImageChip, SuggestionList } from '../src'
import { css, rule } from './css'

function C({ onSend = vi.fn(), onStop, busy }: { onSend?: () => void; onStop?: () => void; busy?: boolean }) {
  const [v, setV] = useState('안녕')
  return <Composer label="메시지" value={v} onChange={setV} onSend={onSend} sendLabel="보내기" busy={busy} onStop={onStop} stopLabel="멈추기" />
}

describe('Composer', () => {
  const c = () => css('Composer', 'composer.css')
  it('Enter sends, Shift+Enter does not, an Enter ending a composition does not', () => {
    const send = vi.fn()
    render(<C onSend={send} />)
    const f = screen.getByRole('textbox', { name: '메시지' })
    fireEvent.keyDown(f, { key: 'Enter', shiftKey: true }); expect(send).not.toHaveBeenCalled()
    fireEvent.keyDown(f, { key: 'Enter', isComposing: true, keyCode: 229 }); expect(send).not.toHaveBeenCalled()
    fireEvent.keyDown(f, { key: 'Enter' }); expect(send).toHaveBeenCalledTimes(1)
  })
  it('the send button is named; Esc stops while busy', () => {
    const stop = vi.fn()
    render(<C busy onStop={stop} />)
    expect(screen.getByRole('button', { name: '보내기' })).toBeTruthy()
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' }); expect(stop).toHaveBeenCalledTimes(1)
  })
  it('box: 8px 8px 8px 12px on --card, --r-l, focus edge 16 % white; field 22–160, --t-prose lh 1.6; send 30 in the one yellow', () => {
    expect(rule(c(), '.sp-composer__box')).toMatchObject({ padding: '8px 8px 8px 12px', background: 'var(--card)', 'border-radius': 'var(--r-l)', gap: '6px' })
    expect(rule(c(), '.sp-composer__box:focus-within')['border-color']).toBe('rgba(255, 255, 255, 0.16)')
    expect(rule(c(), '.sp-composer__input')).toMatchObject({ 'min-height': '22px', 'max-height': '160px', 'font-size': 'var(--t-prose)', 'line-height': '1.6' })
    expect(rule(c(), '.sp-composer__send')).toMatchObject({ width: '30px', height: '30px', background: 'var(--accent)', 'border-radius': 'var(--r-m)' })
    expect(rule(c(), '.sp-composer__send--empty').background).toBe('rgba(255, 255, 255, 0.06)')
    expect(rule(c(), '.sp-composer')).toMatchObject({ padding: '0 32px 14px' })
  })
  it('an empty draft: the send is dimmed, not yellow, and sends nothing', () => {
    const send = vi.fn()
    render(<Composer label="m" value="" onChange={() => {}} onSend={send} sendLabel="보내기" />)
    const b = screen.getByRole('button', { name: '보내기' })
    expect(b.className).toContain('sp-composer__send--empty')
    fireEvent.click(b); expect(send).not.toHaveBeenCalled()
  })
  it('shell mode: a brighter edge and mono', () => {
    expect(rule(c(), '.sp-composer__box--shell')['border-color']).toBe('rgba(255, 255, 255, 0.22)')
    expect(rule(c(), '.sp-composer__box--shell .sp-composer__input')['font-size']).toBe('var(--t-code)')
  })
})

describe('ControlRow', () => {
  it('mt 6, gap 2, --t-meta --ink-3; items 3px 6px; a button item hovers --hover', () => {
    render(<ControlRow><ControlItem label="모델" value="Opus 5.5" onClick={() => {}} /><ControlItem label="생각" value="보통" /></ControlRow>)
    expect(screen.getByRole('button', { name: /모델/ })).toBeTruthy()
    const c = css('ControlRow', 'control-row.css')
    expect(rule(c, '.sp-ctrl')).toMatchObject({ 'margin-top': '6px', gap: '2px', 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
    expect(rule(c, '.sp-ctrl__item')).toMatchObject({ padding: '3px 6px' })
    expect(rule(c, 'button.sp-ctrl__item:hover:not(:disabled)').background).toBe('var(--hover)')
  })
})

describe('FileChip', () => {
  const c = () => css('FileChip', 'file-chip.css')
  it('the name shown, the whole path in its title; opens with a click', () => {
    const o = vi.fn()
    render(<FileChip path="src/components/ChatView.tsx" look="prose" onOpen={o} />)
    const b = screen.getByRole('button', { name: /ChatView\.tsx/ })
    expect(b.getAttribute('title')).toBe('src/components/ChatView.tsx')
    fireEvent.click(b); expect(o).toHaveBeenCalledTimes(1)
  })
  it('looks: prose (mono --t-prose − 2, 5 % white), inline (6 %), pill (a hairline 3px 8px), draft (h26, its × named)', () => {
    const r = vi.fn()
    render(<FileChip path="a.ts" look="draft" onRemove={r} removeLabel="a.ts 빼기" />)
    fireEvent.click(screen.getByRole('button', { name: 'a.ts 빼기' })); expect(r).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-fchip--prose .sp-fchip__in')).toMatchObject({ 'font-size': 'calc(var(--t-prose) - 2px)', background: 'rgba(255, 255, 255, 0.05)' })
    expect(rule(c(), '.sp-fchip--inline')).toMatchObject({ background: 'rgba(255, 255, 255, 0.06)', padding: '0 6px' })
    expect(rule(c(), '.sp-fchip--pill')).toMatchObject({ padding: '3px 8px', border: '1px solid var(--line)' })
    expect(rule(c(), '.sp-fchip--draft')).toMatchObject({ height: '26px', padding: '0 2px 0 8px', 'border-radius': 'var(--r-s)' })
  })
})

describe('ImageChip', () => {
  it('chip: h30, max 220, a 34×22 thumb on white, × 22 named; thumb: 160×100 cover', () => {
    render(<ImageChip src="x.png" name="화면.png" look="chip" onOpen={() => {}} onRemove={() => {}} removeLabel="화면.png 빼기" openLabel="크게 보기" />)
    expect(screen.getByRole('button', { name: '화면.png 빼기' })).toBeTruthy()
    const c = css('ImageChip', 'image-chip.css')
    expect(rule(c, '.sp-ichip')).toMatchObject({ height: '30px', 'max-width': '220px' })
    expect(rule(c, '.sp-ichip__pic img')).toMatchObject({ width: '34px', height: '22px', background: '#fff' })
    expect(rule(c, '.sp-ithumb img')).toMatchObject({ width: '160px', height: '100px', 'object-fit': 'cover' })
  })
})

describe('SuggestionList', () => {
  it('a listbox (the field drives it): the active option selected; rows min 26, 4px 8px', () => {
    const pick = vi.fn()
    render(<SuggestionList id="s" label="명령" items={[{ value: '/clear', label: '/clear', desc: '대화 지우기' }, { value: '/model', label: '/model' }]} active={1} onPick={pick} />)
    const lb = screen.getByRole('listbox', { name: '명령' })
    expect(lb).toBeTruthy()
    expect(screen.getByRole('option', { name: /\/model/ }).getAttribute('aria-selected')).toBe('true')
    fireEvent.mouseDown(screen.getByRole('option', { name: /\/clear/ })); expect(pick).toHaveBeenCalledWith('/clear')
    const c = css('SuggestionList', 'suggestions.css')
    expect(rule(c, '.sp-sugg__item')).toMatchObject({ 'min-height': '26px', padding: '4px 8px' })
    expect(rule(c, '.sp-sugg__item[aria-selected="true"]').background).toBe('var(--sel-bg)')
  })
})
