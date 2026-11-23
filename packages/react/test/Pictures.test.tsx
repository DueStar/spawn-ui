/** Plan 3, Task 2: PokemonSprite, SessionPicture, TierLabel, TypeTag. Values: inventory §2.5 SessionPicture, §2.6, §4 Sprites */
import { render, screen } from '@testing-library/react'
import { Terminal } from '@phosphor-icons/react'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { PokemonSprite, SessionPicture, TierLabel, TypeTag, POKEMON_TYPES } from '../src'
import { css, rule } from './css'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')
const allCss = () => { const walk = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] }); return walk(SRC).filter(f => f.endsWith('.css')).map(f => readFileSync(f, 'utf8')).join('\n') }

describe('PokemonSprite', () => {
  it('an image at its size, contained, not draggable, decorative unless named', () => {
    render(<PokemonSprite src="/p/25.png" size={24} />)
    const img = document.querySelector('img')!
    expect(img.getAttribute('width')).toBe('24')
    expect(img.getAttribute('alt')).toBe('')
    expect(img.getAttribute('draggable')).toBe('false')
    expect(rule(css('PokemonSprite', 'sprite.css'), '.sp-sprite')).toMatchObject({ 'object-fit': 'contain', 'image-rendering': 'auto' })
  })
  it('max: never larger than its natural size (the box icon look)', () => {
    render(<PokemonSprite src="/p/25.png" size={48} max alt="피카츄" />)
    const img = screen.getByAltText('피카츄')
    expect(img.getAttribute('width')).toBeNull()
    expect(img.style.maxWidth).toBe('48px')
  })
  it('silhouette and faded are classes; the silhouette filter is written once in the whole package', () => {
    render(<PokemonSprite src="x" size={24} silhouette faded />)
    expect(document.querySelector('img')!.className).toBe('sp-sprite sp-silhouette sp-sprite--faded')
    expect(rule(css('PokemonSprite', 'sprite.css'), '.sp-silhouette').filter).toBe('brightness(0) invert(0.32)')
    expect(rule(css('PokemonSprite', 'sprite.css'), '.sp-sprite--faded')).toMatchObject({ opacity: '0.4', filter: 'grayscale(0.6)' })
    expect(allCss().match(/brightness\(0\)/g)?.length).toBe(1)
  })
  it('pixelated only when asked (the wild row)', () => {
    render(<PokemonSprite src="x" size={24} pixelated />)
    expect(document.querySelector('img')!.className).toContain('sp-sprite--pixelated')
    expect(rule(css('PokemonSprite', 'sprite.css'), '.sp-sprite--pixelated')['image-rendering']).toBe('pixelated')
  })
})

describe('SessionPicture', () => {
  const c = () => css('SessionPicture', 'session-picture.css')
  it('picture: the sprite at the size asked', () => {
    render(<SessionPicture kind="picture" src="/p/1.png" size={22} />)
    expect(document.querySelector('.sp-session-picture')?.className).toBe('sp-session-picture sp-session-picture--picture')
    expect((document.querySelector('.sp-session-picture') as HTMLElement).style.width).toBe('22px')
  })
  it('glyph (w-row-glyph): a --line hairline box, --r-s (64: --r-l), the terminal icon in --ink-3', () => {
    render(<SessionPicture kind="glyph" size={24} label="Claude" />)
    expect(screen.getByRole('img', { name: 'Claude' })).toBeTruthy()
    expect(rule(c(), '.sp-session-picture--glyph')).toMatchObject({ border: '1px solid var(--line)', 'border-radius': 'var(--r-s)', color: 'var(--ink-3)' })
    expect(rule(c(), '.sp-session-picture--glyph.sp-session-picture--64')['border-radius']).toBe('var(--r-l)')
  })
  it('shell (w-row-shell): >_ in mono 10px 500 in a hairline box', () => {
    render(<SessionPicture kind="shell" size={24} />)
    expect(document.querySelector('.sp-session-picture--shell')?.textContent).toBe('>_')
    expect(rule(c(), '.sp-session-picture--shell')).toMatchObject({ 'font-size': '10px', border: '1px solid var(--line)' })
  })
  it('hop (needs-you): wMonHop 1.2s, from the bottom', () => {
    render(<SessionPicture kind="picture" src="x" size={24} hop />)
    expect(document.querySelector('.sp-session-picture')?.className).toContain('sp-session-picture--hop')
    expect(rule(c(), '.sp-session-picture--hop')).toMatchObject({ animation: 'sp-mon-hop 1.2s cubic-bezier(.3, .7, .4, 1) infinite', 'transform-origin': '50% 100%' })
  })
})

describe('TierLabel', () => {
  it('the dot and the word in the tier\'s colour, --t-meta 500, gap 5 (4 in the log and the wild row)', () => {
    render(<><TierLabel tier="legendary">전설</TierLabel><TierLabel tier="rare" gap={4}>희귀</TierLabel></>)
    const l = screen.getByText('전설').parentElement!
    expect(l.className).toBe('sp-tier-label tier-legendary')
    expect(l.querySelector('.tdot')).not.toBeNull()
    expect(screen.getByText('희귀').parentElement!.className).toContain('sp-tier-label--gap-4')
    const c = css('TierLabel', 'tier-label.css')
    expect(rule(c, '.sp-tier-label')).toMatchObject({ gap: '5px', color: 'var(--tier)', 'font-size': 'var(--t-meta)', 'font-weight': 'var(--w-name)' })
    expect(rule(c, '.sp-tier-label')['background']).toBeUndefined()
  })
})

describe('TypeTag', () => {
  it('a hairline tag in the type\'s own colour; 18 types, normal in --ink', () => {
    expect(POKEMON_TYPES.length).toBe(18)
    render(<TypeTag type="fire">불꽃</TypeTag>)
    expect(screen.getByText('불꽃').className).toBe('sp-type-tag sp-type--fire')
    const c = css('TypeTag', 'type-tag.css')
    expect(rule(c, '.sp-type-tag')).toMatchObject({ padding: '0 6px', border: '1px solid var(--line)', 'border-radius': 'var(--r-xs)', color: 'var(--ink)' })
    expect(rule(c, '.sp-type--fire').color).toBe('#ffb08a')
    expect(rule(c, '.sp-type--steel').color).toBe('#d6dde9')
  })
})

describe('the guard\'s one fixed-size exception', () => {
  it('10px is allowed only in session-picture.css (spawn\'s shell glyph), listed with its source', () => {
    expect(readFileSync(join(SRC, '..', 'test', 'guards.test.ts'), 'utf8')).toMatch(/FIXED_PX_OK[\s\S]*'session-picture\.css'/)
    void Terminal
  })
})
