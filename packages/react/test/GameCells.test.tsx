/** Plan 3, Task 7: MonCell, DexStrip, StatTile. Values: pokedex.css 17–40 (.w-dex), 104–128 (.dex-cell), 133–160 (.dex-stat), 342–369 (.box-cell), 527–531 (.rank-partners), 571–573 (.w-swap-cell) */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DexStrip, MonCell, StatTile } from '../src'
import { css, rule } from './css'

describe('MonCell', () => {
  const c = () => css('MonCell', 'mon-cell.css')
  it('a button named by its label, pressed when picked', () => {
    const go = vi.fn()
    render(<MonCell look="dex" label="피카츄 #25" sprite={<img alt="" />} picked onClick={go} />)
    const b = screen.getByRole('button', { name: '피카츄 #25' })
    expect(b.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(b); expect(go).toHaveBeenCalledTimes(1)
  })
  it('all on --mon-bg (hover --mon-bg-hover), --r-m', () => {
    expect(rule(c(), '.sp-mon-cell')).toMatchObject({ background: 'var(--mon-bg)', 'border-radius': 'var(--r-m)' })
    expect(rule(c(), '.sp-mon-cell:hover').background).toBe('var(--mon-bg-hover)')
  })
  it('dex: square, sprite 62; corner labels --t-micro (no., shiny, count); unknown: --unknown-bg and a ? in --q-ink', () => {
    render(<MonCell look="dex" label="모르는 포켓몬" unknown no="#0025" />)
    expect(screen.getByText('?').className).toBe('sp-mon-cell__q')
    expect(rule(c(), '.sp-mon-cell--dex')).toMatchObject({ 'aspect-ratio': '1' })
    expect(rule(c(), '.sp-mon-cell--dex img')).toMatchObject({ width: '62px', height: '62px' })
    expect(rule(c(), '.sp-mon-cell--unknown').background).toBe('var(--unknown-bg)')
    expect(rule(c(), '.sp-mon-cell__q')).toMatchObject({ color: 'var(--q-ink)', 'font-size': '14px' })
    expect(rule(c(), '.sp-mon-cell__no')).toMatchObject({ left: '6px', top: '4px', 'font-size': 'var(--t-micro)' })
  })
  it('box: 96, padding 16, sprite 50; box-icon: padding 14, sprite at most 48 (never larger); a working dot; dragging .4', () => {
    expect(rule(c(), '.sp-mon-cell--box')).toMatchObject({ width: '96px', height: '96px', padding: '16px' })
    expect(rule(c(), '.sp-mon-cell--box img')).toMatchObject({ width: '50px', height: '50px' })
    expect(rule(c(), '.sp-mon-cell--box-icon')).toMatchObject({ padding: '14px' })
    expect(rule(c(), '.sp-mon-cell--box-icon img')).toMatchObject({ 'max-width': '48px', 'max-height': '48px' })
    expect(rule(c(), '.sp-mon-cell__working')).toMatchObject({ width: '5px', height: '5px', background: 'var(--green)' })
    expect(rule(c(), '.sp-mon-cell--dragging').opacity).toBe('0.4')
  })
  it('picked: the 1px yellow ring (dex, box); partner: an --ink-3 border on --sel-bg', () => {
    expect(rule(c(), '.sp-mon-cell--picked')['box-shadow']).toBe('inset 0 0 0 1px var(--accent)')
    expect(rule(c(), '.sp-mon-cell--partner.sp-mon-cell--picked')).toMatchObject({ 'box-shadow': 'none', 'border-color': 'var(--ink-3)', background: 'var(--sel-bg)' })
    expect(rule(c(), '.sp-mon-cell--partner')).toMatchObject({ width: '44px', height: '44px' })
  })
  it('picker: 8px 4px 6px, a clear border that shows on hover, its label --t-micro', () => {
    render(<MonCell look="picker" label="꼬부기" sprite={<img alt="" />} caption="꼬부기" />)
    expect(rule(c(), '.sp-mon-cell--picker')).toMatchObject({ padding: '8px 4px 6px', border: '1px solid transparent', 'font-size': 'var(--t-micro)' })
    expect(rule(c(), '.sp-mon-cell--picker:hover')['border-color']).toBe('var(--line-hover)')
  })
})

describe('DexStrip', () => {
  it('a button: the label, the count of the total, the latest catches at 21; a new dot when there is news', () => {
    const go = vi.fn()
    render(<DexStrip label="도감" count={185} total={1025} recent={[{ key: 'a', sprite: <img alt="" /> }]} isNew newLabel="새로 잡음" onOpen={go} />)
    const b = screen.getByRole('button', { name: /도감 185 \/ 1025/ })
    fireEvent.click(b); expect(go).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /새로 잡음/ })).toBeTruthy()
    const c = css('DexStrip', 'dex-strip.css')
    expect(rule(c, '.sp-dex-strip')).toMatchObject({ 'grid-template-columns': 'auto auto 1fr', 'column-gap': '10px' })
    expect(rule(c, '.sp-dex-strip__recent > *')).toMatchObject({ width: 'var(--strip-mon)', height: 'var(--strip-mon)', 'margin-left': '3px' })
    expect(rule(c, '.sp-dex-strip__new')).toMatchObject({ width: '5px', height: '5px', background: 'var(--new-dot)' })
  })
})

describe('StatTile', () => {
  it('the label, the value large (--t-num + 8px, --w-strong, -2 %), of the total, the %, a 2px bar', () => {
    render(<StatTile label="잡은 종류" value={185} of={1025} pct={0.18} />)
    expect(screen.getByText('185').tagName).toBe('B')
    expect(screen.getByRole('meter')).toBeTruthy()
    const c = css('StatTile', 'stat-tile.css')
    expect(rule(c, '.sp-stat__value b')).toMatchObject({ 'font-size': 'calc(var(--t-num) + 8px)', 'font-weight': 'var(--w-strong)', 'letter-spacing': '-0.02em' })
    expect(rule(c, '.sp-stat')).toMatchObject({ padding: '0 20px', 'border-left': '1px solid var(--line)' })
    expect(rule(c, '.sp-stat:first-child')).toMatchObject({ 'border-left': '0', 'padding-left': '0' })
  })
  it('a tier column: its word in the tier\'s colour, its number (--t-num + 3px), the bar in --tier', () => {
    render(<StatTile tier="legendary" label="전설" value={3} of={74} pct={0.04} />)
    expect(document.querySelector('.sp-stat')?.className).toContain('tier-legendary')
    const c = css('StatTile', 'stat-tile.css')
    expect(rule(c, '.sp-stat--tier .sp-stat__value b')['font-size']).toBe('calc(var(--t-num) + 3px)')
    expect(rule(c, '.sp-stat--tier .sp-stat__label').color).toBe('var(--tier)')
    expect(rule(c, '.sp-stat--tier .sp-meter__fill').background).toBe('var(--tier)')
  })
})
