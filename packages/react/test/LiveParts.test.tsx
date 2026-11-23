/** Plan 3, Task 6: DragCard, DropZone, QueueStrip, UpdateButton, TextSizeControl, UsageBars. Values: widget.css 91–92, 131–133, 247–265, 266–270, 332–350; widget-expanded.css 426–446, 689–690; chat.css 263–266, 526–533 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DragCard, DropZone, QueueStrip, TextSizeControl, UpdateButton, UsageBars } from '../src'
import { css, rule } from './css'

describe('DragCard', () => {
  it('fixed at the pointer, max 220, 5px 10px 5px 6px, --card-2 in a --line-hover hairline, the drag shadow; unseen by screen readers', () => {
    render(<DragCard picture={<i />} label="로그인 고치기" x={100} y={50} />)
    const d = document.querySelector('.sp-drag-card') as HTMLElement
    expect(d.getAttribute('aria-hidden')).toBe('true')
    expect(d.style.left).toBe('100px')
    expect(rule(css('DragCard', 'drag-card.css'), '.sp-drag-card')).toMatchObject({ position: 'fixed', 'max-width': '220px', padding: '5px 10px 5px 6px', background: 'var(--card-2)', border: '1px solid var(--line-hover)', 'box-shadow': '0 8px 24px rgba(0, 0, 0, 0.45)', 'pointer-events': 'none' })
  })
})

describe('DropZone', () => {
  it('the slot as %, a dashed yellow edge, its hint said politely; full turns the hint red', () => {
    render(<DropZone left={1 / 3} width={1 / 3} hint="놓으면 여기 열려요" full />)
    const z = document.querySelector('.sp-drop-zone') as HTMLElement
    expect(z.style.left).toBe('33.333%')
    expect(z.className).toContain('sp-drop-zone--full')
    expect(screen.getByRole('status').textContent).toBe('놓으면 여기 열려요')
    const c = css('DropZone', 'drop-zone.css')
    expect(rule(c, '.sp-drop-zone')).toMatchObject({ border: '1.5px dashed color-mix(in srgb, var(--accent) 60%, transparent)', 'border-radius': 'var(--r-l)', transition: 'left 120ms cubic-bezier(0.2, 0, 0, 1), width 120ms cubic-bezier(0.2, 0, 0, 1)' })
    expect(rule(c, '.sp-drop-zone--full .sp-drop-zone__hint').color).toBe('var(--red-text)')
  })
})

describe('QueueStrip', () => {
  it('a button saying how many wait and the first; it opens the list (aria-expanded); 30 tall, 0 12px, a faint fill, a top-rounded hairline', () => {
    const t = vi.fn()
    const { rerender } = render(<QueueStrip label="대기 중 2" first="README도 고쳐 줘" items={['README도 고쳐 줘', '테스트도']} open={false} onToggle={t} />)
    const b = screen.getByRole('button', { name: /대기 중 2/ })
    expect(b.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(b); expect(t).toHaveBeenCalledTimes(1)
    rerender(<QueueStrip label="대기 중 2" first="README도 고쳐 줘" items={['README도 고쳐 줘', '테스트도']} open onToggle={t} />)
    expect(screen.getByRole('list').children.length).toBe(2)
    const c = css('QueueStrip', 'queue-strip.css')
    expect(rule(c, '.sp-queue')).toMatchObject({ height: '30px', padding: '0 12px', background: 'rgba(255, 255, 255, 0.025)', 'border-bottom': '0', 'border-top-left-radius': 'var(--r-l)' })
    expect(rule(c, '.sp-queue__list')['max-height']).toBe('180px')
  })
})

describe('UpdateButton', () => {
  const c = () => css('UpdateButton', 'update-button.css')
  it('every state says itself in words (available · downloading n% · ready · failed)', () => {
    const { rerender } = render(<UpdateButton state="available" label="업데이트" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: '업데이트' }).textContent).toContain('업데이트')
    rerender(<UpdateButton state="downloading" progress={0.42} label="받는 중" onClick={() => {}} />)
    const b = screen.getByRole('button', { name: /받는 중 42%/ })
    expect(b.textContent).toContain('42%')
    expect((b as HTMLButtonElement).disabled).toBe(true)
    rerender(<UpdateButton state="failed" label="업데이트 실패" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: '업데이트 실패' })).toBeTruthy()
  })
  it('the accent pill (0 7px 0 6px, gap 3, --t-meta 500); downloading at .5; failed: no fill, a 45 % danger ring, --red-text', () => {
    expect(rule(c(), '.sp-update')).toMatchObject({ height: '22px', background: 'var(--accent)', color: 'var(--accent-ink)', padding: '0 7px 0 6px', gap: '3px', 'font-size': 'var(--t-meta)' })
    expect(rule(c(), '.sp-update--downloading').opacity).toBe('0.5')
    expect(rule(c(), '.sp-update--failed')).toMatchObject({ background: 'none', 'box-shadow': 'inset 0 0 0 1px color-mix(in srgb, var(--danger) 45%, transparent)', color: 'var(--red-text)' })
  })
})

describe('TextSizeControl', () => {
  const steps = [{ value: 90, label: '작게' }, { value: 100, label: '보통' }, { value: 110, label: '크게' }]
  const labels = { smaller: '글자 작게', larger: '글자 크게', menu: '글자 크기' }
  it('− and + step to the neighbour, and stop at the ends (disabled)', () => {
    const on = vi.fn()
    const { rerender } = render(<TextSizeControl step={100} steps={steps} onStep={on} labels={labels} />)
    fireEvent.click(screen.getByRole('button', { name: '글자 크게' })); expect(on).toHaveBeenLastCalledWith(110)
    fireEvent.click(screen.getByRole('button', { name: '글자 작게' })); expect(on).toHaveBeenLastCalledWith(90)
    rerender(<TextSizeControl step={110} steps={steps} onStep={on} labels={labels} />)
    expect((screen.getByRole('button', { name: '글자 크게' }) as HTMLButtonElement).disabled).toBe(true)
  })
  it('boxed 28 tall, a --line hairline, --r-m; the steps 24 wide at a fixed 14px; the current step --t-meta between hairlines', () => {
    const c = css('TextSizeControl', 'text-size.css')
    expect(rule(c, '.sp-textsize')).toMatchObject({ height: '28px', border: '1px solid var(--line)', 'border-radius': 'var(--r-m)', margin: '0 4px 0 6px' })
    expect(rule(c, '.sp-textsize__step')).toMatchObject({ width: '24px', 'font-size': '14px' })
    expect(rule(c, '.sp-textsize__cur')).toMatchObject({ 'font-size': 'var(--t-meta)', 'border-left': '1px solid var(--line)', 'border-right': '1px solid var(--line)' })
  })
  it('compact: one 가 button that opens the steps as a menu', () => {
    render(<TextSizeControl compact step={100} steps={steps} onStep={() => {}} labels={labels} />)
    expect(screen.queryByRole('button', { name: '글자 크게' })).toBeNull()
    expect(screen.getByRole('button', { name: /글자 크기/ }).textContent).toContain('가')
  })
})

describe('UsageBars', () => {
  const limits = [{ label: '5시간', pct: 0.46, reset: '16:20' }, { label: '주간', pct: 0.82, reset: '11/17' }, { label: '월', pct: 0.95, reset: '12/1' }]
  it('a grid of label · bar · % · reset (minmax(36px, max-content) 1fr 30px 74px, gaps 10 / 7, 9px 12px)', () => {
    render(<UsageBars limits={limits} />)
    expect(screen.getAllByRole('meter').length).toBe(3)
    expect(screen.getByText('46%')).toBeTruthy()
    expect(rule(css('UsageBars', 'usage-bars.css'), '.sp-usage')).toMatchObject({ 'grid-template-columns': 'minmax(36px, max-content) minmax(0, 1fr) 30px 74px', 'column-gap': '10px', 'row-gap': '7px', padding: '9px 12px' })
  })
  it('tones at spawn\'s thresholds: amber from 80 %, red from 90 % (the % words too)', () => {
    render(<UsageBars limits={limits} />)
    expect(screen.getByText('82%').className).toContain('sp-usage__pct--warn')
    expect(screen.getByText('95%').className).toContain('sp-usage__pct--danger')
    const c = css('UsageBars', 'usage-bars.css')
    expect(rule(c, '.sp-usage__pct--warn').color).toBe('var(--amber)')
    expect(rule(c, '.sp-usage__pct--danger').color).toBe('var(--red-text)')
  })
  it('loading shimmers (off under reduced motion); idle shows its hint instead', () => {
    const { rerender } = render(<UsageBars limits={limits} loading />)
    expect(document.querySelector('.sp-usage--loading')).not.toBeNull()
    rerender(<UsageBars limits={[]} idle="세션을 열면 사용량이 보여요" />)
    expect(screen.getByText('세션을 열면 사용량이 보여요').className).toBe('sp-usage__hint')
  })
})
