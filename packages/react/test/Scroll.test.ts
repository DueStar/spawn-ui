/** The scrollbar utility: spawn's four scrollbars (widget 8, party 6, chat 10, rail none), as one class each */
import { describe, expect, it } from 'vitest'
import { css, rule } from './css'

const c = () => css('styles', 'scroll.css')
describe('sp-scroll', () => {
  it('8: the widget\'s (px:463) — 8px, #2c303b thumb inset by a 2px clear border, lighter on hover', () => {
    expect(rule(c(), '.sp-scroll--8::-webkit-scrollbar')).toMatchObject({ width: '8px', height: '8px' })
    expect(rule(c(), '.sp-scroll--8::-webkit-scrollbar-thumb')).toMatchObject({ background: '#2c303b', 'border-radius': 'var(--r-s)', border: '2px solid transparent', 'background-clip': 'padding-box' })
    expect(rule(c(), '.sp-scroll--8::-webkit-scrollbar-thumb:hover').background).toBe('#3a3f4c')
  })
  it('6: the party\'s (w:245) — 6px, --r-xs thumb, no arrows', () => {
    expect(rule(c(), '.sp-scroll--6::-webkit-scrollbar').width).toBe('6px')
    expect(rule(c(), '.sp-scroll--6::-webkit-scrollbar-thumb')).toMatchObject({ background: '#2c303b', 'border-radius': 'var(--r-xs)' })
    expect(rule(c(), '.sp-scroll--6::-webkit-scrollbar-button')).toMatchObject({ display: 'none' })
  })
  it('10: the chat\'s (ch:161) — 10px track, a white 10 % thumb 4px wide, 22 % on hover', () => {
    expect(rule(c(), '.sp-scroll--10::-webkit-scrollbar').width).toBe('10px')
    expect(rule(c(), '.sp-scroll--10::-webkit-scrollbar-thumb')).toMatchObject({ background: 'rgba(255, 255, 255, 0.1)', 'border-width': '2px 4px 2px 2px', 'min-height': '32px' })
    expect(rule(c(), '.sp-scroll--10::-webkit-scrollbar-thumb:hover')['background-color']).toBe('rgba(255, 255, 255, 0.22)')
  })
  it('0: none at all (we:615, ch:618)', () => {
    expect(rule(c(), '.sp-scroll--0')['scrollbar-width']).toBe('none')
    expect(rule(c(), '.sp-scroll--0::-webkit-scrollbar').display).toBe('none')
  })
  it('the stylesheet is in the package\'s styles.css', () => {
    expect(css('..', 'scripts/build-styles.ts')).toContain("'scroll.css'")
  })
})
